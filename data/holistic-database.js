window.ANI_HOLISTIC_DATABASE = {
  version: "2026.06-holistic-herbals-v1",
  sourceNote: "NCLEX-focused herbal and holistic medicine safety index built from the user's uploaded NCLEX herbal safety PDF plus reputable public safety references. This is a study reference, not a substitute for current product labeling, poison control, facility policy, or provider/pharmacist review.",
  generalRules: [
    "Always ask specifically about herbals, supplements, teas, powders, oils, gummies, and cannabis/CBD products because clients may not call them medications.",
    "Natural does not mean safe. NCLEX likes herb-drug interaction traps, especially with anticoagulants, antiplatelets, antidepressants, sedatives, diabetes medications, transplant drugs, and perioperative care.",
    "Most nonessential herbals should be stopped 1 to 2 weeks before surgery unless the surgeon/anesthesia team gives different instructions.",
    "Pregnant or breastfeeding clients should avoid most herbal supplements unless a qualified provider specifically approves them.",
    "Teach clients to report jaundice, dark urine, unusual bleeding, severe sedation, palpitations, syncope, allergic symptoms, or worsening psychiatric symptoms."
  ],
  sourceReferences: [
    {
      key: "user-pdf",
      label: "Uploaded NCLEX Herbal & Holistic Medicine: High-Yield Safety Guide"
    },
    {
      key: "nccih-supplements",
      label: "NIH NCCIH dietary supplement safety guidance"
    },
    {
      key: "nccih-interactions",
      label: "NIH NCCIH medication-supplement interaction guidance"
    },
    {
      key: "fda-supplements",
      label: "FDA dietary supplement regulatory guidance"
    },
    {
      key: "medlineplus-herbals",
      label: "NIH MedlinePlus herbs and supplements monographs"
    },
    {
      key: "fda-psychedelic-guidance",
      label: "FDA psychedelic drug clinical investigation guidance"
    },
    {
      key: "dea-psilocybin",
      label: "DEA psilocybin drug fact sheet"
    },
    {
      key: "nih-psilocybin-research",
      label: "NIH psilocybin clinical research summary"
    }
  ],
  remedies: [
    {
      name: "Ginkgo biloba",
      category: "Herbal supplement",
      aliases: ["ginkgo", "ginkgo leaf", "maidenhair tree"],
      usedFor: ["Marketed for memory, cognition, circulation, tinnitus, and dementia symptoms"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk", "May lower seizure threshold", "GI upset, headache, dizziness"],
      interactions: ["Warfarin", "Heparin", "Aspirin", "Clopidogrel", "NSAIDs", "Antiseizure medications"],
      contraindications: ["Bleeding disorders", "Upcoming surgery unless cleared", "Seizure disorder without provider review"],
      nursingAssessment: ["Ask about bruising, epistaxis, tarry stools, anticoagulant use, platelet disorders, and planned procedures"],
      teaching: ["Stop nonessential use 1 to 2 weeks before surgery when instructed", "Report unusual bleeding or seizure activity"],
      nclexTraps: ["A client taking warfarin who adds ginkgo is not just taking a memory supplement; the nurse should worry about bleeding."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless specifically approved because bleeding and product-quality concerns matter in pregnancy." },
        { type: "pediatric", label: "Pediatric caution", note: "Do not use in children unless directed by a pediatric provider." },
        { type: "geriatric", label: "Geriatric caution", note: "Older adults are more likely to use anticoagulants/antiplatelets and to be harmed by bleeding." }
      ],
      tags: ["bleeding", "warfarin", "anticoagulant", "antiplatelet", "surgery", "seizure"],
      sourceKeys: ["user-pdf", "nccih-interactions", "medlineplus-herbals"]
    },
    {
      name: "Garlic supplement",
      category: "Herbal supplement",
      aliases: ["garlic", "allium sativum", "aged garlic extract"],
      usedFor: ["Marketed for cholesterol, blood pressure, immune support, and cardiovascular health"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk at high supplement doses", "May lower blood pressure", "May lower blood glucose", "GI upset and odor"],
      interactions: ["Warfarin", "Aspirin", "Clopidogrel", "NSAIDs", "Antihypertensives", "Diabetes medications"],
      contraindications: ["Bleeding disorder", "Upcoming surgery unless cleared", "Hypotension or recurrent hypoglycemia without provider review"],
      nursingAssessment: ["Assess anticoagulant use, bleeding signs, BP trends, and glucose trends"],
      teaching: ["Food-level garlic is different from concentrated supplement dosing", "Report bruising, black stools, dizziness, or hypoglycemia symptoms"],
      nclexTraps: ["High-dose garlic plus anticoagulants can be a bleeding problem even though garlic sounds like food."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid concentrated supplements unless approved; food amounts are different from medicinal doses." }
      ],
      tags: ["bleeding", "blood pressure", "glucose", "anticoagulant", "diabetes"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Ginger supplement",
      category: "Herbal supplement",
      aliases: ["ginger", "zingiber officinale"],
      usedFor: ["Marketed for nausea, motion sickness, dyspepsia, inflammation, and pregnancy-related nausea"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk at supplement doses", "May lower blood glucose", "Heartburn or GI upset"],
      interactions: ["Warfarin", "Heparin", "Aspirin", "Clopidogrel", "NSAIDs", "Diabetes medications"],
      contraindications: ["Bleeding disorder", "Upcoming surgery unless cleared", "Clients on anticoagulants/antiplatelets without provider review"],
      nursingAssessment: ["Assess bleeding risk, anticoagulant use, glucose trends, and reason for nausea before assuming it is benign"],
      teaching: ["Report bleeding, severe heartburn, or hypoglycemia symptoms", "Tell the obstetric provider before using ginger medicinally during pregnancy"],
      nclexTraps: ["Ginger for nausea is not automatically safe if the client is taking warfarin or has perioperative bleeding risk."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Pregnant clients should ask the obstetric provider before medicinal dosing." }
      ],
      tags: ["nausea", "bleeding", "warfarin", "glucose", "pregnancy"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Ginseng",
      category: "Herbal supplement",
      aliases: ["panax ginseng", "american ginseng", "asian ginseng", "siberian ginseng", "eleuthero"],
      usedFor: ["Marketed for energy, stamina, immune support, cognition, glucose control, and sexual function"],
      nclexEssential: true,
      majorRisks: ["Insomnia", "Tachycardia", "Hypertension", "May lower glucose", "May decrease warfarin effectiveness"],
      interactions: ["Warfarin", "Diabetes medications", "Stimulants", "MAOIs", "Caffeine-heavy products"],
      contraindications: ["Uncontrolled hypertension", "Insomnia/mania risk", "Hypoglycemia risk without provider review"],
      nursingAssessment: ["Check BP, pulse, sleep pattern, glucose, and anticoagulant history"],
      teaching: ["Avoid stacking with stimulants", "Report palpitations, high BP symptoms, or hypoglycemia"],
      nclexTraps: ["Ginseng can make warfarin less effective, which is the opposite trap of many other herbals that increase bleeding."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless specifically approved." },
        { type: "geriatric", label: "Geriatric caution", note: "Older adults may have higher dysrhythmia, hypertension, anticoagulant, and hypoglycemia risk." }
      ],
      tags: ["warfarin", "hypertension", "tachycardia", "hypoglycemia", "insomnia"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Ashwagandha",
      category: "Herbal supplement",
      aliases: ["withania somnifera", "ashwagandha root", "winter cherry", "indian ginseng", "adaptogen"],
      usedFor: ["Marketed for stress, anxiety, sleep, energy, exercise recovery, testosterone/fertility claims, and general adaptogen support"],
      nclexEssential: true,
      majorRisks: ["Can increase thyroid hormone activity or worsen hyperthyroid symptoms in susceptible clients", "Sedation and dizziness", "GI upset", "Rare liver injury reports", "Possible immune stimulation"],
      interactions: ["Thyroid hormone replacement", "Antithyroid medications", "Sedatives", "Alcohol", "Benzodiazepines", "Opioids", "Immunosuppressants", "Antihypertensives", "Diabetes medications"],
      contraindications: ["Pregnancy", "Hyperthyroidism or unstable thyroid disease without provider review", "Autoimmune disease or transplant immunosuppression without provider review", "Active liver disease or unexplained jaundice"],
      nursingAssessment: ["Ask specifically about thyroid disease, levothyroxine or antithyroid drugs, palpitations, tremor, insomnia, anxiety, liver symptoms, sedatives/alcohol, autoimmune disease, pregnancy, and planned surgery"],
      teaching: ["Stop and report jaundice, dark urine, severe fatigue, RUQ pain, palpitations, tremor, heat intolerance, severe sedation, rash, or allergic symptoms", "Do not combine with thyroid medications, sedatives, alcohol, or immune-suppressing therapy unless the prescriber/pharmacist reviews it", "Avoid in pregnancy unless a qualified obstetric clinician specifically approves"],
      nclexTraps: ["Ashwagandha is not just a stress supplement: thyroid stimulation, sedation stacking, pregnancy avoidance, autoimmune/transplant caution, and liver symptoms are the high-yield safety anchors."],
      populationRisks: [
        { type: "pregnancy", label: "Avoid in pregnancy unless specifically approved", note: "Pregnancy safety is not reliable enough for routine use, and uterine/pregnancy-risk concerns are commonly taught as a caution." },
        { type: "geriatric", label: "Geriatric caution", note: "Older adults are more vulnerable to sedation, falls, polypharmacy, thyroid medication interactions, and liver-injury consequences." },
        { type: "pediatric", label: "Pediatric caution", note: "Do not use in children unless directed by a pediatric clinician." }
      ],
      tags: ["ashwagandha", "thyroid", "hyperthyroidism", "levothyroxine", "antithyroid", "sedation", "liver injury", "pregnancy", "autoimmune", "immunosuppressants"],
      sourceKeys: ["nccih-supplements", "nccih-interactions", "medlineplus-herbals"]
    },
    {
      name: "St. John's wort",
      category: "Herbal supplement",
      aliases: ["st johns wort", "st john's wort", "st johns wart", "st johs wart", "st joh s wart", "st john wart", "saint johns wort", "saint johns wart", "hypericum perforatum"],
      usedFor: ["Marketed for depression, mood, anxiety, menopausal symptoms, and sleep"],
      nclexEssential: true,
      majorRisks: ["Major CYP450/P-glycoprotein induction", "Serotonin syndrome", "Photosensitivity", "Worsening mania risk in bipolar disorder"],
      interactions: ["SSRIs", "SNRIs", "MAOIs", "Triptans", "Oral contraceptives", "Warfarin", "HIV medications", "Transplant medications", "Antiseizure medications", "Digoxin"],
      contraindications: ["Current serotonergic medication without provider review", "Transplant immunosuppression", "Bipolar disorder/mania history unless provider-directed"],
      nursingAssessment: ["Ask about antidepressants, birth control failure risk, transplant meds, HIV therapy, and mood history"],
      teaching: ["Do not combine with antidepressants unless the prescriber specifically approves", "Use backup contraception if directed and report serotonin syndrome symptoms"],
      nclexTraps: ["This is the big herbal interaction card: it can reduce contraceptive, warfarin, HIV, and transplant medication effectiveness and can trigger serotonin syndrome with serotonergic drugs."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless specifically approved because medication interactions and product variability matter." },
        { type: "pediatric", label: "Pediatric caution", note: "Do not use for mood symptoms in children/adolescents without provider supervision." }
      ],
      tags: ["cyp450", "serotonin syndrome", "ssri", "oral contraceptives", "warfarin", "transplant", "hiv", "depression"],
      sourceKeys: ["user-pdf", "nccih-interactions", "medlineplus-herbals"]
    },
    {
      name: "Valerian",
      category: "Herbal supplement",
      aliases: ["valerian root", "valeriana officinalis"],
      usedFor: ["Marketed for insomnia, anxiety, restlessness, and sleep quality"],
      nclexEssential: true,
      majorRisks: ["Sedation", "Dizziness", "Additive CNS depression", "Possible withdrawal-like symptoms if abruptly stopped after high-dose chronic use"],
      interactions: ["Alcohol", "Opioids", "Benzodiazepines", "Barbiturates", "Sedating antihistamines", "Sleep medications", "Anesthetics"],
      contraindications: ["Need to drive/operate machinery", "Concurrent heavy sedative use without provider review", "Upcoming anesthesia unless disclosed"],
      nursingAssessment: ["Assess falls risk, respiratory depression risk, sleep medication use, alcohol use, and planned procedures"],
      teaching: ["Avoid alcohol and driving after use", "Tell anesthesia/surgery teams about valerian"],
      nclexTraps: ["Valerian plus benzodiazepines or opioids is a sedation/falls/respiratory safety issue, not a harmless sleep tea."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless specifically approved." },
        { type: "geriatric", label: "Geriatric caution", note: "Older adults have higher falls, confusion, and sedative burden risk." }
      ],
      tags: ["sedation", "cns depression", "benzodiazepine", "opioid", "falls", "sleep"],
      sourceKeys: ["user-pdf", "nccih-interactions", "medlineplus-herbals"]
    },
    {
      name: "Kava",
      category: "Herbal supplement",
      aliases: ["kava kava", "piper methysticum"],
      usedFor: ["Marketed for anxiety, relaxation, and sleep"],
      nclexEssential: true,
      majorRisks: ["Hepatotoxicity", "Sedation", "Dizziness", "Impaired coordination"],
      interactions: ["Alcohol", "Benzodiazepines", "Opioids", "Sleep medications", "Other hepatotoxic drugs", "Anesthetics"],
      contraindications: ["Liver disease", "Heavy alcohol use", "Elevated liver enzymes", "Pregnancy unless specifically approved", "Upcoming anesthesia unless disclosed"],
      nursingAssessment: ["Assess AST/ALT history, jaundice, dark urine, alcohol intake, sedative use, and falls risk"],
      teaching: ["Avoid alcohol", "Stop and report jaundice, dark urine, RUQ pain, severe fatigue, or pale stools"],
      nclexTraps: ["Kava is a liver-safety and sedation question. Liver disease plus kava should make the nurse intervene."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless specifically approved." },
        { type: "geriatric", label: "Geriatric caution", note: "Higher falls/confusion risk from sedating products." }
      ],
      tags: ["hepatotoxicity", "liver", "sedation", "alcohol", "anxiety"],
      sourceKeys: ["user-pdf", "nccih-interactions", "medlineplus-herbals"]
    },
    {
      name: "Echinacea",
      category: "Herbal supplement",
      aliases: ["echinacea purpurea", "purple coneflower"],
      usedFor: ["Marketed for colds, immune support, and upper respiratory symptom reduction"],
      nclexEssential: true,
      majorRisks: ["Allergic reactions", "Rash", "GI upset", "Potential immune stimulation"],
      interactions: ["Immunosuppressants", "Hepatotoxic medications"],
      contraindications: ["Ragweed/daisy family allergy", "Autoimmune disease without provider review", "Transplant or immunosuppression without provider review"],
      nursingAssessment: ["Ask about asthma/allergies, autoimmune disease, transplant meds, and immunosuppressant use"],
      teaching: ["Stop and report wheeze, swelling, hives, or severe rash", "Do not use long term for immune stimulation unless provider-directed"],
      nclexTraps: ["Immune support sounds positive until the client has autoimmune disease or takes immunosuppressants."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid routine medicinal use unless approved." }
      ],
      tags: ["immune", "allergy", "ragweed", "autoimmune", "immunosuppression"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Saw palmetto",
      category: "Herbal supplement",
      aliases: ["serenoa repens", "saw-palmetto"],
      usedFor: ["Marketed for benign prostatic hyperplasia symptoms, urinary frequency, and hair-loss claims"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk", "GI upset", "Dizziness", "May affect hormone-related therapies"],
      interactions: ["Warfarin", "Aspirin", "Clopidogrel", "NSAIDs", "Hormone therapy"],
      contraindications: ["Bleeding disorder", "Upcoming surgery unless cleared", "Pregnancy unless specifically approved"],
      nursingAssessment: ["Assess urinary retention/red flags, anticoagulant use, PSA/prostate follow-up, and surgical plans"],
      teaching: ["Report hematuria, urinary retention, fever, or unusual bleeding", "Do not use to delay evaluation of prostate symptoms"],
      nclexTraps: ["Do not let saw palmetto mask urinary obstruction or prostate cancer evaluation needs."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid because of hormone-related concerns." }
      ],
      tags: ["bph", "prostate", "bleeding", "hormone", "urinary"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Black cohosh",
      category: "Herbal supplement",
      aliases: ["actaea racemosa", "cimicifuga racemosa"],
      usedFor: ["Marketed for menopausal hot flashes, night sweats, and menstrual symptoms"],
      nclexEssential: true,
      majorRisks: ["Possible liver toxicity", "GI upset", "Rash", "Headache"],
      interactions: ["Hepatotoxic medications", "Hormone-related therapies without provider review"],
      contraindications: ["Liver disease", "Unexplained vaginal bleeding without evaluation", "Hormone-sensitive cancer history without oncology/provider review"],
      nursingAssessment: ["Assess liver history, jaundice, dark urine, RUQ pain, and estrogen-sensitive cancer history"],
      teaching: ["Report jaundice, dark urine, severe fatigue, RUQ pain, or pale stools immediately"],
      nclexTraps: ["The key nursing teaching is liver warning signs, not just hot flash symptom relief."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless specifically approved." }
      ],
      tags: ["menopause", "liver", "hepatotoxicity", "jaundice", "hot flashes"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Chamomile",
      category: "Herbal supplement",
      aliases: ["matricaria chamomilla", "german chamomile", "roman chamomile", "chamomile tea"],
      usedFor: ["Marketed for sleep, anxiety, GI upset, and mild inflammation"],
      nclexEssential: true,
      majorRisks: ["Sedation", "Allergic reaction in ragweed/daisy family allergy", "Possible bleeding interaction with warfarin"],
      interactions: ["Warfarin", "Sedatives", "Alcohol", "Benzodiazepines"],
      contraindications: ["Ragweed/daisy family allergy", "Warfarin therapy without provider review", "Need to drive/operate machinery after sedating dose"],
      nursingAssessment: ["Assess allergy history, anticoagulant use, sedation risk, and falls risk"],
      teaching: ["Report hives, wheeze, swelling, unusual bleeding, or excessive drowsiness"],
      nclexTraps: ["Chamomile tea can matter if the client has ragweed allergy or warfarin use."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid medicinal doses unless specifically approved." },
        { type: "geriatric", label: "Geriatric caution", note: "Watch falls and sedative stacking." }
      ],
      tags: ["sedation", "ragweed", "warfarin", "bleeding", "sleep"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Feverfew",
      category: "Herbal supplement",
      aliases: ["tanacetum parthenium"],
      usedFor: ["Marketed for migraine prevention, headache, inflammation, and fever claims"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk", "Mouth ulcers", "GI upset", "Rebound headaches if abruptly stopped after chronic use"],
      interactions: ["Warfarin", "Aspirin", "Clopidogrel", "NSAIDs", "Anticoagulants/antiplatelets"],
      contraindications: ["Pregnancy", "Bleeding disorder", "Upcoming surgery unless cleared"],
      nursingAssessment: ["Assess migraine medication use, anticoagulants, pregnancy status, and planned procedures"],
      teaching: ["Do not abruptly stop chronic high-dose use without guidance", "Report unusual bleeding"],
      nclexTraps: ["Migraine prevention plus anticoagulants is a bleeding clue; abrupt stopping can cause rebound headache."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe", note: "Avoid in pregnancy unless a provider explicitly says otherwise." }
      ],
      tags: ["migraine", "bleeding", "pregnancy", "rebound headache", "warfarin"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Dong quai",
      category: "Herbal supplement",
      aliases: ["angelica sinensis", "female ginseng"],
      usedFor: ["Marketed for menstrual cramps, menopause symptoms, anemia claims, and circulation claims"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk", "Photosensitivity", "Hormone-related concerns"],
      interactions: ["Warfarin", "Aspirin", "Clopidogrel", "NSAIDs", "Hormone therapy"],
      contraindications: ["Pregnancy", "Bleeding disorder", "Hormone-sensitive cancer history without provider review", "Upcoming surgery unless cleared"],
      nursingAssessment: ["Assess pregnancy possibility, anticoagulants, abnormal bleeding, photosensitivity reactions, and hormone-sensitive conditions"],
      teaching: ["Avoid in pregnancy", "Use sun protection if photosensitivity occurs", "Report abnormal bleeding"],
      nclexTraps: ["Dong quai is a classic avoid-in-pregnancy and bleeding-risk supplement."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe", note: "Avoid in pregnancy unless explicitly approved." }
      ],
      tags: ["pregnancy", "bleeding", "photosensitivity", "warfarin", "menstrual"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Evening primrose oil",
      category: "Herbal supplement",
      aliases: ["epo", "oenothera biennis", "primrose oil"],
      usedFor: ["Marketed for PMS, breast pain, eczema, menopause symptoms, and inflammation claims"],
      nclexEssential: true,
      majorRisks: ["May increase seizure risk", "GI upset", "Headache"],
      interactions: ["Phenothiazines", "Antipsychotics that lower seizure threshold", "Anticoagulants/antiplatelets"],
      contraindications: ["Seizure disorder without provider review", "Phenothiazine use without provider review", "Upcoming surgery unless cleared"],
      nursingAssessment: ["Assess seizure history, antipsychotic/phenothiazine use, and bleeding risk"],
      teaching: ["Report seizure activity or neurologic changes", "Tell the provider before combining with psychiatric medications"],
      nclexTraps: ["Evening primrose oil plus phenothiazines is a seizure-risk clue."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid medicinal use unless approved." }
      ],
      tags: ["seizure", "phenothiazine", "pms", "eczema", "bleeding"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Licorice root",
      category: "Herbal supplement",
      aliases: ["licorice", "glycyrrhiza glabra", "glycyrrhizin", "deglycyrrhizinated licorice", "dgl"],
      usedFor: ["Marketed for reflux, cough, sore throat, adrenal/fatigue claims, and GI symptoms"],
      nclexEssential: true,
      majorRisks: ["Hypertension", "Hypokalemia", "Fluid retention", "Dysrhythmia risk"],
      interactions: ["Diuretics", "Digoxin", "Corticosteroids", "Antihypertensives", "QT-prolonging drugs"],
      contraindications: ["Uncontrolled hypertension", "Heart failure", "Kidney disease with electrolyte risk", "Hypokalemia"],
      nursingAssessment: ["Check BP, edema, potassium, digoxin use, dysrhythmia history, and heart failure status"],
      teaching: ["Report muscle weakness, palpitations, edema, severe headache, or high BP symptoms"],
      nclexTraps: ["Licorice root can look like a potassium/BP question: think hypokalemia, fluid retention, and dysrhythmia risk."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid high-dose medicinal use unless approved." },
        { type: "geriatric", label: "Geriatric caution", note: "Older adults often have hypertension, heart failure, diuretics, or digoxin exposure." }
      ],
      tags: ["hypertension", "hypokalemia", "fluid retention", "digoxin", "diuretic", "heart failure"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Aloe oral supplement",
      category: "Herbal supplement",
      aliases: ["aloe", "aloe vera", "oral aloe", "aloe latex"],
      usedFor: ["Marketed for constipation, GI cleansing, reflux claims, skin/immune claims, and glucose claims"],
      nclexEssential: true,
      majorRisks: ["Diarrhea", "Hypokalemia", "Dehydration", "Cramping", "May alter medication absorption"],
      interactions: ["Diuretics", "Digoxin", "Diabetes medications", "Oral medications affected by diarrhea/absorption"],
      contraindications: ["Pregnancy unless approved", "Bowel obstruction", "Severe dehydration", "Hypokalemia"],
      nursingAssessment: ["Assess bowel pattern, dehydration, potassium, renal status, digoxin use, and diabetes medications"],
      teaching: ["Topical aloe is not the same risk profile as oral aloe latex", "Report severe diarrhea, weakness, palpitations, or dehydration"],
      nclexTraps: ["Oral aloe is a laxative/electrolyte issue: hypokalemia matters, especially with digoxin or diuretics."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid oral aloe unless specifically approved." },
        { type: "geriatric", label: "Geriatric caution", note: "Higher dehydration, renal, falls, and electrolyte risk." }
      ],
      tags: ["hypokalemia", "diarrhea", "digoxin", "laxative", "dehydration"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Cranberry supplement",
      category: "Dietary supplement",
      aliases: ["cranberry", "cranberry juice", "vaccinium macrocarpon"],
      usedFor: ["Marketed for urinary tract infection prevention and urinary tract health"],
      nclexEssential: true,
      majorRisks: ["May increase warfarin effect in some reports", "GI upset", "Sugar load from juice products", "Kidney stone caution in susceptible clients"],
      interactions: ["Warfarin", "Diabetes medications if high-sugar juice is used"],
      contraindications: ["Warfarin therapy without INR monitoring guidance", "Recurrent stones without provider review", "Diabetes clients using sweetened juice without carb awareness"],
      nursingAssessment: ["Assess UTI symptoms needing treatment, warfarin use, INR trends, diabetes status, and fluid intake"],
      teaching: ["Do not use cranberry to treat an active UTI with fever, flank pain, pregnancy, or systemic symptoms", "Monitor INR if taking warfarin"],
      nclexTraps: ["Cranberry may be about INR/warfarin safety, not just UTI prevention."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Pregnancy UTI symptoms need provider evaluation; do not self-treat." }
      ],
      tags: ["uti", "warfarin", "inr", "urinary", "diabetes"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Melatonin",
      category: "Dietary supplement",
      aliases: ["sleep hormone", "melatonin gummies"],
      usedFor: ["Marketed for insomnia, jet lag, circadian rhythm problems, and sleep onset difficulty"],
      nclexEssential: true,
      majorRisks: ["Drowsiness", "Dizziness", "Headache", "Additive sedation"],
      interactions: ["Alcohol", "Benzodiazepines", "Opioids", "Sedating antihistamines", "Sleep medications", "Anticoagulants/antiplatelets with some caution"],
      contraindications: ["Driving/operating machinery after use", "Heavy sedative use without provider review", "Pregnancy unless approved"],
      nursingAssessment: ["Assess falls risk, sleep hygiene, sedative burden, depression symptoms, and pediatric accidental ingestion risk"],
      teaching: ["Use caution with driving and alcohol", "Keep gummies away from children", "Report severe morning sedation or confusion"],
      nclexTraps: ["Melatonin is still a sedating product and can add to falls/confusion risk."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless approved." },
        { type: "pediatric", label: "Pediatric caution", note: "Use in children only with pediatric guidance; protect against accidental ingestion." },
        { type: "geriatric", label: "Geriatric caution", note: "Watch morning sedation, falls, and confusion." }
      ],
      tags: ["sleep", "sedation", "falls", "pediatric", "gummies"],
      sourceKeys: ["user-pdf", "nccih-supplements", "medlineplus-herbals"]
    },
    {
      name: "Ephedra",
      category: "Herbal stimulant",
      aliases: ["ma huang", "ephedra sinica", "ephedrine alkaloids"],
      usedFor: ["Formerly marketed for weight loss, athletic performance, energy, and decongestion claims"],
      nclexEssential: true,
      mechanism: "Ephedra contains ephedrine-type sympathomimetic alkaloids. It increases adrenergic signaling, so alpha/beta stimulation can raise blood pressure and heart rate while causing stimulant and bronchodilator-like effects. That same mechanism is why it is dangerous: tachycardia, dysrhythmias, stroke, myocardial infarction, seizure, and death are the NCLEX-level safety anchors.",
      majorRisks: ["Hypertension", "Tachycardia", "Dysrhythmias", "Stroke", "Myocardial infarction", "Seizures", "Death"],
      interactions: ["Stimulants", "Caffeine", "Decongestants", "MAOIs", "Cardiac medications", "Antihypertensives"],
      contraindications: ["Hypertension", "Coronary artery disease", "Dysrhythmias", "Stroke history", "Seizure disorder", "Pregnancy unless specifically approved"],
      nursingAssessment: ["Assess chest pain, palpitations, BP, neuro deficits, stimulant use, and weight-loss product use"],
      teaching: ["Avoid ephedra/ma huang products", "Seek urgent care for chest pain, severe headache, neurologic deficit, or palpitations"],
      nclexTraps: ["Ephedra is a red-flag stimulant supplement: think BP, heart, stroke, MI, seizure."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe", note: "Avoid." },
        { type: "geriatric", label: "Geriatric unsafe", note: "High cardiovascular and stroke risk." }
      ],
      tags: ["ma huang", "hypertension", "tachycardia", "stroke", "mi", "seizure", "weight loss"],
      sourceKeys: ["user-pdf", "fda-supplements", "medlineplus-herbals"]
    },
    {
      name: "Comfrey",
      category: "Herbal supplement",
      aliases: ["symphytum officinale"],
      usedFor: ["Marketed historically for wound healing, pain, inflammation, and GI complaints"],
      nclexEssential: true,
      majorRisks: ["Severe liver toxicity", "Veno-occlusive liver disease risk", "Potential carcinogenic pyrrolizidine alkaloids in unsafe preparations"],
      interactions: ["Hepatotoxic medications", "Alcohol"],
      contraindications: ["Oral use", "Liver disease", "Pregnancy unless specifically approved", "Alcohol use disorder"],
      nursingAssessment: ["Assess oral ingestion, liver symptoms, alcohol use, AST/ALT history, jaundice, and abdominal pain"],
      teaching: ["Avoid oral comfrey", "Report jaundice, dark urine, RUQ pain, severe fatigue, or swelling"],
      nclexTraps: ["Comfrey is an avoid-oral-use liver toxicity supplement."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe", note: "Avoid." },
        { type: "pediatric", label: "Pediatric unsafe", note: "Avoid oral use." }
      ],
      tags: ["liver", "hepatotoxicity", "jaundice", "oral use", "comfrey"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Turmeric supplement",
      category: "Dietary supplement",
      aliases: ["turmeric", "curcumin", "curcuma longa"],
      usedFor: ["Marketed for inflammation, arthritis pain, antioxidant claims, dyspepsia, and metabolic health"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk at supplement doses", "May lower glucose", "GI upset", "Gallbladder symptom caution"],
      interactions: ["Warfarin", "Aspirin", "Clopidogrel", "NSAIDs", "Diabetes medications"],
      contraindications: ["Bleeding disorder", "Upcoming surgery unless cleared", "Gallbladder disease without provider review", "Hypoglycemia risk"],
      nursingAssessment: ["Assess anticoagulants, glucose trends, bleeding, gallbladder symptoms, and planned procedures"],
      teaching: ["Food spice amounts are different from concentrated capsules", "Report bleeding or hypoglycemia symptoms"],
      nclexTraps: ["Turmeric capsules can turn into a bleeding/glucose question."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid medicinal doses unless approved." }
      ],
      tags: ["curcumin", "bleeding", "warfarin", "glucose", "anti inflammatory"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Glucosamine",
      category: "Dietary supplement",
      aliases: ["glucosamine sulfate", "glucosamine hydrochloride", "glucosamine chondroitin"],
      usedFor: ["Marketed for osteoarthritis pain, joint support, and cartilage health"],
      nclexEssential: true,
      majorRisks: ["May raise INR with warfarin", "Shellfish allergy caution depending source", "GI upset", "Possible glucose-monitoring caution"],
      interactions: ["Warfarin", "Anticoagulants/antiplatelets", "Diabetes medications with monitoring caution"],
      contraindications: ["Warfarin therapy without INR monitoring guidance", "Severe shellfish allergy unless product source is verified"],
      nursingAssessment: ["Assess INR, bleeding, shellfish allergy, joint pain red flags, and diabetes status"],
      teaching: ["Tell the anticoagulation clinic/provider before starting", "Report bleeding or allergy symptoms"],
      nclexTraps: ["Joint supplement plus warfarin can be an INR/bleeding problem."],
      populationRisks: [
        { type: "geriatric", label: "Geriatric caution", note: "Older adults commonly use warfarin/antiplatelets and arthritis supplements together." }
      ],
      tags: ["arthritis", "joint", "warfarin", "inr", "shellfish", "bleeding"],
      sourceKeys: ["user-pdf", "medlineplus-herbals"]
    },
    {
      name: "Fish oil omega-3 supplement",
      category: "Dietary supplement",
      aliases: ["fish oil", "omega 3", "omega-3 fatty acids", "epa", "dha"],
      usedFor: ["Marketed for triglycerides, cardiovascular health, inflammation, mood, pregnancy nutrition, and general wellness"],
      nclexEssential: true,
      majorRisks: ["Bleeding risk at high doses", "Fishy aftertaste", "GI upset", "Atrial fibrillation signal in some high-dose contexts"],
      interactions: ["Warfarin", "Aspirin", "Clopidogrel", "NSAIDs", "Anticoagulants/antiplatelets"],
      contraindications: ["Bleeding disorder", "Upcoming surgery unless cleared", "Fish/shellfish allergy without provider review"],
      nursingAssessment: ["Assess anticoagulant/antiplatelet use, bleeding signs, dose, lipid indication, and planned procedures"],
      teaching: ["Use prescribed omega-3 products exactly as directed", "Report unusual bleeding or palpitations"],
      nclexTraps: ["High-dose omega-3 can join the bleeding-risk family, especially with antithrombotics."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Use pregnancy-safe products and avoid mercury-containing fish sources; verify with obstetric provider." }
      ],
      tags: ["omega", "epa", "dha", "triglycerides", "bleeding", "warfarin"],
      sourceKeys: ["user-pdf", "nccih-supplements", "medlineplus-herbals"]
    },
    {
      name: "CBD and cannabis products",
      category: "Cannabinoid product",
      aliases: ["cbd", "cannabidiol", "cannabis", "marijuana", "thc", "hemp", "medical marijuana"],
      usedFor: ["Marketed or used for pain, anxiety, sleep, nausea, appetite, seizures, and multiple symptom-relief claims"],
      nclexEssential: true,
      majorRisks: ["Sedation", "Dizziness", "Impaired coordination", "CYP-mediated drug interactions", "Anxiety/paranoia or psychosis risk with THC-containing products"],
      interactions: ["Benzodiazepines", "Opioids", "Alcohol", "Antiseizure medications", "Warfarin", "Other CYP-metabolized medications", "Sedatives"],
      contraindications: ["Pregnancy", "Driving/operating machinery while impaired", "Unstable psychosis/mania risk without provider review", "Concurrent heavy sedative use"],
      nursingAssessment: ["Ask product type, THC content, dose, route, sedation, driving, pregnancy status, mental health history, and interacting medications"],
      teaching: ["Do not drive while impaired", "Disclose use before surgery and when starting new meds", "Keep edibles away from children"],
      nclexTraps: ["Cannabis/CBD is not just recreational history; it can affect sedation, falls, drug metabolism, pregnancy safety, and pediatric accidental ingestion."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe", note: "Avoid cannabis/CBD unless a provider explicitly directs otherwise." },
        { type: "pediatric", label: "Pediatric unsafe", note: "Protect children from accidental edible ingestion; use only prescribed cannabinoid therapy when indicated." },
        { type: "geriatric", label: "Geriatric caution", note: "Higher falls, confusion, dizziness, and sedative stacking risk." }
      ],
      tags: ["cbd", "cannabis", "thc", "sedation", "cyp", "warfarin", "pregnancy", "edibles"],
      sourceKeys: ["user-pdf", "fda-supplements", "medlineplus-herbals"]
    },
    {
      name: "Psilocybin",
      category: "Investigational psychedelic compound",
      aliases: ["psilocybin mushrooms", "magic mushrooms", "psychedelic mushrooms", "psilocin"],
      usedFor: [
        "Being researched in supervised clinical settings for major depressive disorder, treatment-resistant depression, end-of-life distress, substance use disorders, and other psychiatric indications.",
        "Not an FDA-approved routine medication for self-treatment in the United States as of this database update."
      ],
      nclexEssential: false,
      mechanism: "Psilocybin is converted to psilocin, a serotonergic psychedelic that primarily stimulates 5-HT2A receptors. Research models focus on altered network signaling, perceptual and emotional processing, and psychotherapy-supported behavioral change rather than a standard daily medication effect.",
      majorRisks: [
        "Acute anxiety, panic, frightening perceptual changes, impaired judgment, nausea/vomiting, dizziness, headache, and transient increases in blood pressure or heart rate",
        "May worsen or precipitate mania, psychosis, or severe psychiatric instability in susceptible clients",
        "Safety depends on controlled screening, supervision, monitoring, and psychological support in research or clinical protocols"
      ],
      interactions: [
        "Psychiatric medications require specialist review; serotonergic antidepressants, MAOIs, lithium, antipsychotics, stimulants, alcohol, cannabis, and sedatives may alter risk, response, or safety",
        "Do not combine with other psychoactive substances outside supervised clinical protocols"
      ],
      contraindications: [
        "Personal or family history of psychosis or bipolar mania without specialist oversight",
        "Uncontrolled cardiovascular disease or severe hypertension",
        "Pregnancy or breastfeeding unless a specialist research protocol explicitly addresses risk",
        "Pediatric use outside approved research",
        "Current intoxication, unstable suicidality, or inability to consent/safely participate in monitoring"
      ],
      nursingAssessment: [
        "Ask nonjudgmentally about psychedelic use, product source, timing, dose uncertainty, co-ingestants, psychiatric history, suicidality, and current medications",
        "Assess mental status, anxiety/panic, hallucinations, orientation, safety, vital signs, chest pain, serotonin-toxicity clues, and risk of self-harm or accidental injury"
      ],
      teaching: [
        "Do not self-treat depression, PTSD, anxiety, or substance use with psilocybin products",
        "Clinical research uses screening, controlled setting, trained support, monitoring, and follow-up; this is different from unsupervised use",
        "Seek urgent help for chest pain, severe agitation, psychosis, suicidal thoughts, confusion, injury risk, or prolonged severe symptoms"
      ],
      nclexTraps: [
        "Do not treat psilocybin as a harmless natural supplement. The nursing issue is safety: psychiatric destabilization, impaired judgment, co-ingestants, vital-sign changes, and legal/regulatory status.",
        "Emerging research does not equal routine approved outpatient treatment."
      ],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe / avoid", note: "Avoid outside formal specialist research because fetal, lactation, and maternal psychiatric safety are not established." },
        { type: "pediatric", label: "Pediatric unsafe / avoid", note: "Avoid outside approved pediatric research; psychiatric and neurodevelopmental safety concerns require specialist oversight." },
        { type: "geriatric", label: "Geriatric caution", note: "Older adults may have cardiovascular disease, polypharmacy, fall risk, cognitive vulnerability, and higher harm from acute confusion or BP/HR changes." }
      ],
      tags: ["psilocybin", "psilocin", "psychedelic", "hallucinogen", "depression research", "treatment resistant depression", "major depressive disorder", "substance use research", "panic", "psychosis", "mania", "serotonin", "schedule i", "investigational"],
      sourceKeys: ["fda-psychedelic-guidance", "dea-psilocybin", "nih-psilocybin-research"]
    },
    {
      name: "Milk thistle",
      category: "Herbal supplement",
      aliases: ["silybum marianum", "silymarin", "silibinin", "St. Mary's thistle"],
      usedFor: ["Marketed for liver support, hepatitis/cirrhosis support, gallbladder complaints, diabetes/metabolic support, and antioxidant claims"],
      nclexEssential: true,
      majorRisks: ["GI upset such as bloating, nausea, gas, or diarrhea", "Allergic reaction risk, especially in clients sensitive to ragweed/daisy family plants", "May affect glucose or medication metabolism based on the product and client context", "Product quality and evidence limits; do not use as liver-disease treatment replacement"],
      interactions: ["Diabetes medications", "Warfarin or other high-risk medications requiring monitoring", "CYP-metabolized medications", "Other hepatotoxic or liver-managed drugs"],
      contraindications: ["Pregnancy or breastfeeding unless specifically approved", "Ragweed/daisy-family allergy without provider review", "Active liver disease without telling the provider", "Diabetes with hypoglycemia risk unless glucose is monitored"],
      nursingAssessment: ["Ask why the client is taking it, liver diagnosis, alcohol/hepatotoxic drug exposure, diabetes medications/glucose trends, allergy history, pregnancy/lactation status, and all prescription/OTC products"],
      teaching: ["Do not use milk thistle instead of prescribed liver, hepatitis, cancer, or diabetes therapy", "Report jaundice, dark urine, severe abdominal pain, rash, breathing trouble, or hypoglycemia symptoms", "Tell providers before surgery or when medication doses/lab monitoring depend on liver function"],
      nclexTraps: ["Milk thistle sounds liver-protective, but a client with jaundice, ascites, GI bleeding, confusion, or severe RUQ pain needs medical evaluation, not supplement reassurance.", "Natural liver support claims do not make it safe with complex liver disease or diabetes medications."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Avoid unless an obstetric provider specifically approves because pregnancy/lactation safety and product quality are uncertain." },
        { type: "geriatric", label: "Older adult caution", note: "Older adults are more likely to have polypharmacy, diabetes medications, liver disease, or anticoagulant monitoring concerns." }
      ],
      tags: ["liver", "silymarin", "hepatitis", "cirrhosis", "diabetes", "allergy", "supplement safety"],
      sourceKeys: ["nccih-supplements", "medlineplus-herbals"]
    },
    {
      name: "Red yeast rice",
      category: "Herbal / dietary supplement",
      aliases: ["red rice yeast", "red fermented rice", "monascus purpureus", "monacolin K", "natural statin"],
      usedFor: ["Marketed for cholesterol lowering, LDL reduction, metabolic syndrome, and heart-health support"],
      nclexEssential: true,
      majorRisks: ["Can act like a statin when monacolin K/lovastatin content is significant", "Muscle pain/myopathy, rhabdomyolysis risk, liver injury, kidney injury, and GI upset", "Unpredictable monacolin K content and possible citrinin kidney-toxic contamination", "Not recommended during pregnancy or breastfeeding"],
      interactions: ["Statins such as lovastatin/atorvastatin/simvastatin", "CYP3A inhibitors such as macrolides, azoles, protease inhibitors, grapefruit", "Cyclosporine or transplant drugs", "Gemfibrozil/fibrates", "Niacin", "Alcohol or hepatotoxic medications", "Warfarin or high-risk monitored medications"],
      contraindications: ["Pregnancy or breastfeeding", "Active liver disease or unexplained elevated LFTs without provider approval", "History of statin-associated rhabdomyolysis/myopathy without provider review", "Concurrent statin/fibrate/niacin or strong CYP3A inhibitor without prescriber oversight"],
      nursingAssessment: ["Ask specifically about cholesterol supplements because clients may not call red yeast rice a statin", "Assess muscle pain/weakness, dark urine, jaundice, RUQ pain, alcohol use, liver/kidney history, pregnancy status, and current lipid-lowering therapy", "Check whether ordered labs include CK, AST/ALT, bilirubin, creatinine, or lipid response when symptoms or therapy overlap exist"],
      teaching: ["Do not combine with prescription statins or fibrates unless the prescriber approves", "Stop and seek care for severe muscle pain/weakness, dark urine, jaundice, severe fatigue, or abdominal pain", "Product labels usually do not reveal monacolin K amount, so effect and toxicity can be unpredictable"],
      nclexTraps: ["Red yeast rice is the natural-statin trap: treat it like a possible statin exposure when assessing muscle pain, liver injury, kidney injury, pregnancy, and interaction risk.", "A client who says they stopped their statin but started red yeast rice may still have statin-like toxicity risk."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe / avoid", note: "NCCIH notes red yeast rice is not recommended during pregnancy or lactation." },
        { type: "geriatric", label: "Older adult caution", note: "Higher baseline risk for polypharmacy, statin intolerance, kidney disease, liver disease, and muscle toxicity." }
      ],
      tags: ["cholesterol", "monacolin K", "lovastatin", "statin-like", "myopathy", "rhabdomyolysis", "liver injury", "kidney injury", "citrinin", "pregnancy"],
      sourceKeys: ["nccih-supplements", "fda-supplements"]
    },
    {
      name: "Kratom",
      category: "Herbal / psychoactive product",
      aliases: ["mitragyna speciosa", "mitragynine", "7-hydroxymitragynine", "kratom tea", "kratom powder"],
      usedFor: ["Used or marketed for pain, energy, mood, anxiety, diarrhea, and self-management of opioid withdrawal symptoms or cravings"],
      nclexEssential: true,
      majorRisks: ["Opioid-like and sedative effects including drowsiness, confusion, impaired judgment, and respiratory-risk stacking with other depressants", "Stimulant-like effects including increased energy, alertness, tachycardia, and hypertension", "Dependence and withdrawal with regular use", "Nausea, constipation, dizziness, seizures, high blood pressure, liver injury, and product contamination with heavy metals or bacteria", "Severe adverse events and deaths are most concerning when kratom is combined with other drugs"],
      interactions: ["Opioids", "Benzodiazepines", "Alcohol", "Sedatives/hypnotics", "Gabapentinoids", "Antipsychotics", "Antidepressants or other serotonergic/psychoactive drugs", "Stimulants", "Antihypertensives", "Hepatotoxic medications"],
      contraindications: ["Pregnancy or breastfeeding", "Using kratom to self-treat opioid use disorder instead of evidence-based care", "Active substance use disorder without clinician oversight", "Liver disease or unexplained jaundice", "Seizure disorder or uncontrolled hypertension without provider review", "Concurrent opioids, benzodiazepines, alcohol, or heavy sedative use"],
      nursingAssessment: ["Ask specifically about kratom tea, powders, capsules, extracts, online products, and reasons for use because clients may not call it a drug", "Assess sedation, respiratory status, falls risk, blood pressure, heart rate, confusion, seizure history, liver symptoms, opioid use disorder history, withdrawal symptoms, and co-ingestants", "For intoxication or overdose concerns, prioritize airway, breathing, circulation, glucose, temperature, toxidrome assessment, and poison control/provider notification"],
      teaching: ["Kratom is not FDA-approved as safe and effective for pain, opioid withdrawal, or any medical use", "Do not combine kratom with alcohol, opioids, benzodiazepines, sleep medicines, or other sedating substances", "Seek urgent care for trouble breathing, severe sedation, seizure, chest pain, severe hypertension symptoms, jaundice, dark urine, or severe confusion", "Clients using kratom to manage opioid withdrawal should be connected with evidence-based treatment options rather than abrupt unsupported stopping"],
      nclexTraps: ["Kratom is the supplement that behaves like both a stimulant and an opioid-like sedative; assess it like a psychoactive drug exposure, not harmless tea.", "A client using kratom for opioid withdrawal needs safety assessment and treatment linkage, not reassurance that a natural product is safer."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe / avoid", note: "Avoid because fetal/neonatal safety is not established and opioid-like withdrawal or co-exposure risks matter." },
        { type: "pediatric", label: "Pediatric unsafe / avoid", note: "Keep away from children; accidental exposure can cause serious CNS or breathing concerns." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk for sedation, falls, confusion, polypharmacy interactions, hypertension, and liver/kidney vulnerability." }
      ],
      tags: ["kratom", "mitragynine", "opioid receptor", "sedation", "withdrawal", "dependence", "seizure", "hypertension", "liver injury", "contamination"],
      sourceKeys: ["nccih-supplements", "fda-supplements"]
    },
    {
      name: "Berberine",
      category: "Dietary supplement / plant alkaloid",
      aliases: ["barberry", "goldenseal constituent", "berberine hydrochloride", "tree turmeric", "oregon grape"],
      usedFor: ["Marketed for blood glucose control, cholesterol/lipid support, weight loss, PCOS/metabolic health, diarrhea, and general anti-inflammatory or antimicrobial claims"],
      nclexEssential: true,
      majorRisks: ["GI upset such as diarrhea, constipation, gas, or abdominal discomfort", "May lower glucose or blood pressure in some clients and can complicate diabetes or antihypertensive therapy", "Medication-processing interactions are possible with berberine-containing products such as goldenseal", "Pregnancy, breastfeeding, infant, and newborn safety concerns; berberine-containing goldenseal should not be used in those groups", "Product quality, dose, and evidence limits; do not treat it as a substitute for prescribed diabetes, lipid, infection, or weight-management therapy"],
      interactions: ["Diabetes medications including insulin, sulfonylureas, GLP-1 agents, and metformin therapy requiring glucose monitoring", "Antihypertensives", "Warfarin or other high-risk monitored drugs", "Cyclosporine, tacrolimus, and other narrow-therapeutic-index medications", "CYP/P-gp affected medications", "Other glucose-lowering supplements"],
      contraindications: ["Pregnancy or breastfeeding", "Infants or young children", "Hypoglycemia-prone clients without monitoring", "Transplant recipients or clients taking narrow-therapeutic-index drugs without pharmacist/provider review", "Do not use as a replacement for prescribed diabetes, lipid, antibiotic, or obesity treatment"],
      nursingAssessment: ["Ask about berberine, goldenseal, barberry, weight-loss products, glucose products, and online supplements", "Assess glucose trends, hypoglycemia symptoms, blood pressure, GI symptoms, pregnancy/lactation status, transplant or immunosuppressant therapy, and all prescribed medications", "For diabetes clients, clarify whether prescribed medication doses were changed or skipped because of supplement claims"],
      teaching: ["Check with the provider/pharmacist before using berberine with diabetes, blood pressure, transplant, anticoagulant, or other high-risk medications", "Monitor for hypoglycemia symptoms such as sweating, tremor, confusion, palpitations, hunger, or dizziness", "Do not use berberine or berberine-containing goldenseal during pregnancy, breastfeeding, or in infants", "Supplements are not pre-approved like medications, and product content may vary"],
      nclexTraps: ["Berberine is a glucose/lipid supplement trap: the nursing priority is interaction and hypoglycemia assessment, not accepting weight-loss or natural-diabetes claims.", "Goldenseal contains berberine, but goldenseal study results and berberine study results are not interchangeable because absorption and product composition differ."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe / avoid", note: "Avoid during pregnancy and breastfeeding; berberine-containing goldenseal is specifically cautioned against in these groups." },
        { type: "pediatric", label: "Infant/child unsafe", note: "Avoid in infants and young children because newborn harm has been associated with the berberine constituent of goldenseal." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk for polypharmacy, hypoglycemia, hypotension, kidney disease, and monitored-drug interactions." }
      ],
      tags: ["berberine", "goldenseal", "glucose", "diabetes", "cholesterol", "weight loss", "hypoglycemia", "pregnancy", "infant", "interaction"],
      sourceKeys: ["nccih-supplements", "nccih-interactions", "fda-supplements"]
    },
    {
      name: "Coenzyme Q10",
      category: "Dietary supplement",
      aliases: ["CoQ10", "coq10", "ubiquinone", "ubiquinol", "coenzyme q"],
      usedFor: ["Marketed for heart health, heart failure support, statin-associated muscle symptoms, migraine prevention, fertility, energy, Parkinson disease, and antioxidant claims"],
      nclexEssential: true,
      majorRisks: ["Mild digestive upset, appetite change, nausea, diarrhea, insomnia, headache, or rash can occur", "May interact with warfarin and affect anticoagulation monitoring", "May interact with insulin or diabetes therapy and glucose monitoring", "May not be compatible with some cancer treatments", "Evidence does not support using CoQ10 as a reliable fix for statin muscle pain or as a substitute for heart failure/cancer/Parkinson treatment"],
      interactions: ["Warfarin", "Insulin", "Other diabetes medications", "Chemotherapy or radiation plans requiring oncology approval", "Antihypertensives with monitoring caution"],
      contraindications: ["Warfarin therapy without INR monitoring guidance", "Active cancer treatment without oncology approval", "Pregnancy or breastfeeding unless approved", "Do not stop statins, heart failure drugs, or Parkinson therapy because of supplement claims"],
      nursingAssessment: ["Ask whether the client is using CoQ10 for statin muscle symptoms, heart failure, cancer treatment support, energy, fertility, or neurologic disease", "Assess INR/warfarin history, glucose trends, statin symptoms, heart failure medications, oncology treatment plan, pregnancy/lactation status, and supplement dose/product", "If statin muscle symptoms are present, assess for red flags such as severe weakness, dark urine, or markedly elevated CK rather than assuming CoQ10 is enough"],
      teaching: ["Tell the anticoagulation clinic or prescriber before starting or stopping CoQ10 if taking warfarin", "Do not use CoQ10 to replace prescribed heart, lipid, diabetes, cancer, or neurologic therapy", "Report unusual clotting/bleeding changes, severe muscle symptoms, dark urine, hypoglycemia symptoms, rash, or persistent insomnia/GI upset"],
      nclexTraps: ["CoQ10 is often paired with statin complaints, but evidence does not make it a stand-alone answer for statin myopathy; assess CK/red flags and prescribed therapy first.", "Warfarin plus CoQ10 is an INR-monitoring question even though CoQ10 sounds like a vitamin-like antioxidant."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Use only if the obstetric provider approves because supplement safety and product quality are not guaranteed." },
        { type: "geriatric", label: "Older adult caution", note: "Older adults commonly have anticoagulants, diabetes therapy, heart failure treatment, oncology care, or polypharmacy." }
      ],
      tags: ["coq10", "ubiquinone", "warfarin", "inr", "insulin", "statin myalgia", "heart failure", "oncology", "antioxidant"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Peppermint oil",
      category: "Herbal / essential oil product",
      aliases: ["peppermint", "mentha piperita", "menthol oil", "enteric-coated peppermint oil", "peppermint capsules"],
      usedFor: ["Marketed or used for irritable bowel syndrome symptoms, abdominal cramping, indigestion, nausea, tension headache, muscle tension, aromatherapy, and topical comfort claims"],
      nclexEssential: true,
      majorRisks: ["Oral peppermint oil can cause heartburn, acid reflux, indigestion, nausea, abdominal pain, dry mouth, or allergic reaction", "Topical use can cause rash or skin irritation", "Menthol-containing oil should not be applied to the face of infants or young children or inhaled by them because breathing problems can occur", "Medicinal oral amounts during pregnancy or breastfeeding have limited safety information", "Peppermint oil alone may worsen indigestion in some clients even when enteric-coated capsules are used for IBS"],
      interactions: ["Antacids or acid-suppressing medicines may affect enteric-coated capsule timing/release; ask pharmacist/provider", "Other reflux-triggering products", "Topical products on infant skin or near the nipple before breastfeeding", "Any high-risk medication regimen where supplement disclosure matters"],
      contraindications: ["Infants and young children: do not apply to face/chest or allow inhalation", "Severe GERD, frequent heartburn, or worsening indigestion without provider review", "Pregnancy or breastfeeding medicinal dosing unless approved", "Peppermint allergy or prior reaction"],
      nursingAssessment: ["Ask route and formulation: tea, enteric-coated capsule, essential oil ingestion, topical oil, aromatherapy, or nipple product during breastfeeding", "Assess IBS symptoms versus alarm GI symptoms such as GI bleeding, weight loss, fever, persistent vomiting, severe pain, or new symptoms in an older adult", "Assess reflux/heartburn, pregnancy/lactation status, infant exposure risk, allergies, and skin irritation"],
      teaching: ["Use only products intended for the chosen route; essential oils are concentrated and should not be casually swallowed or applied undiluted", "Keep peppermint oil away from infants' faces and wipe nipple-area products off before breastfeeding as directed", "Stop and report worsening heartburn, allergic reaction, breathing problems in a child, severe abdominal pain, or blood in stool", "Do not let peppermint symptom relief delay evaluation of new or alarm GI symptoms"],
      nclexTraps: ["Peppermint oil may help IBS symptoms in adults, but new GI bleeding, fever, weight loss, or severe pain is not an IBS supplement question.", "The pediatric trap is menthol exposure near an infant's face or airway."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Food amounts are different from medicinal oil; use medicinal oral or topical nipple products only with obstetric/pediatric guidance." },
        { type: "pediatric", label: "Infant/young child unsafe near face", note: "Menthol inhalation from peppermint oil near the face/chest can cause serious breathing concerns." },
        { type: "geriatric", label: "Older adult caution", note: "New abdominal symptoms, weight loss, bleeding, anemia, or dysphagia in older adults require evaluation rather than supplement self-treatment." }
      ],
      tags: ["peppermint", "peppermint oil", "menthol", "ibs", "reflux", "heartburn", "infant safety", "essential oil", "aromatherapy"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Elderberry",
      category: "Herbal supplement",
      aliases: ["black elderberry", "European elder", "common elder", "sambucus nigra", "elderberry syrup", "elderberry gummies"],
      usedFor: ["Marketed for colds, flu, upper respiratory symptoms, immune support, and viral illness prevention claims"],
      nclexEssential: true,
      majorRisks: ["Raw or unripe elderberries and elder tree leaves/stems can contain cyanide-producing substances and may cause nausea, vomiting, severe diarrhea, or serious illness", "Evidence for preventing or treating COVID-19 is insufficient and claims have triggered FDA/FTC action", "Pregnancy and breastfeeding safety for medicinal use is uncertain", "Product quality and immune-claim marketing vary"],
      interactions: ["Immunosuppressants or transplant medications with provider review", "Diabetes medications with glucose-monitoring caution", "Diuretics or laxative-stacking products if GI losses occur", "Any high-risk medication regimen where supplement disclosure matters"],
      contraindications: ["Pregnancy or breastfeeding unless specifically approved", "Do not use homemade, raw, or unripe elderberry preparations", "Severe vomiting/diarrhea, dehydration, or suspected poisoning", "Immunocompromised clients without provider review", "Do not use to replace antiviral therapy, vaccination, or urgent respiratory evaluation"],
      nursingAssessment: ["Ask product type and source: syrup, gummy, tea, homemade preparation, raw berries, leaves, stems, or commercial supplement", "Assess respiratory symptoms, fever, dyspnea, dehydration, vomiting/diarrhea, pregnancy/lactation status, immune suppression, and use of antiviral or prescribed therapy", "Screen for COVID-19/flu red flags and do not let supplement use delay testing or treatment when indicated"],
      teaching: ["Do not eat raw/unripe elderberries or use leaves/stems; use only properly prepared commercial products if approved", "Do not rely on elderberry to prevent or treat COVID-19 or severe influenza-like illness", "Seek care for trouble breathing, persistent high fever, dehydration, severe GI symptoms, confusion, chest pain, or symptoms in high-risk clients", "Tell the provider/pharmacist about elderberry before starting it with immune, transplant, diabetes, or high-risk medications"],
      nclexTraps: ["The elderberry trap is homemade or raw plant exposure plus GI toxicity; not all berry products are safe because they sound like food.", "Elderberry immune claims should not delay evaluation of flu/COVID red flags or use of prescribed antivirals."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid medicinal elderberry unless an obstetric provider approves because safety data are limited." },
        { type: "pediatric", label: "Pediatric caution", note: "Avoid raw plant exposure and assess dehydration quickly if vomiting or diarrhea occurs." },
        { type: "geriatric", label: "Older adult caution", note: "Older adults are more vulnerable to dehydration, severe respiratory infection, and medication interactions." }
      ],
      tags: ["elderberry", "sambucus", "cold", "flu", "covid claims", "cyanide", "vomiting", "diarrhea", "immune support"],
      sourceKeys: ["nccih-supplements", "fda-supplements"]
    },
    {
      name: "Probiotics",
      category: "Live microorganism supplement / food product",
      aliases: ["probiotic", "lactobacillus", "bifidobacterium", "saccharomyces boulardii", "fermented foods", "live cultures"],
      usedFor: ["Used or marketed for gut health, antibiotic-associated diarrhea prevention, IBS symptoms, vaginal/urinary health, immune support, infant colic, necrotizing enterocolitis prevention protocols, and microbiome support"],
      nclexEssential: true,
      majorRisks: ["Usually tolerated by healthy people, but safety data are limited for many products and strains", "Severe or fatal infections have been reported in premature infants given probiotics; FDA has warned clinicians about this risk", "Higher-risk clients may develop infection, harmful substance exposure, or transfer of antibiotic-resistance genes", "Some products may contain organisms not listed on the label or contaminants", "Effects are strain-specific; one probiotic result does not apply to all products"],
      interactions: ["Immunosuppressants", "Chemotherapy or neutropenia-related regimens", "Central venous catheter or parenteral nutrition infection-risk contexts", "Broad-spectrum antibiotics may alter probiotic viability/timing", "Antifungals may affect yeast-based probiotics such as Saccharomyces boulardii"],
      contraindications: ["Premature infants or NICU use unless part of an approved institutional protocol", "Severely immunocompromised clients without prescriber approval", "Critical illness, central line, short bowel syndrome, severe mucositis, or high infection risk without specialist guidance", "Do not use to postpone evaluation of fever, bloody diarrhea, severe abdominal pain, dehydration, or sepsis signs"],
      nursingAssessment: ["Ask strain/product, dose, reason for use, recent antibiotics, diarrhea pattern, fever, blood in stool, immune status, central line, pregnancy/lactation status, infant prematurity, and ICU/NICU context", "Differentiate mild antibiotic-associated diarrhea from C. difficile red flags, dehydration, sepsis, or GI bleeding", "For hospitalized/high-risk clients, verify whether probiotic use is ordered and allowed by facility policy"],
      teaching: ["Choose probiotic use with the provider/pharmacist when immunocompromised, critically ill, pregnant, caring for a premature infant, or taking complex medications", "Do not treat fever, sepsis symptoms, bloody diarrhea, dehydration, or severe abdominal pain with probiotics alone", "Benefits and risks depend on the exact strain and product; more colony-forming units is not automatically better", "Report fever, chills, worsening diarrhea, rash/allergy, bloating that is severe, or signs of infection"],
      nclexTraps: ["Probiotics are not automatically harmless in NICU, ICU, central-line, or immunocompromised clients; infection risk is the priority.", "A probiotic benefit for one strain does not prove the same benefit for every product on the shelf."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution", note: "Food cultures are different from high-dose supplements; use supplements with obstetric/provider guidance if health risks exist." },
        { type: "pediatric", label: "Premature infant high risk", note: "Premature infants have had severe or fatal infections linked to probiotic products; use only under strict clinical protocols." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk when frail, hospitalized, immunosuppressed, or living with central lines or severe illness." }
      ],
      tags: ["probiotic", "lactobacillus", "bifidobacterium", "saccharomyces", "microbiome", "diarrhea", "immunocompromised", "premature infant", "infection risk"],
      sourceKeys: ["nccih-supplements", "fda-supplements"]
    },
    {
      name: "Green tea extract",
      category: "Herbal / dietary supplement",
      aliases: ["green tea", "camellia sinensis", "egcg", "green tea catechins", "green tea supplement", "matcha extract"],
      usedFor: ["Marketed for weight loss, cholesterol reduction, antioxidant effects, energy, heart health, cancer prevention claims, and metabolic support"],
      nclexEssential: true,
      majorRisks: ["Green tea beverage is generally tolerated by adults but contains caffeine", "Extract supplements can cause nausea, constipation, abdominal discomfort, increased blood pressure, and uncommon liver injury", "High-dose green tea can reduce levels/effectiveness of nadolol and green tea extract can reduce atorvastatin levels; other medication interactions are possible", "Caffeine can worsen insomnia, palpitations, anxiety, tremor, GERD, and pregnancy/lactation concerns", "Do not use supplement claims to replace statins, antihypertensives, cancer screening, or prescribed therapy"],
      interactions: ["Nadolol", "Atorvastatin", "Raloxifene", "Stimulants or high-caffeine products", "Warfarin/anticoagulants with monitoring caution", "Hepatotoxic medications", "Antihypertensives", "Anxiety/insomnia medications"],
      contraindications: ["Active liver disease, jaundice, or prior supplement-related liver injury without provider approval", "Uncontrolled hypertension, significant tachyarrhythmia, severe anxiety/insomnia, or caffeine sensitivity without review", "Pregnancy or breastfeeding high-caffeine or concentrated extract use without obstetric guidance", "Do not use as a primary weight-loss or cancer-prevention treatment"],
      nursingAssessment: ["Ask whether the client drinks tea or uses concentrated capsules, powders, energy products, or weight-loss blends", "Assess dose/caffeine load, BP, pulse, sleep, anxiety, palpitations, GERD, liver symptoms, pregnancy/lactation status, and use of nadolol, atorvastatin, raloxifene, anticoagulants, or hepatotoxic drugs", "For jaundice, dark urine, RUQ pain, severe fatigue, or unexplained nausea, escalate for liver evaluation rather than recommending continued supplement use"],
      teaching: ["Brewed green tea is different from concentrated extract capsules and weight-loss blends", "Stop and seek care for jaundice, dark urine, severe fatigue, RUQ pain, severe nausea/vomiting, chest pain, or severe palpitations", "Discuss use with the prescriber/pharmacist if taking nadolol, atorvastatin, raloxifene, anticoagulants, liver-risk medicines, or stimulant products", "During pregnancy or breastfeeding, count green tea toward total caffeine intake and avoid high-dose extracts unless approved"],
      nclexTraps: ["Green tea extract is a liver-injury and interaction trap, especially in weight-loss products; brewed tea safety does not make concentrated capsules benign.", "If a client takes nadolol or atorvastatin, green tea products can become a medication-effectiveness question."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caffeine caution", note: "Use obstetric guidance for total caffeine intake and avoid high-dose extracts unless specifically approved." },
        { type: "geriatric", label: "Older adult caution", note: "Higher likelihood of beta-blockers, statins, anticoagulants, insomnia, hypertension, liver disease, and polypharmacy." }
      ],
      tags: ["green tea", "green tea extract", "egcg", "caffeine", "liver injury", "nadolol", "atorvastatin", "blood pressure", "weight loss"],
      sourceKeys: ["nccih-supplements", "nccih-interactions", "fda-supplements"]
    },
    {
      name: "Tea tree oil",
      category: "Topical essential oil",
      aliases: ["tea tree", "melaleuca oil", "melaleuca alternifolia", "Australian tea tree oil", "tea tree essential oil"],
      usedFor: ["Promoted for topical use for acne, athlete's foot, toenail fungus, lice, eyelid Demodex/blepharitis products, wounds, insect bites, and other skin conditions"],
      nclexEssential: true,
      majorRisks: ["Tea tree oil should not be swallowed; ingestion can cause confusion, unsteadiness, inability to walk, and coma", "Topical products can cause redness, irritation, allergic dermatitis, or worsening skin irritation", "Old or heat/light/air-exposed products may be more irritating", "Evidence for many uses is limited and standard treatments may work better", "Mouthrinses or topical products containing tea tree oil should not be swallowed"],
      interactions: ["Other topical acne/antifungal/irritant products such as benzoyl peroxide, retinoids, salicylic acid, alcohol-based products, or strong exfoliants", "Wound-care products where irritation can obscure infection", "Any medication regimen when accidental ingestion or allergy occurs"],
      contraindications: ["Oral ingestion or use in food/drink", "Known allergy to tea tree oil or essential oils", "Deep wounds, burns, cellulitis, spreading infection, eye injury, or severe skin disease without provider evaluation", "Do not use or store tea tree oil where children may ingest it; keep it secured and supervise clinician-approved topical use"],
      nursingAssessment: ["Ask route, concentration, dilution, age of product, body site, reason for use, open wounds, eye exposure, and whether any amount was swallowed", "Assess rash, contact dermatitis, worsening infection, fever, cellulitis, ocular symptoms, gait change, confusion, vomiting, or CNS depression after possible ingestion", "For ingestion, treat as potential poisoning and contact poison control/provider immediately"],
      teaching: ["Use tea tree oil only topically and only as directed; never swallow it or use it as a drink, mouth rinse to swallow, or home remedy for internal illness", "Keep essential oils locked away from children and pets", "Stop use for rash, burning, swelling, worsening redness, pus, fever, or allergic symptoms", "Seek urgent help after ingestion, confusion, trouble walking, severe drowsiness, or coma-like symptoms"],
      nclexTraps: ["Tea tree oil is an essential-oil poisoning trap: oral ingestion is not benign and can cause neurologic toxicity.", "Do not let topical supplement use hide cellulitis, abscess, burn infection, or eye involvement."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation topical caution", note: "Topical products may be acceptable for some clients, but avoid ingestion and ask the obstetric/pediatric provider for nipple, infant-contact, or large-area use." },
        { type: "pediatric", label: "Child ingestion hazard", note: "Children are at high risk for accidental ingestion; store securely and treat any ingestion as urgent." },
        { type: "geriatric", label: "Older adult caution", note: "Fragile skin, diabetes, vascular disease, wounds, and infection risk make delayed care more dangerous." }
      ],
      tags: ["tea tree oil", "melaleuca", "essential oil", "topical", "ingestion", "coma", "confusion", "skin irritation", "acne", "athlete foot"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Flaxseed",
      category: "Dietary supplement / seed oil",
      aliases: ["flax", "linseed", "flaxseed oil", "linseed oil", "flaxseed mucilage", "alpha-linolenic acid", "ALA"],
      usedFor: ["Marketed for heart health, cholesterol support, constipation, weight loss, diabetes/metabolic support, inflammation, immune support, and omega-3 intake"],
      nclexEssential: true,
      majorRisks: ["Raw or unripe flaxseeds may contain potentially toxic compounds", "Higher doses can cause bloating, fullness, diarrhea, and other digestive symptoms", "Theoretical interaction concerns exist with anticoagulant and antiplatelet medications", "Pregnancy safety is uncertain and some studies suggest possible harm; breastfeeding safety is also uncertain", "Flaxseed oil and flaxseed preparations are not interchangeable for fiber, laxative, or omega-3 effects"],
      interactions: ["Warfarin", "Heparin", "Aspirin", "Clopidogrel", "NSAIDs", "Anticoagulants/antiplatelets", "Diabetes medications with glucose-monitoring caution", "Oral medications taken at the same time may have absorption issues if large fiber doses are used"],
      contraindications: ["Pregnancy or breastfeeding unless specifically approved", "Raw/unripe flaxseed ingestion", "Active diarrhea, bowel obstruction symptoms, severe abdominal pain, or difficulty swallowing without provider review", "High bleeding risk or anticoagulant/antiplatelet therapy without pharmacist/provider review"],
      nursingAssessment: ["Ask whether the client uses whole/ground flaxseed, flaxseed oil, mucilage powder, capsules, smoothies, or laxative products", "Assess bowel pattern, diarrhea, bloating, abdominal pain, pregnancy/lactation status, bleeding history, anticoagulant/antiplatelet use, diabetes therapy, and timing with oral medications", "For constipation, screen for red flags such as vomiting, severe pain, blood in stool, unexplained weight loss, or no flatus/stool"],
      teaching: ["Do not eat raw or unripe flaxseeds", "Take fiber-type products with adequate fluid unless fluid restriction applies", "Report unusual bleeding, severe diarrhea, severe abdominal pain, vomiting, rash, or hypoglycemia symptoms", "Discuss flaxseed with the provider/pharmacist before surgery, pregnancy, breastfeeding, anticoagulants, antiplatelets, diabetes medications, or complex medication regimens"],
      nclexTraps: ["Flaxseed sounds like food, but supplement dosing raises pregnancy, bleeding, GI, and medication-timing questions.", "Flaxseed oil does not provide the same bulk-forming fiber effect as ground flaxseed or mucilage."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy caution / avoid medicinal dosing", note: "Avoid supplement dosing unless the obstetric provider approves because safety evidence is uncertain and possible harm has been suggested." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk for anticoagulant/antiplatelet use, constipation red flags, dehydration from diarrhea, and medication absorption timing issues." }
      ],
      tags: ["flaxseed", "linseed", "flaxseed oil", "fiber", "omega 3", "bleeding", "warfarin", "pregnancy", "diarrhea", "constipation"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Lavender",
      category: "Herbal / aromatherapy product",
      aliases: ["lavandula angustifolia", "lavender oil", "English lavender", "common lavender", "French lavender", "lavender aromatherapy", "lavender capsules"],
      usedFor: ["Promoted for anxiety, stress, sleep, mood symptoms, aromatherapy relaxation, topical fragrance, cough products, menopause-related symptoms, and general calming claims"],
      nclexEssential: true,
      majorRisks: ["Oral lavender products can cause diarrhea, headache, nausea, and burping", "Aromatherapy may cause headache or coughing", "Topical lavender can cause allergic skin reactions", "Potential additive sedation with sedative drugs or herbs, especially before surgery or procedures", "Pregnancy and breastfeeding safety are uncertain for medicinal products", "Depression, anxiety, insomnia, or cough red flags should not be self-treated with lavender alone"],
      interactions: ["Benzodiazepines", "Opioids", "Sleep medicines", "Alcohol", "Sedating antihistamines", "Antipsychotics", "Other sedating herbs such as kava or valerian", "Anesthesia/procedural sedation"],
      contraindications: ["Upcoming surgery or sedation procedure without disclosure to anesthesia/surgeon", "Pregnancy or breastfeeding medicinal use unless approved", "Known lavender allergy or significant fragrance-triggered asthma/headache", "Severe depression, suicidality, panic, chest pain, dyspnea, or persistent cough without medical evaluation"],
      nursingAssessment: ["Ask route: oral capsule/tea/syrup, aromatherapy diffuser, topical oil, bath product, or fragrance exposure", "Assess sedation, dizziness, falls, respiratory symptoms, headaches, skin reactions, depression/suicide risk, anxiety severity, pregnancy/lactation status, and sedating medication use", "Before procedures, specifically ask about lavender and other calming supplements because clients may not report aromatherapy or oils as medications"],
      teaching: ["Do not combine lavender with alcohol, sedatives, sleep medicines, opioids, or anesthesia plans without provider guidance", "Stop topical use for rash, swelling, itching, or worsening irritation", "Seek care for suicidal thoughts, severe depression, chest pain, trouble breathing, severe cough, severe sedation, or confusion", "Use caution with driving or fall-risk activities if oral lavender causes drowsiness"],
      nclexTraps: ["Lavender is a sedation-and-surgery disclosure trap: calming products still matter before anesthesia.", "Aromatherapy comfort should not hide serious depression, respiratory symptoms, or medication-related sedation."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid medicinal oral products unless obstetric/pediatric providers approve because safety data are limited." },
        { type: "pediatric", label: "Pediatric caution", note: "Use topical/fragrance products cautiously and stop for rash, breathing symptoms, or unexpected breast tissue changes." },
        { type: "geriatric", label: "Older adult caution", note: "Higher fall, confusion, sedation stacking, procedure, and polypharmacy risk." }
      ],
      tags: ["lavender", "lavender oil", "aromatherapy", "sedation", "anxiety", "sleep", "topical allergy", "surgery", "pregnancy"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Fenugreek",
      category: "Herbal supplement / food seed",
      aliases: ["trigonella foenum-graecum", "fenugreek seed", "methi", "fenugreek tea", "fenugreek capsules"],
      usedFor: ["Marketed for diabetes/glucose support, menstrual cramps, lactation or milk-supply support, digestion, cholesterol support, and general wellness"],
      nclexEssential: true,
      majorRisks: ["Large doses may cause a harmful drop in blood sugar", "GI side effects include diarrhea, nausea, and other digestive symptoms", "Allergic reactions, including serious reactions, can occur", "Not safe during pregnancy in amounts greater than food amounts; linked to increased birth-defect risk", "Breastfeeding milk-supply evidence is mixed and medicinal-dose safety is uncertain"],
      interactions: ["Insulin", "Sulfonylureas", "GLP-1 agents and other diabetes medications", "Warfarin or anticoagulants with monitoring caution", "Antiplatelets with bleeding-risk caution", "Other glucose-lowering herbs/supplements"],
      contraindications: ["Pregnancy medicinal dosing", "Hypoglycemia-prone clients or diabetes medication use without glucose monitoring/provider review", "Known allergy to fenugreek or related legumes without clinician guidance", "Infants/children using medicinal doses without pediatric provider approval", "Do not use to replace diabetes treatment or lactation evaluation"],
      nursingAssessment: ["Ask whether the client uses fenugreek as food spice, tea, capsules, lactation supplement, or glucose product", "Assess pregnancy/lactation status, infant feeding concerns, glucose logs, hypoglycemia symptoms, diabetes medications, allergy history, GI symptoms, anticoagulant/antiplatelet use, and planned procedures", "For lactation concerns, assess latch, infant weight/wet diapers, maternal medications, postpartum complications, and need for lactation consultant/provider support"],
      teaching: ["Avoid medicinal fenugreek during pregnancy; food seasoning amounts are different from supplement dosing", "Monitor glucose closely and report sweating, shakiness, confusion, palpitations, hunger, dizziness, or fainting", "Stop and seek help for allergic symptoms, wheezing, facial swelling, severe diarrhea, or severe hypoglycemia", "Do not use fenugreek as a substitute for prescribed diabetes medications or for evaluation of low milk supply/infant poor weight gain"],
      nclexTraps: ["Fenugreek is a pregnancy and hypoglycemia trap: lactation or diabetes marketing does not make it safe for pregnant clients or clients taking glucose-lowering drugs.", "A breastfeeding client with poor infant weight gain needs lactation/medical assessment, not just an herbal galactagogue."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe above food amounts", note: "Avoid supplement/medicinal dosing because use above food amounts has been linked with increased birth-defect risk." },
        { type: "pediatric", label: "Pediatric caution", note: "Use in children only with pediatric guidance; watch for allergy and glucose effects." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk for diabetes medication interactions, hypoglycemia injury, anticoagulant use, and dehydration from GI side effects." }
      ],
      tags: ["fenugreek", "methi", "diabetes", "hypoglycemia", "lactation", "pregnancy", "birth defects", "allergy", "diarrhea"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Yohimbe",
      category: "Herbal / stimulant-risk supplement",
      aliases: ["yohimbine", "johimbi", "pausinystalia yohimbe", "yohimbe bark"],
      usedFor: ["Marketed for erectile dysfunction, sexual performance, athletic performance, weight loss, mood, and energy claims"],
      nclexEssential: true,
      majorRisks: ["Yohimbine has been associated with dysrhythmias, blood pressure problems, myocardial infarction, and seizures", "Can cause tachycardia, anxiety, hypertension, GI upset, agitation, and need for medical care", "Product labels often do not state reliable yohimbine content", "Serious interaction risk with MAOIs and tricyclic antidepressants", "Pregnancy and breastfeeding oral use may be unsafe"],
      interactions: ["MAOIs", "Tricyclic antidepressants", "Stimulants", "Antihypertensives", "Nitrates or cardiac medications", "Psychiatric medications", "Caffeine-heavy or weight-loss products"],
      contraindications: ["Pregnancy or breastfeeding", "MAOI or tricyclic antidepressant use", "Uncontrolled hypertension", "Dysrhythmia, coronary artery disease, seizure disorder, severe anxiety, panic disorder, bipolar disorder, or psychosis risk without provider approval", "Do not use as an OTC erectile dysfunction treatment without clinician evaluation"],
      nursingAssessment: ["Ask about sexual performance, weight-loss, bodybuilding, and energy supplements by name because clients may not volunteer them", "Assess blood pressure, heart rate and rhythm, chest pain, palpitations, anxiety or agitation, seizure history, psychiatric history, ED medications, antidepressants, stimulants, and cardiac disease"],
      teaching: ["Avoid yohimbe with MAOIs, tricyclic antidepressants, stimulants, or heart and blood pressure medicines unless a prescriber specifically approves", "Seek urgent care for chest pain, severe headache, fainting, seizure, severe anxiety, palpitations, or neurologic symptoms", "Product yohimbine dose may be unreliable; do not assume a supplement label reflects safety"],
      nclexTraps: ["Yohimbe is a stimulant and cardiac-risk supplement, not a benign ED remedy.", "ED plus yohimbe should trigger cardiovascular and medication-interaction assessment."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation unsafe", note: "Avoid oral yohimbe because safety concerns and stimulant/cardiovascular effects matter." },
        { type: "geriatric", label: "Older adult caution", note: "Higher baseline coronary disease, dysrhythmia, antihypertensive, nitrate, and psychiatric-medication risk." }
      ],
      tags: ["yohimbe", "yohimbine", "stimulant", "erectile dysfunction", "hypertension", "tachycardia", "arrhythmia", "seizure", "MAOI", "TCA"],
      sourceKeys: ["nccih-supplements", "nccih-interactions", "fda-supplements"]
    },
    {
      name: "Bitter orange",
      category: "Herbal / stimulant-risk supplement",
      aliases: ["citrus aurantium", "Seville orange", "sour orange", "zhi shi", "synephrine", "p-synephrine"],
      usedFor: ["Marketed for weight loss, sports performance, energy, appetite suppression, and as an ephedra-alternative ingredient"],
      nclexEssential: true,
      majorRisks: ["Contains p-synephrine, a stimulant-like compound structurally related to ephedrine", "Serious events reported in users of bitter orange products include dysrhythmias, myocardial infarction, and strokes, often with multi-ingredient products", "May raise blood pressure or heart rate in some clients", "Labeling and adulteration problems have been reported, including illegal synthetic amines", "Pregnancy or breastfeeding use may not be safe"],
      interactions: ["Stimulants", "Caffeine-heavy products", "MAOIs", "ADHD stimulants", "Decongestants", "Antihypertensives", "Beta blockers", "Cardiac medications", "QT-prolonging medications", "Sports supplements"],
      contraindications: ["Pregnancy or breastfeeding", "Uncontrolled hypertension", "Dysrhythmia, coronary artery disease, stroke history, severe anxiety, or stimulant sensitivity without provider approval", "Do not use if subject to NCAA banned-stimulant rules", "Do not use as a primary weight-loss treatment"],
      nursingAssessment: ["Ask specifically about weight-loss, pre-workout, energy, and sports supplements that may contain bitter orange or synephrine", "Assess blood pressure, heart rate and rhythm, chest pain, palpitations, headache, neurologic symptoms, caffeine or stimulant load, sports participation, pregnancy or lactation status, and cardiac or stroke history"],
      teaching: ["Avoid stacking bitter orange with caffeine, stimulants, decongestants, or energy products", "Seek urgent care for chest pain, severe headache, weakness or numbness, palpitations, fainting, or severe hypertension symptoms", "Athletes should know synephrine and bitter orange are banned by the NCAA", "Weight-loss marketing does not prove safety or effectiveness"],
      nclexTraps: ["Bitter orange is the ephedra-alternative stimulant trap: check blood pressure, heart rate, chest pain, stroke symptoms, and product stacking.", "A supplement in a pre-workout or weight-loss blend may not be obvious unless the nurse asks."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid", note: "Avoid because safety is uncertain and animal data raise lactation concerns." },
        { type: "geriatric", label: "Older adult caution", note: "Higher baseline cardiovascular disease and medication-interaction risk." }
      ],
      tags: ["bitter orange", "synephrine", "stimulant", "weight loss", "pre workout", "hypertension", "tachycardia", "stroke", "heart attack", "NCAA"],
      sourceKeys: ["nccih-supplements", "nccih-interactions", "fda-supplements"]
    },
    {
      name: "Hawthorn",
      category: "Herbal cardiovascular supplement",
      aliases: ["hawthorne", "crataegus", "tejocote", "Mexican hawthorn", "raiz de tejocote", "shanzha", "WS 1442"],
      usedFor: ["Marketed for heart failure, heart and blood vessel support, blood pressure, circulation, anxiety, digestion, and weight loss"],
      nclexEssential: true,
      majorRisks: ["Heart-failure evidence is conflicting and hawthorn should not replace guideline-directed therapy", "Potential interaction with heart medications is a major concern", "Side effects can include dizziness, nausea, vomiting, diarrhea, and muscle pain", "Some products labeled tejocote or Mexican hawthorn have been found to contain toxic yellow oleander, which can be severe or fatal", "Pregnancy and breastfeeding safety are uncertain"],
      interactions: ["Digoxin", "Beta blockers", "Calcium channel blockers", "Nitrates", "Antihypertensives", "Diuretics", "Heart failure medications", "Antiarrhythmics"],
      contraindications: ["Pregnancy or breastfeeding unless approved", "Heart failure, angina, dysrhythmia, syncope, or unexplained edema without cardiology or provider review", "Do not use products labeled tejocote root or Mexican hawthorn from unreliable sources", "Do not use for weight loss or to replace prescribed cardiac therapy"],
      nursingAssessment: ["Ask about heart supplements, tejocote root, weight-loss products, and online products", "Assess chest pain, dyspnea, edema, weight gain, syncope, palpitations, blood pressure, heart rate, digoxin or cardiac medication use, pregnancy or lactation status, and product source"],
      teaching: ["Do not stop prescribed heart failure, blood pressure, rhythm, or angina medications because of hawthorn", "Avoid unreliable tejocote or hawthorn weight-loss products due to toxic adulteration risk", "Seek urgent care for chest pain, fainting, severe dizziness, palpitations, dyspnea, edema, or poisoning symptoms"],
      nclexTraps: ["Hawthorn is a cardiac medication-interaction trap, especially in heart failure clients.", "Tejocote root products may actually contain yellow oleander, so weight-loss use can become a poisoning question."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid medicinal use unless provider approves because safety is uncertain." },
        { type: "geriatric", label: "Older adult caution", note: "High likelihood of cardiac disease, digoxin or antihypertensive use, syncope/fall risk, and polypharmacy." }
      ],
      tags: ["hawthorn", "tejocote", "yellow oleander", "heart failure", "digoxin", "blood pressure", "arrhythmia", "weight loss", "poisoning"],
      sourceKeys: ["nccih-supplements", "nccih-interactions", "fda-supplements"]
    },
    {
      name: "Horse chestnut",
      category: "Herbal venous supplement",
      aliases: ["aesculus hippocastanum", "horse chestnut seed extract", "buckeye", "Spanish chestnut", "aescin", "escin"],
      usedFor: ["Marketed for chronic venous insufficiency, leg swelling, varicose veins, hemorrhoids, pain and swelling, arthritis, IBS, and male infertility claims"],
      nclexEssential: true,
      majorRisks: ["Raw seeds, bark, flowers, and leaves are unsafe orally because they contain toxic compounds", "Only standardized seed extracts with the toxic component removed have been used safely short term", "Side effects can include dizziness, digestive upset, headache, and itching", "Pregnancy and breastfeeding safety are unknown", "Venous symptoms may require compression, vascular evaluation, or DVT assessment rather than supplement self-treatment"],
      interactions: ["Anticoagulants", "Antiplatelets", "NSAIDs", "Diabetes medications with monitoring caution", "Other herbs that affect bleeding"],
      contraindications: ["Pregnancy or breastfeeding unless approved", "Raw horse chestnut plant ingestion", "Bleeding disorder or anticoagulant/antiplatelet therapy without provider review", "Suspected DVT, sudden unilateral leg swelling or pain, chest pain, or shortness of breath", "Kidney or liver disease without provider review"],
      nursingAssessment: ["Ask whether the client uses standardized seed extract or raw plant, tea, or homemade products", "Assess leg swelling pattern, unilateral pain or warmth, DVT or PE symptoms, skin ulcers, anticoagulant or antiplatelet use, bleeding history, pregnancy or lactation status, dizziness, GI upset, and itching"],
      teaching: ["Do not ingest raw horse chestnut seeds, bark, flowers, or leaves", "Use only standardized products if approved by the provider; do not assume homemade products are safe", "Seek urgent care for unilateral swollen painful leg, chest pain, shortness of breath, hemoptysis, severe bleeding, or poisoning symptoms", "Do not substitute horse chestnut for compression, wound care, or vascular evaluation when ordered"],
      nclexTraps: ["Horse chestnut is the raw-plant toxicity trap; standardized extract is different from raw seed, bark, or leaf exposure.", "Leg swelling is not automatically chronic venous insufficiency; rule out DVT or PE danger cues."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid", note: "Avoid medicinal use unless provider approves because safety is unknown." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk for venous disease, anticoagulant use, ulcers, falls from dizziness, and DVT or PE." }
      ],
      tags: ["horse chestnut", "aescin", "escin", "chronic venous insufficiency", "varicose veins", "raw seed toxicity", "DVT", "bleeding"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Colloidal silver",
      category: "Unsafe supplement / metal product",
      aliases: ["silver supplement", "colloidal silver liquid", "silver nanoparticles", "silver hydrosol"],
      usedFor: ["Marketed online for infections, wounds, sinus problems, immune support, COVID-19 claims, and general disease prevention claims"],
      nclexEssential: true,
      majorRisks: ["FDA warns colloidal silver is not safe or effective for treating any disease or condition", "Can cause argyria, a usually permanent bluish-gray skin discoloration from silver buildup", "May reduce absorption or effectiveness of some drugs including certain antibiotics and thyroxine", "Possible kidney, liver, or nervous system problems", "No known oral function or benefit; can delay evidence-based care"],
      interactions: ["Levothyroxine/thyroxine", "Tetracycline or quinolone antibiotics", "Penicillamine", "Other critical oral medications where absorption matters"],
      contraindications: ["Avoid oral use for all clients", "Pregnancy or breastfeeding", "Kidney, liver, neurologic, thyroid, or infection conditions without provider review", "Do not use for COVID-19, infection treatment, or as a substitute for antibiotics, antivirals, vaccination, or evaluation"],
      nursingAssessment: ["Ask about silver liquids, sprays, drops, homeopathic products, wound products, and online immune or COVID remedies", "Assess skin discoloration, thyroid medication timing, antibiotic use, kidney, liver, or neurologic symptoms, infection severity, pregnancy or lactation status, and whether prescribed therapy is being delayed"],
      teaching: ["Do not take colloidal silver by mouth; it is not an essential mineral and has no proven oral benefit", "Do not use colloidal silver to prevent or treat COVID-19, infections, sinus disease, or chronic illness", "Tell the provider if taking antibiotics or levothyroxine because absorption can be reduced", "Seek care for infection red flags, neurologic symptoms, kidney or liver symptoms, or skin discoloration"],
      nclexTraps: ["Colloidal silver is an unsafe-supplement trap: permanent argyria and drug absorption problems matter more than immune claims.", "Never let colloidal silver delay antibiotics, antivirals, vaccines, or evaluation for infection."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation unsafe / avoid", note: "Avoid because there is no proven oral benefit and there are systemic toxicity and drug-interaction concerns." },
        { type: "geriatric", label: "Older adult caution", note: "Higher likelihood of thyroid replacement, antibiotics, kidney/liver disease, and delayed care from chronic illness claims." }
      ],
      tags: ["colloidal silver", "argyria", "unsafe supplement", "levothyroxine", "antibiotics", "COVID claims", "kidney", "liver", "neurologic"],
      sourceKeys: ["nccih-supplements", "fda-supplements"]
    },
    {
      name: "Blue cohosh",
      category: "Herbal obstetric-risk supplement",
      aliases: ["caulophyllum thalictroides", "blue ginseng", "papoose root", "squaw root", "blue cohosh root"],
      usedFor: ["Historically used or marketed for labor induction, menstrual problems, childbirth preparation, contraception/abortion claims, and uterine stimulation"],
      nclexEssential: true,
      majorRisks: ["Potential uterine-stimulant or abortifacient effects make pregnancy use unsafe without specialist direction", "High-dose use has caused nicotine-like toxicity symptoms such as nausea/vomiting, dizziness, fasciculations, tachycardia, tachypnea, hypertension, seizures, and respiratory failure", "Contains nicotinic alkaloid activity such as N-methylcytisine, so cardiac, blood pressure, neurologic, and respiratory toxicity are safety priorities", "Not the same as black cohosh; both require disclosure but blue cohosh is especially an obstetric toxicity trap", "May delay evidence-based evaluation of preterm labor, post-dates pregnancy, bleeding, or fetal concerns"],
      interactions: ["Nicotine products or smoking-cessation products with nicotinic effects", "Antihypertensives or cardiovascular medications", "Labor-induction agents such as oxytocin or prostaglandins", "Stimulants", "Antiseizure or neurologic-risk medications", "Other uterotonic herbs"],
      contraindications: ["Pregnancy or attempts to induce labor unless directly supervised by an obstetric clinician", "Breastfeeding without provider approval", "Hypertension, tachyarrhythmia, seizure disorder, respiratory disease, or cardiac disease without provider review", "Preterm contractions, vaginal bleeding, decreased fetal movement, ruptured membranes, severe abdominal pain, or suspected pregnancy complication"],
      nursingAssessment: ["Ask pregnant/postpartum clients specifically about blue cohosh, labor teas, midwife/herbal induction products, and online birth-prep supplements", "Assess gestational age, contractions, bleeding, rupture of membranes, fetal movement, BP, HR, neuro symptoms, respiratory status, nausea/vomiting, seizure history, and concurrent oxytocin/prostaglandin/nicotine/stimulant exposure"],
      teaching: ["Do not use blue cohosh to start labor, end pregnancy, or treat menstrual/pregnancy concerns without obstetric supervision", "Seek urgent care for contractions before term, vaginal bleeding, decreased fetal movement, severe headache, chest pain, palpitations, seizure, shortness of breath, severe vomiting, or fainting", "Tell OB/anesthesia teams about all labor-prep herbs because natural uterotonics can affect maternal/fetal safety"],
      nclexTraps: ["Blue cohosh is a pregnancy/labor-induction red flag, not a harmless birth-prep tea.", "Do not confuse blue cohosh with black cohosh; blue cohosh raises uterotonic and nicotinic-toxicity concerns."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy unsafe / avoid", note: "Avoid because of uterine stimulation and maternal/fetal toxicity concerns unless an obstetric specialist explicitly directs use." },
        { type: "pediatric", label: "Infant exposure concern", note: "Avoid breastfeeding or infant exposure unless a pediatric/OB clinician approves." },
        { type: "geriatric", label: "Older adult caution", note: "Less common use, but cardiac, BP, seizure, and medication-interaction risks still matter." }
      ],
      tags: ["blue cohosh", "caulophyllum", "labor induction", "pregnancy", "uterotonic", "abortifacient", "nicotinic toxicity", "tachycardia", "hypertension", "seizure"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Chaparral",
      category: "Unsafe herbal supplement / hepatotoxicity risk",
      aliases: ["larrea tridentata", "creosote bush", "greasewood", "gobernadora", "hediondilla", "NDGA", "nordihydroguaiaretic acid"],
      usedFor: ["Marketed historically for cancer claims, inflammation, arthritis, infections/colds, skin sores, diabetes, urinary problems, kidney/gallbladder stones, and black salve/alternative cancer claims"],
      nclexEssential: true,
      majorRisks: ["Not shown to treat any medical condition", "Associated with severe liver toxicity including acute hepatitis, cirrhosis, liver failure, and cases requiring transplant", "Kidney injury/failure and other renal concerns have been reported", "FDA removed NDGA from GRAS food-additive status and chaparral products are not recommended", "Can delay evidence-based cancer, infection, liver, kidney, or inflammatory disease care"],
      interactions: ["Hepatotoxic medications", "Alcohol", "Acetaminophen overuse", "Chemotherapy or immunotherapy regimens", "Statins or other liver-monitored drugs", "Nephrotoxic medications", "Anticoagulants/antiplatelets if liver dysfunction develops"],
      contraindications: ["Avoid oral use", "Pregnancy or breastfeeding", "Liver disease, elevated LFTs, hepatitis, cirrhosis, transplant history, or heavy alcohol use", "Kidney disease", "Cancer or serious infection self-treatment without oncology/provider care", "Do not use in black salve or other escharotic products"],
      nursingAssessment: ["Ask about chaparral tea, capsules, black salve, creosote bush, gobernadora, and alternative cancer products", "Assess jaundice, dark urine, RUQ pain, pruritus, severe fatigue, nausea/vomiting, bruising/bleeding, kidney symptoms, urine output, alcohol/acetaminophen use, chemotherapy, liver-risk medications, and delayed oncology care"],
      teaching: ["Avoid chaparral; it has no proven clinical benefit and is linked to severe liver injury", "Seek urgent care for jaundice, dark urine, RUQ pain, severe fatigue, confusion, easy bleeding, decreased urine, swelling, or severe vomiting", "Do not use black salve or chaparral products for cancer or skin lesions; biopsy and oncology/dermatology care matter"],
      nclexTraps: ["Chaparral is a liver-transplant-level hepatotoxicity trap, not an anti-inflammatory wellness herb.", "Alternative cancer products plus jaundice or delayed biopsy/treatment is a safety priority."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid", note: "Avoid because there is no proven benefit and there are serious liver/kidney toxicity concerns." },
        { type: "geriatric", label: "Older adult caution", note: "Higher baseline liver/kidney disease, polypharmacy, cancer, and medication-toxicity risk." }
      ],
      tags: ["chaparral", "creosote bush", "NDGA", "liver toxicity", "hepatitis", "cirrhosis", "liver transplant", "kidney failure", "black salve", "cancer claims"],
      sourceKeys: ["nccih-supplements", "fda-supplements"]
    },
    {
      name: "Lobelia",
      category: "Herbal / nicotine-like toxicity supplement",
      aliases: ["lobelia inflata", "Indian tobacco", "asthma weed", "gagroot", "pukeweed", "vomit weed", "lobeline"],
      usedFor: ["Marketed historically for smoking cessation, asthma, respiratory symptoms, cough, depression, drug withdrawal, vomiting, and inflammation claims"],
      nclexEssential: true,
      majorRisks: ["Current evidence does not support lobelia for smoking cessation, asthma, or other conditions", "Lobeline has nicotine-like activity and may interact additively or unpredictably with nicotine products", "Higher doses can cause CNS depression and reduced respiratory rate", "Can cause dizziness, nausea, vomiting, throat irritation, and toxicity concerns", "Can delay evidence-based asthma/COPD exacerbation or smoking-cessation treatment"],
      interactions: ["Nicotine replacement therapy", "Cigarettes/vaping/nicotine products", "Varenicline or bupropion smoking-cessation therapy with provider review", "Sedatives or CNS depressants", "Respiratory-depressant medications", "Stimulants"],
      contraindications: ["Do not use with nicotine-containing products unless a clinician specifically approves", "Pregnancy or breastfeeding unless approved", "Asthma/COPD exacerbation, dyspnea, wheezing, hypoxemia, or respiratory distress without medical evaluation", "Seizure disorder, significant cardiac disease, or severe vomiting/dehydration without provider review", "Do not use as replacement for rescue inhaler or smoking-cessation plan"],
      nursingAssessment: ["Ask about smoking-cessation herbs, Indian tobacco, asthma weed, teas, lozenges, pastilles, and vaping/nicotine replacement use", "Assess respiratory rate, oxygenation, wheeze, work of breathing, nausea/vomiting, dizziness, sedation, nicotine exposure, pregnancy/lactation status, and whether prescribed inhalers or cessation meds are being skipped"],
      teaching: ["Do not combine lobelia with nicotine patches, gum, lozenges, vaping, or tobacco unless a clinician specifically approves", "Use prescribed rescue inhalers and seek care for wheeze, dyspnea, chest tightness, cyanosis, confusion, or low oxygen", "Seek urgent care for severe vomiting, severe dizziness, sedation, slowed breathing, seizure, chest pain, or palpitations"],
      nclexTraps: ["Lobelia is not a safe substitute for albuterol or evidence-based smoking cessation.", "The nicotine-like additive toxicity trap matters if the client uses patches, gum, vaping, or cigarettes."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid", note: "Avoid unless provider approves because safety is uncertain and nicotine-like toxicity is a concern." },
        { type: "pediatric", label: "Child toxicity concern", note: "Keep away from children; respiratory/CNS effects and vomiting can become urgent." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk with COPD, cardiac disease, sedatives, dehydration, and polypharmacy." }
      ],
      tags: ["lobelia", "lobeline", "Indian tobacco", "asthma weed", "smoking cessation", "nicotine", "CNS depression", "respiratory depression", "vomiting"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Noni",
      category: "Herbal / juice supplement",
      aliases: ["morinda citrifolia", "Indian mulberry", "noni juice", "noni tea", "noni fruit", "hog apple", "morinda"],
      usedFor: ["Marketed for immune support, digestion, energy, aging skin, cancer claims, diabetes, blood pressure, pain, infections, and general wellness"],
      nclexEssential: true,
      majorRisks: ["Human evidence does not show benefit for any health condition", "Liver toxicity cases have been reported after noni juice or tea use, including hepatitis and liver failure reports", "Noni can contain substantial potassium, creating hyperkalemia risk in kidney disease or potassium-restricted clients", "May be unsafe with medicines that increase potassium, lower blood pressure, or harm the liver", "Pregnancy and breastfeeding safety are not established"],
      interactions: ["ACE inhibitors", "ARBs", "Potassium-sparing diuretics such as spironolactone", "Potassium supplements or salt substitutes", "Antihypertensives", "Hepatotoxic medications", "Alcohol", "Diabetes medications with glucose-monitoring caution"],
      contraindications: ["Kidney disease or potassium restriction without provider approval", "Hyperkalemia history", "Liver disease, hepatitis, cirrhosis, elevated LFTs, or heavy alcohol use without provider review", "Pregnancy or breastfeeding unless approved", "Do not use for cancer, diabetes, infection, or blood pressure control instead of evidence-based care"],
      nursingAssessment: ["Ask about noni juice, tea, capsules, powders, immune/cancer products, and traditional remedies", "Assess kidney disease, dialysis, potassium-restricted diet, ACEI/ARB/spironolactone/potassium use, liver symptoms, LFT history, diabetes and BP meds, pregnancy/lactation status, and delayed care for serious illness", "Monitor potassium, renal function, and liver tests if clinically indicated and ordered"],
      teaching: ["Avoid noni with kidney disease, potassium restriction, hyperkalemia risk, or potassium-raising medicines unless provider approves", "Stop and seek care for jaundice, dark urine, RUQ pain, severe fatigue, confusion, decreased urine, palpitations, weakness, or severe vomiting", "Noni marketing does not prove benefit for cancer, diabetes, blood pressure, immunity, or infection"],
      nclexTraps: ["Noni is a hyperkalemia and liver-injury supplement trap, especially with kidney disease or ACEI/ARB/spironolactone use.", "Do not let noni cancer/immune claims delay diagnosis or prescribed treatment."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid medicinal use unless provider approves because safety data are insufficient." },
        { type: "geriatric", label: "Older adult caution", note: "Higher risk for CKD, ACEI/ARB/diuretic use, liver disease, hypertension, diabetes, and polypharmacy." }
      ],
      tags: ["noni", "morinda", "noni juice", "potassium", "hyperkalemia", "kidney disease", "liver toxicity", "hepatitis", "cancer claims", "blood pressure"],
      sourceKeys: ["nccih-supplements", "nccih-interactions"]
    },
    {
      name: "Maca root",
      category: "Herbal / food-root supplement",
      aliases: ["maca", "lepidium meyenii", "Peruvian ginseng", "maca powder", "maca extract"],
      usedFor: ["Marketed for libido, fertility, menopause symptoms, energy, mood, athletic performance, and general hormonal wellness"],
      nclexEssential: true,
      majorRisks: ["Human evidence is limited and product claims often exceed data", "May have estrogenic or hormone-active effects in some products, so hormone-sensitive conditions need caution", "Can cause GI upset, jitteriness, insomnia, headache, or mood changes in some users", "Pregnancy and breastfeeding safety for medicinal doses is not established", "Can delay evaluation of infertility, erectile dysfunction, depression, fatigue, or endocrine disease"],
      interactions: ["Hormone therapies", "Contraceptives or fertility treatments with provider review", "Endocrine medications", "Stimulants/caffeine-heavy products", "Psychiatric medications if mood or insomnia worsens", "Anticoagulants/antiplatelets with general supplement disclosure"],
      contraindications: ["Pregnancy or breastfeeding medicinal dosing unless approved", "Hormone-sensitive cancer or unexplained vaginal bleeding without oncology/OB review", "Bipolar disorder/mania risk or severe insomnia without clinician guidance", "Do not use instead of infertility, ED, depression, or endocrine evaluation"],
      nursingAssessment: ["Ask product form, dose, reason for use, fertility/hormone goals, pregnancy/lactation status, cancer history, menstrual changes, sleep, mood, BP/HR, and concurrent endocrine or psychiatric medications", "Assess whether fatigue, libido change, infertility, hot flashes, or mood symptoms need medical evaluation rather than supplement escalation"],
      teaching: ["Maca is not a proven fertility or hormone treatment; bring the product to the provider/pharmacist for review", "Stop and report rash, severe GI upset, insomnia, palpitations, mood elevation, abnormal bleeding, pregnancy, or worsening symptoms", "Keep recommended cancer screening, fertility workup, and endocrine follow-up rather than substituting maca"],
      nclexTraps: ["Maca is a hormone-claim trap: libido/fertility marketing should trigger pregnancy, cancer, mood, and endocrine assessment.", "Natural energy claims should not hide anemia, thyroid disease, depression, pregnancy, or sleep disorder."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid medicinal use unless obstetric/pediatric provider approves because safety data are limited." },
        { type: "geriatric", label: "Older adult caution", note: "Watch hormone-sensitive cancer history, insomnia, cardiac symptoms, and polypharmacy." }
      ],
      tags: ["maca", "lepidium", "libido", "fertility", "menopause", "hormone claims", "insomnia", "pregnancy"],
      sourceKeys: ["mskcc-maca"]
    },
    {
      name: "Rhodiola",
      category: "Herbal adaptogen / stimulant-like supplement",
      aliases: ["rhodiola rosea", "roseroot", "golden root", "arctic root", "adaptogen"],
      usedFor: ["Marketed for fatigue, stress resilience, anxiety, depression, exercise performance, cognition, and energy"],
      nclexEssential: true,
      majorRisks: ["Evidence for many uses is limited and products vary", "May cause dizziness, dry mouth, jitteriness, insomnia, headache, or GI upset", "Can worsen anxiety, agitation, mania, or insomnia in susceptible clients", "Potential additive effects with stimulants or psychiatric medications are a safety concern", "Pregnancy and breastfeeding safety are not established"],
      interactions: ["Stimulants", "Caffeine-heavy products", "Antidepressants or other serotonergic/psychiatric medications with provider review", "MAOIs", "Bipolar/mania-related medications", "Sedatives if dizziness occurs"],
      contraindications: ["Bipolar disorder, mania/hypomania history, severe anxiety, or uncontrolled insomnia without clinician review", "Pregnancy or breastfeeding unless approved", "Use as a substitute for depression, suicidal ideation, severe fatigue, anemia, thyroid disease, sleep apnea, or cardiac symptom evaluation"],
      nursingAssessment: ["Ask about energy/adaptogen products, caffeine/stimulant load, mood disorder history, sleep, anxiety, suicidal thoughts, BP/HR, pregnancy/lactation status, and psychiatric medications", "Assess fatigue red flags such as chest pain, dyspnea, bleeding, weight loss, fever, anemia, thyroid symptoms, and depression severity"],
      teaching: ["Avoid stacking rhodiola with stimulants or high caffeine without clinician review", "Stop and seek care for mania symptoms, severe anxiety, insomnia, palpitations, chest pain, suicidal thoughts, or allergic reaction", "Do not use adaptogens to delay medical evaluation of severe fatigue or mood symptoms"],
      nclexTraps: ["Rhodiola is an adaptogen/energy supplement trap: screen for mania, stimulant stacking, and untreated depression.", "Fatigue plus supplement use still requires assessment for anemia, thyroid disease, pregnancy, heart/lung disease, infection, and depression."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid unless approved", note: "Safety is not well established for medicinal supplement use." },
        { type: "geriatric", label: "Older adult caution", note: "Insomnia, dizziness/falls, cardiac symptoms, and polypharmacy can make stimulant-like products riskier." }
      ],
      tags: ["rhodiola", "adaptogen", "fatigue", "stress", "stimulant", "insomnia", "mania", "anxiety"],
      sourceKeys: ["mskcc-rhodiola"]
    },
    {
      name: "SAMe",
      category: "Dietary supplement / methyl donor",
      aliases: ["S-adenosylmethionine", "ademetionine", "sam-e", "s adenosyl methionine"],
      usedFor: ["Marketed for depression, osteoarthritis pain, liver conditions, fibromyalgia, mood, and joint support"],
      nclexEssential: true,
      majorRisks: ["May trigger anxiety, insomnia, GI upset, headache, dizziness, sweating, or agitation", "Can trigger mania or hypomania in bipolar disorder", "Serotonin syndrome risk is a concern when combined with serotonergic antidepressants or other serotonin-raising agents", "May reduce levodopa effectiveness or worsen Parkinson symptoms in some contexts", "Pregnancy and breastfeeding safety is not established for routine supplement use"],
      interactions: ["SSRIs", "SNRIs", "MAOIs", "Tricyclic antidepressants", "Triptans", "Linezolid or other serotonergic drugs", "St. John's wort", "Levodopa", "Bipolar disorder medications"],
      contraindications: ["Bipolar disorder or mania/hypomania history unless prescriber directs", "Concurrent serotonergic antidepressants or MAOIs without prescriber/pharmacist review", "Parkinson disease on levodopa without neurology review", "Pregnancy or breastfeeding unless approved", "Suicidal ideation or severe depression without urgent mental-health care"],
      nursingAssessment: ["Ask about depression/joint/liver supplement use, bipolar history, mania symptoms, serotonin medications, Parkinson therapy, sleep, agitation, GI symptoms, pregnancy/lactation status, and suicidality", "Assess depression severity and whether the client is substituting SAMe for prescribed mental-health treatment"],
      teaching: ["Do not combine SAMe with antidepressants, MAOIs, St. John's wort, or triptans unless the prescriber approves", "Stop and seek care for mania, severe agitation, confusion, fever, tremor, diarrhea, muscle rigidity, suicidal thoughts, or worsening Parkinson symptoms", "Mood symptoms require follow-up; supplements are not emergency mental-health treatment"],
      nclexTraps: ["SAMe is a serotonin/mania trap, not a harmless mood vitamin.", "A client with bipolar disorder or antidepressants needs prescriber review before SAMe."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid routine supplement use unless obstetric/provider team approves." },
        { type: "geriatric", label: "Older adult caution", note: "Watch antidepressants, Parkinson medications, insomnia, falls from dizziness, and polypharmacy." }
      ],
      tags: ["same", "s-adenosylmethionine", "depression", "osteoarthritis", "serotonin syndrome", "mania", "bipolar", "levodopa"],
      sourceKeys: ["mayo-same"]
    },
    {
      name: "DHEA",
      category: "Hormone supplement",
      aliases: ["dehydroepiandrosterone", "prasterone", "DHEA supplement", "DHEA hormone"],
      usedFor: ["Marketed for aging, libido, fertility, adrenal support, menopause symptoms, muscle, mood, lupus, and general hormone balance"],
      nclexEssential: true,
      majorRisks: ["DHEA is a hormone precursor and can affect androgen/estrogen pathways", "May worsen hormone-sensitive cancers or conditions such as breast, ovarian, uterine, or prostate cancer", "Can cause acne, oily skin, hair growth, voice changes, menstrual changes, mood changes, aggression, insomnia, or lower HDL", "May worsen mania or psychiatric symptoms", "May affect liver, lipids, diabetes, and clotting risk depending client context"],
      interactions: ["Hormone therapy", "Testosterone or estrogen products", "Aromatase inhibitors or endocrine cancer therapy", "Psychiatric medications", "Insulin or diabetes medications with glucose monitoring", "Anticoagulants/antiplatelets with provider review", "Corticosteroid/adrenal regimens"],
      contraindications: ["Pregnancy or breastfeeding", "Hormone-sensitive cancer or high-risk cancer history without oncology approval", "Prostate disease without provider review", "Bipolar disorder/mania risk", "Unexplained vaginal bleeding", "Severe liver disease", "Do not use for anti-aging or adrenal claims without evaluation"],
      nursingAssessment: ["Ask specifically about hormone, anti-aging, bodybuilding, fertility, and adrenal supplements", "Assess cancer history, prostate/breast/uterine symptoms, pregnancy/lactation status, menstrual changes, acne/hirsutism, mood/mania, sleep, lipids, liver disease, diabetes, and endocrine medications", "Screen for supplement use before surgery or hormone-sensitive cancer treatment"],
      teaching: ["DHEA is not just a vitamin; it is hormone-active and should be reviewed with the provider/pharmacist", "Avoid use in pregnancy, breastfeeding, hormone-sensitive cancer, unexplained bleeding, or bipolar disorder unless a specialist directs", "Report chest pain, severe mood changes, abnormal bleeding, jaundice, new breast/prostate symptoms, severe acne/hair changes, or pregnancy"],
      nclexTraps: ["DHEA is a hormone-supplement trap: ask about cancer history, pregnancy, mood/mania, and endocrine therapy.", "Anti-aging marketing should not bypass evaluation of fatigue, libido change, infertility, adrenal disease, or depression."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation unsafe / avoid", note: "Avoid because hormone effects can be unsafe and safety is not established." },
        { type: "geriatric", label: "Older adult caution", note: "Higher baseline prostate/breast/uterine cancer risk, cardiovascular risk, diabetes, and polypharmacy." }
      ],
      tags: ["DHEA", "dehydroepiandrosterone", "hormone", "anti-aging", "libido", "breast cancer", "prostate cancer", "mania", "pregnancy"],
      sourceKeys: ["mayo-dhea"]
    },
    {
      name: "Arnica",
      category: "Topical/unsafe oral herbal product",
      aliases: ["arnica montana", "mountain tobacco", "leopard's bane", "wolf's bane", "arnica gel", "arnica cream", "homeopathic arnica"],
      usedFor: ["Marketed topically for bruises, sprains, muscle aches, swelling, arthritis pain, post-procedure bruising, and injury recovery"],
      nclexEssential: true,
      majorRisks: ["Concentrated oral arnica products are unsafe and can cause serious toxicity", "Oral toxicity can include vomiting, diarrhea, dizziness, tremor, fast or irregular heartbeat, shortness of breath, organ damage, coma, or death", "Topical arnica can cause rash, eczema, blistering, or allergic dermatitis, especially on broken skin or with prolonged use", "Bleeding interaction concerns matter around surgery or anticoagulants", "Pregnancy and breastfeeding safety are concerns, especially oral use"],
      interactions: ["Warfarin", "Heparin", "Aspirin", "Clopidogrel", "NSAIDs", "Anticoagulants/antiplatelets", "Other herbs that increase bleeding", "Procedure/anesthesia plans"],
      contraindications: ["Oral arnica unless it is a properly diluted homeopathic product reviewed by a clinician", "Pregnancy or breastfeeding", "Do not use on open wounds, broken skin, mucous membranes, or near eyes", "Ragweed/daisy family allergy", "Bleeding disorder or anticoagulant therapy without provider review", "Do not use to avoid evaluation of fracture, head injury, DVT, compartment syndrome, or serious trauma"],
      nursingAssessment: ["Ask route and product type: gel/cream, tincture, pills, tea, homeopathic dilution, or oral concentrated product", "Assess bruising cause, trauma severity, anticoagulant use, upcoming surgery, pregnancy/lactation status, allergy history, broken skin, rash, palpitations, GI symptoms, dyspnea, dizziness, or suspected ingestion toxicity"],
      teaching: ["Use topical arnica only on intact skin if approved; do not ingest concentrated arnica products", "Stop topical use for rash, blistering, worsening redness, or irritation", "Seek urgent help for oral ingestion of concentrated arnica, palpitations, fainting, shortness of breath, severe vomiting/diarrhea, confusion, or serious injury symptoms", "Do not use arnica to hide worsening pain, swelling, deformity, neurovascular changes, or head injury"],
      nclexTraps: ["Arnica is a route trap: topical intact-skin use is different from unsafe oral concentrated products.", "Bruising plus anticoagulants or trauma needs assessment; do not just recommend an herbal gel."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid", note: "Avoid oral use and use topical products only if obstetric/pediatric provider approves." },
        { type: "pediatric", label: "Child ingestion hazard", note: "Keep arnica products away from children; oral concentrated exposure can be toxic." },
        { type: "geriatric", label: "Older adult caution", note: "Higher anticoagulant use, fragile skin, falls, occult fracture, and head injury risk." }
      ],
      tags: ["arnica", "arnica montana", "topical", "oral toxicity", "bruising", "warfarin", "bleeding", "rash", "injury"],
      sourceKeys: ["mskcc-arnica"]
    },
    {
      name: "Activated charcoal",
      category: "Toxicology product / OTC supplement",
      aliases: ["charcoal", "activated carbon", "charcoal capsules", "charcoal tablets", "charcoal powder"],
      usedFor: ["Emergency department gastrointestinal decontamination for selected poisonings", "Marketed OTC for gas, bloating, detox, teeth whitening, hangover prevention, body odor, and general cleansing claims"],
      nclexEssential: true,
      majorRisks: ["Should not be used at home to treat poisoning because wrong timing or wrong exposure can delay lifesaving care", "Aspiration risk is serious, especially with drowsiness, seizure, vomiting, or unprotected airway", "Can bind many medications and reduce their absorption", "Not useful for all toxins and does not replace poison control or emergency care", "Constipation, vomiting, black stools, bowel obstruction risk, or dehydration can occur"],
      interactions: ["Many oral medications if taken close together", "Oral contraceptives", "Antiseizure medications", "Antidepressants", "Cardiac medications", "Antibiotics", "Vitamins/minerals", "Any overdose treatment plan that requires specific antidotes"],
      contraindications: ["Do not use for poisoning at home without poison control/EMS direction", "Unprotected airway, severe drowsiness, seizure risk, or active vomiting unless airway is protected and clinician directs", "GI bleeding, bowel obstruction, ileus, bowel perforation, or caustic/hydrocarbon ingestion without expert direction", "Do not use as detox treatment instead of emergency evaluation"],
      nursingAssessment: ["For suspected poisoning, assess exact substance, dose, time, route, symptoms, airway, breathing, circulation, mental status, pregnancy status, coingestants, and call poison control or emergency services per protocol", "For routine supplement use, ask timing relative to medications, constipation, bowel disease, black stools, vomiting, and whether the client is using it to avoid medical care"],
      teaching: ["Call Poison Control at 1-800-222-1222 or emergency services for suspected poisoning; do not guess or self-dose charcoal", "Separate routine OTC charcoal from medications only if the provider/pharmacist approves, because it can reduce medication absorption", "Seek care for overdose, breathing problems, severe vomiting, altered mental status, abdominal pain/distention, bowel obstruction symptoms, or black stools with weakness/dizziness"],
      nclexTraps: ["Activated charcoal is a poison-control tool for selected ingestions, not a home detox cure.", "Airway comes first; giving charcoal to a sleepy or vomiting client can cause aspiration.", "Some overdoses need antidotes, ECGs, serial drug levels, or observation even if charcoal was given."],
      populationRisks: [
        { type: "pediatric", label: "Child poisoning emergency", note: "Use poison control or emergency services; dosing and indications are exposure-specific." },
        { type: "pregnancy", label: "Pregnancy poisoning emergency", note: "Do not delay urgent toxicology guidance because maternal stabilization protects the fetus." },
        { type: "geriatric", label: "Older adult caution", note: "Polypharmacy, constipation, aspiration risk, and delayed presentation increase danger." }
      ],
      tags: ["activated charcoal", "poison control", "overdose", "aspiration", "detox claims", "medication absorption", "constipation"],
      sourceKeys: ["poisoncontrol-activated-charcoal"]
    },
    {
      name: "Creatine",
      category: "Sports nutrition supplement",
      aliases: ["creatine monohydrate", "creatine powder", "creatine supplement", "creatine ethyl ester"],
      usedFor: ["Marketed for strength, power, sprint performance, muscle mass, recovery, aging muscle, cognition, and bodybuilding"],
      nclexEssential: true,
      majorRisks: ["Can cause weight gain from water retention, GI upset, cramping, diarrhea, nausea, or muscle symptoms in some users", "Kidney disease, dehydration, heat illness risk, rhabdomyolysis symptoms, or nephrotoxic medication use needs caution", "Creatine can raise measured creatinine or confuse kidney assessment without necessarily proving kidney injury", "Products marketed for bodybuilding may be adulterated with stimulants, anabolic agents, SARMs, or other undeclared drugs", "Pregnancy, breastfeeding, and pediatric use require clinician review"],
      interactions: ["Nephrotoxic medications such as NSAIDs, aminoglycosides, amphotericin, cisplatin, calcineurin inhibitors, or high-dose diuretics", "Caffeine/stimulant-heavy pre-workouts", "Other bodybuilding supplements", "Lithium or medications needing renal monitoring with provider review"],
      contraindications: ["Known kidney disease or unexplained reduced eGFR without provider approval", "Active dehydration, heat illness, rhabdomyolysis concern, severe vomiting/diarrhea, or dark urine", "Pregnancy or breastfeeding unless approved", "Do not use in children/adolescents for performance without pediatric/sports medicine guidance", "Do not use contaminated/high-risk bodybuilding products"],
      nursingAssessment: ["Ask about dose, loading phases, total pre-workout ingredients, caffeine/stimulants, exercise intensity, hydration, heat exposure, kidney history, nephrotoxic meds, muscle pain/weakness, dark urine, weight change, and sports drug-testing requirements", "Review creatinine/eGFR, CK if rhabdomyolysis symptoms are present, electrolytes, urine output, and supplement brand quality when clinically relevant"],
      teaching: ["Use only if the clinician/pharmacist agrees it fits kidney status and medication profile", "Avoid stacking multiple pre-workout or bodybuilding products with unknown ingredients", "Stop and seek care for dark cola urine, severe muscle pain/weakness, heat illness, chest pain, palpitations, dehydration, reduced urine, or swelling", "Tell clinicians about creatine before kidney labs are interpreted"],
      nclexTraps: ["Creatine is not the same thing as creatinine; supplementation can complicate kidney-lab interpretation.", "Bodybuilding products are a contamination/adulteration trap, especially for athletes and clients with cardiac, psychiatric, or renal risk.", "Dark urine after intense exercise is rhabdomyolysis until evaluated, not routine supplement soreness."],
      populationRisks: [
        { type: "pediatric", label: "Teen athlete caution", note: "Avoid unsupervised performance supplementation; assess body image, stimulant stacking, hydration, and sports rules." },
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid routine performance supplementation unless obstetric/pediatric provider approves." },
        { type: "geriatric", label: "Older adult caution", note: "Kidney reserve, diuretics, NSAID use, dehydration, and falls/heat illness risk matter." }
      ],
      tags: ["creatine", "sports supplement", "kidney", "creatinine", "rhabdomyolysis", "pre-workout", "bodybuilding", "dehydration"],
      sourceKeys: ["nih-ods-exercise-performance-supplements"]
    },
    {
      name: "Slippery elm",
      category: "Herbal demulcent / mucilage supplement",
      aliases: ["ulmus rubra", "red elm", "Indian elm", "slippery elm bark", "gray elm"],
      usedFor: ["Marketed for sore throat, cough, reflux, gastritis, diarrhea, constipation, irritable bowel syndrome, skin sores, inflammation, and alternative cancer formulas"],
      nclexEssential: true,
      majorRisks: ["Evidence is limited for most claimed uses and it should not replace evaluation of infection, GI bleeding, cancer, inflammatory bowel disease, or airway symptoms", "Mucilage/fiber can reduce absorption of oral medications if taken close together", "Can cause nausea, bloating, diarrhea, constipation, or allergic reaction", "Quality and concentration vary by product", "Pregnancy and breastfeeding safety for medicinal doses is not well established"],
      interactions: ["Oral medications taken at the same time", "Levothyroxine", "Digoxin", "Antibiotics", "Iron or mineral supplements", "Diabetes medications if GI intake changes", "Other bulk-forming laxatives or fiber products"],
      contraindications: ["Do not use instead of urgent evaluation for trouble breathing, drooling, severe sore throat with fever, GI bleeding, persistent vomiting, severe abdominal pain, dysphagia, weight loss, or suspected cancer", "Pregnancy or breastfeeding unless approved", "Bowel obstruction, severe constipation with vomiting, or swallowing difficulty without clinician review", "Known allergy to elm products"],
      nursingAssessment: ["Ask product form, dose, timing with medications, reason for use, pregnancy/lactation status, swallowing symptoms, fever, cough duration, stool changes, GI bleeding, abdominal pain, weight loss, and cancer-treatment substitution", "Check whether the client is taking it near narrow-therapeutic-index medicines or time-sensitive drugs"],
      teaching: ["Separate slippery elm from medications only according to pharmacist/provider guidance because it may reduce absorption", "Do not use it as an alternative cancer treatment or to delay evaluation of red-flag GI, throat, or respiratory symptoms", "Stop and report rash, wheeze, swelling, severe constipation, persistent diarrhea, GI bleeding, or worsening symptoms"],
      nclexTraps: ["Slippery elm's soothing mucilage can also interfere with medication absorption.", "A sore throat with airway symptoms or a GI complaint with bleeding/weight loss is not a supplement problem.", "Essiac or alternative cancer formulas should never replace oncology care."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid medicinal use unless obstetric/pediatric provider approves." },
        { type: "pediatric", label: "Child airway/GI caution", note: "Do not use to delay evaluation of breathing trouble, dehydration, fever, or blood in stool." },
        { type: "geriatric", label: "Older adult caution", note: "Polypharmacy and dysphagia/constipation risk make absorption and obstruction concerns more important." }
      ],
      tags: ["slippery elm", "ulmus rubra", "mucilage", "sore throat", "IBS", "medication absorption", "Essiac", "cancer claims"],
      sourceKeys: ["mskcc-slippery-elm"]
    },
    {
      name: "Bee pollen",
      category: "Bee product / dietary supplement",
      aliases: ["bee bread", "pollen granules", "bee pollen capsules", "flower pollen supplement", "ambrosia"],
      usedFor: ["Marketed for allergies, energy, immunity, menopause symptoms, prostate symptoms, fertility, weight loss, athletic performance, liver health, and general wellness"],
      nclexEssential: true,
      majorRisks: ["Can trigger serious allergic reactions including wheezing, hives, angioedema, or anaphylaxis, especially in clients with pollen, bee, or atopy history", "Pregnancy and breastfeeding safety is a concern and many references recommend avoidance", "Evidence for allergy desensitization, weight loss, diabetes, or performance claims is limited", "Products vary by plant source and may be contaminated or adulterated", "Rare liver or kidney injury reports and GI upset have been described"],
      interactions: ["Warfarin or anticoagulants/antiplatelets with provider review", "Allergy medications or immunotherapy plans", "Diabetes medications if diet/supplement patterns change", "Other bee products such as propolis or royal jelly", "Weight-loss products that may contain hidden stimulants or drugs"],
      contraindications: ["Pollen allergy, bee-sting allergy, prior anaphylaxis, severe asthma, or mast-cell disorder without allergist approval", "Pregnancy or breastfeeding", "Use as a substitute for prescribed epinephrine, inhalers, antihistamines, immunotherapy, diabetes care, or weight management plan", "Unexplained jaundice, dark urine, kidney injury, or severe allergic symptoms"],
      nursingAssessment: ["Ask about seasonal allergies, asthma control, prior anaphylaxis, bee sting reaction, epinephrine autoinjector access, pregnancy/lactation, anticoagulants, weight-loss product use, liver/kidney symptoms, and exact brand/source", "Assess whether the client is using bee pollen to self-desensitize allergies without allergist guidance"],
      teaching: ["Avoid bee pollen if you have pollen/bee allergy, severe asthma, prior anaphylaxis, pregnancy, or breastfeeding unless a specialist specifically approves", "Seek emergency help for wheeze, throat tightness, swelling, hives, vomiting with dizziness, or trouble breathing", "Do not use bee pollen weight-loss products with hidden-ingredient risk or as a replacement for prescribed allergy treatment"],
      nclexTraps: ["Bee pollen is an anaphylaxis trap, not harmless local-allergy treatment.", "A client with asthma and pollen allergy should not self-challenge with bee pollen.", "Natural weight-loss products may be adulterated; ask exactly what product is being used."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid", note: "Avoid because safety is uncertain and allergy risk can be serious." },
        { type: "pediatric", label: "Child allergy caution", note: "Do not use for allergy desensitization without pediatric allergy guidance." },
        { type: "geriatric", label: "Older adult caution", note: "Anticoagulant use, asthma/COPD, and polypharmacy increase risk." }
      ],
      tags: ["bee pollen", "bee bread", "pollen allergy", "anaphylaxis", "asthma", "pregnancy", "warfarin", "weight loss claims"],
      sourceKeys: ["fda-tainted-bee-pollen-products"]
    },
    {
      name: "Chlorella",
      category: "Algae dietary supplement",
      aliases: ["chlorella vulgaris", "chlorella pyrenoidosa", "green algae supplement", "chlorella tablets", "chlorella powder"],
      usedFor: ["Marketed for detox, immune support, cholesterol, blood pressure, blood sugar, energy, anemia, fibromyalgia, liver health, pregnancy nutrition, and general wellness"],
      nclexEssential: true,
      majorRisks: ["Evidence for many health claims is limited and products can vary in nutrient and contaminant content", "Can cause GI upset, green stools, nausea, gas, diarrhea, photosensitivity, rash, or allergic reaction", "May contain vitamin K and can interfere with warfarin/INR stability", "Immune-stimulating claims are concerning in autoimmune disease, transplant, immunosuppression, or biologic therapy", "Iodine or heavy-metal contamination concerns vary by product and source"],
      interactions: ["Warfarin", "Anticoagulants/antiplatelets with provider review", "Immunosuppressants", "Biologics or transplant medications", "Thyroid medications or iodine-sensitive conditions", "Diabetes and antihypertensive medications with monitoring if intake changes"],
      contraindications: ["Warfarin therapy or unstable INR unless anticoagulation team approves", "Transplant recipient or significant immunosuppression without specialist review", "Autoimmune disease flare risk without clinician review", "Pregnancy or breastfeeding unless approved", "Known algae/iodine sensitivity or product contamination concern", "Do not use for detox instead of poisoning, liver, kidney, or occupational exposure evaluation"],
      nursingAssessment: ["Ask about algae/greens powders, dose, brand testing, reason for use, warfarin/INR history, transplant or autoimmune disease, thyroid disease, pregnancy/lactation, GI symptoms, rash/photosensitivity, liver/kidney disease, diabetes/BP meds, and detox claims", "Assess whether the client is replacing prescribed lipid, diabetes, BP, thyroid, or immune therapy with chlorella"],
      teaching: ["Tell the anticoagulation clinic before starting or stopping chlorella because vitamin K content may affect INR", "Choose third-party tested products if use is approved and avoid products making detox/cure claims", "Stop and report rash, wheeze, swelling, severe GI symptoms, jaundice, dark urine, bruising/bleeding, thyroid symptoms, or autoimmune flare", "Do not use chlorella to treat poisoning or heavy-metal exposure without medical evaluation"],
      nclexTraps: ["Chlorella is a warfarin/vitamin K trap.", "Detox marketing should trigger assessment for poisoning, liver disease, kidney disease, occupational exposure, or delayed care.", "Immune support is not automatically safe in autoimmune disease or transplant clients."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Use only if obstetric/pediatric provider approves product quality and indication." },
        { type: "geriatric", label: "Older adult caution", note: "Warfarin, thyroid disease, autoimmune disease, kidney disease, and polypharmacy are common." },
        { type: "pediatric", label: "Child product-quality caution", note: "Avoid detox or immune claims and use only with pediatric guidance." }
      ],
      tags: ["chlorella", "algae", "greens powder", "warfarin", "vitamin K", "immune support", "detox claims", "iodine", "contamination"],
      sourceKeys: ["supplement-quality-general", "warfarin-vitamin-k-safety"]
    },
    {
      name: "Psyllium",
      category: "Soluble fiber / bulk-forming laxative",
      aliases: ["psyllium husk", "ispaghula", "Plantago ovata", "blond psyllium", "fiber supplement", "bulk forming fiber"],
      usedFor: ["Constipation", "Stool regulation in some diarrhea or IBS patterns", "Adjunct LDL-cholesterol reduction when used with a heart-healthy diet", "Blood sugar or satiety support claims"],
      nclexEssential: true,
      majorRisks: ["Choking, esophageal obstruction, or bowel obstruction if taken dry or without enough water", "Gas, bloating, abdominal cramping, constipation, diarrhea, or nausea", "Can reduce absorption of oral medications if taken too close together", "Allergic reactions can occur, especially with occupational exposure to psyllium powder", "Lead or contaminant concerns vary by product quality"],
      interactions: ["Oral medications taken near the same time", "Levothyroxine", "Digoxin", "Lithium", "Carbamazepine", "Iron or mineral supplements", "Diabetes medications if glucose intake/absorption changes", "Other laxatives or fiber products"],
      contraindications: ["Swallowing difficulty, esophageal stricture, bowel obstruction, fecal impaction, severe constipation with vomiting, or undiagnosed abdominal pain unless clinician approves", "Known psyllium allergy", "Do not use as the only response to GI bleeding, weight loss, severe abdominal pain, or persistent change in bowel habits"],
      nursingAssessment: ["Ask amount, powder/capsule form, fluid intake, timing with medications, bowel pattern, abdominal pain, vomiting, dysphagia, diabetes medications, lithium/digoxin/thyroid therapy, and whether symptoms suggest obstruction or GI bleeding", "Assess hydration, older adult swallowing risk, opioid or anticholinergic constipation, and whether the client is stacking multiple laxatives"],
      teaching: ["Take psyllium with a full glass of water and maintain adequate fluids through the day", "Separate from other medications according to pharmacist/provider guidance because absorption can be reduced", "Start low and increase gradually if approved to reduce bloating", "Seek urgent care for choking, trouble swallowing, chest pain after swallowing, severe abdominal pain, vomiting, no stool/gas, rectal bleeding, or black stools"],
      nclexTraps: ["Psyllium needs water; dry powder or inadequate fluids can obstruct the throat or bowel.", "Fiber can interfere with medication absorption, so timing matters.", "New bowel changes with bleeding or weight loss need evaluation, not just more fiber."],
      populationRisks: [
        { type: "geriatric", label: "Older adult caution", note: "Dysphagia, low fluid intake, polypharmacy, constipation, and obstruction risk are common." },
        { type: "pediatric", label: "Child use only with guidance", note: "Use pediatric dosing and evaluate constipation red flags before routine supplementation." },
        { type: "pregnancy", label: "Pregnancy constipation context", note: "Often considered a nonstimulant fiber option when approved, but hydration and obstetric guidance still matter." }
      ],
      tags: ["psyllium", "fiber", "constipation", "LDL", "bulk-forming laxative", "water", "medication absorption", "obstruction"],
      sourceKeys: ["ecfr-psyllium-fiber-health-claim", "fiber-safety-general"]
    },
    {
      name: "Spirulina",
      category: "Blue-green algae dietary supplement",
      aliases: ["blue-green algae", "Arthrospira", "Limnospira", "spirulina powder", "spirulina tablets", "algae supplement"],
      usedFor: ["Marketed for protein/nutrition support, cholesterol, blood pressure, glucose control, inflammation, allergies, anemia, immune support, energy, weight loss, and detox claims"],
      nclexEssential: true,
      majorRisks: ["Product contamination with microcystins, heavy metals, or other algae toxins is the major safety concern", "Can cause nausea, diarrhea, bloating, headache, rash, sweating, allergic reaction, or rarely anaphylaxis", "May affect immune activity, which is concerning in autoimmune disease, transplant, or immunosuppressant therapy", "Contains phenylalanine and is unsafe for clients with phenylketonuria", "May affect bleeding or glucose in susceptible clients based on product composition and clinical context"],
      interactions: ["Warfarin or anticoagulants/antiplatelets with provider review", "Immunosuppressants", "Biologics and transplant medications", "Diabetes medications", "Other greens powders or algae products", "Products marketed for detox or weight loss that may include hidden ingredients"],
      contraindications: ["Phenylketonuria", "Autoimmune disease, transplant status, or significant immunosuppression without specialist approval", "Pregnancy or breastfeeding unless a clinician approves a tested product", "Known algae allergy or prior reaction", "Do not use wild-harvested or untested products"],
      nursingAssessment: ["Ask exact brand, third-party testing, dose, reason for use, pregnancy/lactation, autoimmune/transplant history, anticoagulants, diabetes medications, PKU, allergies/asthma, liver symptoms, GI symptoms, rash, and detox/weight-loss claims", "Assess whether the client is substituting spirulina for protein, iron, B12, diabetes, lipid, BP, or immune therapy"],
      teaching: ["Choose only clinician-approved, third-party tested products if used at all; avoid wild-harvested algae products", "Do not rely on spirulina as a dependable vitamin B12 source", "Tell the provider before use if taking blood thinners, diabetes medications, or immune-modifying therapy", "Stop and seek care for hives, wheeze, swelling, jaundice, severe GI symptoms, dark urine, unusual bleeding, or neurologic symptoms"],
      nclexTraps: ["Spirulina is a contamination-quality trap more than a simple vitamin.", "PKU matters because spirulina contains phenylalanine.", "Immune support claims can be risky in autoimmune disease or transplant clients."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid routine use unless the obstetric or pediatric clinician approves a tested product." },
        { type: "pediatric", label: "Child contamination caution", note: "Avoid untested algae products; children are more vulnerable to toxin exposure." },
        { type: "geriatric", label: "Older adult caution", note: "Warfarin, diabetes therapy, autoimmune disease, kidney/liver disease, and polypharmacy increase risk." }
      ],
      tags: ["spirulina", "blue-green algae", "microcystin", "heavy metals", "PKU", "phenylalanine", "warfarin", "immune", "contamination"],
      sourceKeys: ["medlineplus-blue-green-algae", "supplement-quality-general"]
    },
    {
      name: "Moringa",
      category: "Botanical supplement / food plant",
      aliases: ["Moringa oleifera", "horseradish tree", "drumstick tree", "ben oil tree", "moringa leaf powder", "moringa capsules"],
      usedFor: ["Marketed for diabetes, cholesterol, inflammation, infections, nutrition support, lactation, blood pressure, weight loss, and immune support"],
      nclexEssential: true,
      majorRisks: ["Human evidence for most supplement claims is limited and products vary by plant part and concentration", "May lower blood glucose or affect metabolic medication response", "Pregnancy and breastfeeding supplement safety is uncertain; root, bark, or concentrated extracts are especially concerning", "Allergic or severe skin reactions have been reported rarely", "Possible CYP3A4 or drug metabolism interactions are based mainly on preclinical data"],
      interactions: ["Diabetes medications", "Antihypertensives", "Sitagliptin with provider review", "CYP3A4 substrate medications with provider/pharmacist review", "Warfarin or anticoagulants with general supplement review", "Other glucose-lowering herbs"],
      contraindications: ["Pregnancy or breastfeeding unless obstetric/pediatric clinician approves", "Hypoglycemia risk or diabetes medication changes without monitoring", "Do not use root, bark, or concentrated unknown extracts", "Prior severe rash, anaphylaxis, or allergy to moringa", "Do not use instead of infection, diabetes, cholesterol, cancer, or hypertension care"],
      nursingAssessment: ["Ask plant part and form, dose, pregnancy/lactation, diabetes medications, glucose logs, BP medications, rash/allergy history, liver/kidney disease, planned surgery, and whether moringa is being used to replace prescribed care", "Assess hypoglycemia symptoms, dizziness, skin blistering, swelling, GI symptoms, and product source"],
      teaching: ["Food use of moringa leaves differs from concentrated supplements", "Monitor glucose closely if a clinician approves use with diabetes therapy", "Avoid in pregnancy or breastfeeding unless specifically approved", "Stop and seek care for hypoglycemia, severe rash/blisters, swelling, wheeze, jaundice, or dizziness/syncope"],
      nclexTraps: ["Moringa food use is not the same as concentrated supplement use.", "Diabetes clients need glucose monitoring; a natural product can still contribute to hypoglycemia.", "Pregnancy safety is not assumed just because a plant is edible."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation avoid unless approved", note: "MSK advises pregnant and breastfeeding clients to avoid moringa supplements because safety is uncertain." },
        { type: "pediatric", label: "Child supplement caution", note: "Use food forms and supplements only with pediatric guidance." },
        { type: "geriatric", label: "Older adult caution", note: "Diabetes, BP medications, polypharmacy, and fall risk make glucose/BP effects important." }
      ],
      tags: ["moringa", "Moringa oleifera", "diabetes", "glucose", "pregnancy", "breastfeeding", "CYP3A4", "rash", "supplement"],
      sourceKeys: ["mskcc-moringa"]
    },
    {
      name: "Resveratrol",
      category: "Polyphenol supplement",
      aliases: ["3,5,4'-trihydroxystilbene", "grape skin extract", "red wine extract", "resveratrol capsules", "trans-resveratrol"],
      usedFor: ["Marketed for heart health, diabetes, memory, anti-aging, inflammation, joint pain, menopause symptoms, fatty liver, and cancer prevention claims"],
      nclexEssential: true,
      majorRisks: ["High doses can cause nausea, gas, abdominal pain, diarrhea, or GI upset", "May increase bleeding risk, especially with anticoagulants or antiplatelets", "Evidence for cardiovascular, diabetes, memory, anti-aging, and cancer-prevention claims is mixed or insufficient for routine treatment use", "Hormone-sensitive conditions and pregnancy/lactation need clinician review", "Supplement dose and purity vary"],
      interactions: ["Warfarin", "Heparin", "Aspirin", "Clopidogrel", "NSAIDs", "Other anticoagulants/antiplatelets", "Herbs that increase bleeding risk", "Diabetes medications with monitoring", "Perioperative/anesthesia plan"],
      contraindications: ["Bleeding disorder, anticoagulant therapy, thrombocytopenia, or upcoming surgery without provider approval", "Pregnancy or breastfeeding unless clinician approves", "Do not use instead of cardiology, diabetes, dementia, cancer, or arthritis care", "Severe GI intolerance or prior allergic reaction"],
      nursingAssessment: ["Ask about dose, brand, red wine/grape extract products, anticoagulants/antiplatelets, NSAID use, bruising/bleeding, surgery/procedure plans, diabetes medications, pregnancy/lactation, hormone-sensitive cancer history, and GI symptoms", "Assess whether the client is using resveratrol as anti-aging or cancer-prevention treatment in place of standard care"],
      teaching: ["Food sources are different from high-dose supplements", "Tell prescribers before procedures or if taking blood thinners", "Stop and report unusual bruising, black stools, nosebleeds, heavy bleeding, severe abdominal pain, persistent diarrhea, rash, or dizziness", "Do not use resveratrol to replace prescribed heart, diabetes, memory, or cancer treatment"],
      nclexTraps: ["Resveratrol is a bleeding-risk trap with warfarin, antiplatelets, NSAIDs, and surgery.", "Red wine compounds do not make alcohol a safe health intervention.", "Anti-aging or cancer-prevention claims should not displace evidence-based care."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid supplement dosing unless obstetric/pediatric provider approves." },
        { type: "geriatric", label: "Older adult caution", note: "Anticoagulant, antiplatelet, NSAID, cancer, diabetes, and fall/bleeding risks are more common." },
        { type: "pediatric", label: "Child avoid unless directed", note: "No routine pediatric supplement role without clinician guidance." }
      ],
      tags: ["resveratrol", "grape skin", "red wine extract", "bleeding", "warfarin", "anti-aging", "diabetes", "memory", "cancer claims"],
      sourceKeys: ["mskcc-resveratrol"]
    },
    {
      name: "Apple cider vinegar",
      category: "Fermented vinegar / folk remedy supplement",
      aliases: ["ACV", "cider vinegar", "apple vinegar", "apple cider vinegar gummies", "apple cider vinegar tablets"],
      usedFor: ["Marketed for weight loss, glucose control, cholesterol, heart health, digestion, skin conditions, hair care, antimicrobial claims, and alternative cancer claims"],
      nclexEssential: true,
      majorRisks: ["Topical use can cause chemical burns and scarring", "Undiluted or tablet forms can injure the esophagus or worsen reflux", "Excessive intake has been linked to low potassium and bone effects", "Unpasteurized products may carry infection risk", "Evidence for weight loss, diabetes, cholesterol, and cancer claims is not strong enough to replace standard care"],
      interactions: ["Diabetes medications or insulin with glucose monitoring", "Diuretics that affect potassium", "Digoxin when hypokalemia risk exists", "Laxatives that lower potassium", "Antihypertensives with electrolyte/BP monitoring", "Other weight-loss supplements"],
      contraindications: ["Do not apply to skin lesions, moles, burns, infections, or the eyes/ears as home treatment", "Gastroparesis, severe reflux, dysphagia, esophageal disease, hypokalemia, eating disorder, or kidney disease without clinician review", "Pregnancy or breastfeeding supplement use unless approved", "Do not use as cancer, infection, diabetes, or weight-loss treatment instead of medical care"],
      nursingAssessment: ["Ask form, amount, dilution, tablet/gummy use, topical use, duration, diabetes medications, diuretics, digoxin, laxatives, potassium history, reflux/dysphagia, gastroparesis, pregnancy/lactation, burns, and whether ACV is being used for cancer or skin lesions", "Assess tooth/enamel symptoms, throat/chest pain after ingestion, abdominal pain, vomiting, weakness, palpitations, muscle cramps, and skin burns"],
      teaching: ["Do not use apple cider vinegar on suspicious skin lesions or as a cancer treatment", "Avoid tablets or undiluted ingestion if there is swallowing, reflux, or esophageal risk; discuss any routine use with the clinician/pharmacist", "Seek care for burns, scarring, throat/chest pain, trouble swallowing, vomiting blood, severe abdominal pain, weakness, palpitations, or hypokalemia symptoms", "Clients with diabetes should monitor glucose and not substitute ACV for prescribed therapy"],
      nclexTraps: ["ACV on a mole or skin cancer claim is a harm trap, not a harmless home remedy.", "Low potassium can make digoxin and dysrhythmia risk worse.", "Weight-loss gummies/tablets are not equivalent to food vinegar and may injure the esophagus or vary in dose."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid unpasteurized products and supplement dosing unless obstetric/pediatric provider approves." },
        { type: "pediatric", label: "Child burn/ingestion caution", note: "Do not use ACV topically for fever, lice, warts, molluscum, or skin lesions; burns have been reported." },
        { type: "geriatric", label: "Older adult caution", note: "Diuretics, digoxin, dysphagia, reflux, diabetes therapy, and frail skin increase risk." }
      ],
      tags: ["apple cider vinegar", "ACV", "chemical burn", "hypokalemia", "digoxin", "diabetes", "weight loss", "esophageal injury", "cancer claims"],
      sourceKeys: ["mskcc-apple-cider-vinegar"]
    },
    {
      name: "N-acetylcysteine",
      category: "Amino-acid derivative / antioxidant supplement",
      aliases: ["NAC", "acetylcysteine", "N-acetyl-L-cysteine", "N acetylcysteine", "N-acetyl cysteine", "glutathione precursor"],
      usedFor: ["Prescription acetylcysteine is used for acetaminophen poisoning and as a mucolytic in selected respiratory care.", "Supplement NAC is marketed for liver support, immune support, chronic lung disease, fertility/PCOS, mood, compulsive behaviors, antioxidant support, and general detox claims."],
      nclexEssential: true,
      majorRisks: ["GI upset, diarrhea, nausea, vomiting, fatigue, eye irritation, and rash can occur", "Less common but serious reactions include low blood pressure, anaphylactoid/anaphylactic-type reactions, bronchospasm or asthma attack, and severe headache", "Using supplement NAC for suspected acetaminophen overdose can delay emergency antidote care", "High-dose antioxidant use during chemotherapy or radiation needs oncology review because antioxidants can theoretically reduce treatment effect"],
      interactions: ["Nitroglycerin and nitrates can have additive blood-pressure lowering and severe headache risk", "Cancer chemotherapy or radiation therapy when antioxidant avoidance is part of the oncology plan", "Asthma or reactive airway disease medications require caution if bronchospasm occurs", "Other supplements marketed for detox, liver support, or antioxidant megadosing"],
      contraindications: ["Suspected acetaminophen overdose or liver toxicity is an emergency, not a supplement self-treatment situation", "Nitroglycerin use without prescriber/pharmacist review", "Active asthma/bronchospasm history without clinician guidance", "Pregnancy or breastfeeding unless the clinician specifically approves", "Current cancer treatment unless the oncology team approves antioxidant supplements"],
      nursingAssessment: ["Ask exact product, dose, route, reason for use, acetaminophen exposure timing/amount, liver disease symptoms, asthma/COPD history, nitroglycerin use, cancer therapy, pregnancy/lactation, GI symptoms, rash, dizziness, headache, wheezing, and all other supplements", "Assess whether the client is using NAC instead of poison control, emergency care, prescribed inhaled therapy, mental-health treatment, fertility evaluation, or liver workup"],
      teaching: ["Call poison control or seek emergency care for possible acetaminophen overdose; do not try to treat overdose with store-bought NAC.", "Tell prescribers before using NAC with nitroglycerin, asthma history, liver disease, pregnancy/lactation, or cancer therapy.", "Stop and seek care for wheezing, throat swelling, fainting, severe headache with low blood pressure symptoms, rash/hives, jaundice, dark urine, or persistent vomiting.", "Do not treat NAC as a universal detox product; supplement quality and dose vary."],
      nclexTraps: ["NAC is the real antidote for acetaminophen toxicity, but overdose management requires urgent medical dosing and labs.", "Nitroglycerin plus NAC can become a hypotension/headache safety issue.", "An antioxidant supplement is not automatically safe during cancer treatment."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Use only with clinician guidance; emergency acetaminophen toxicity care is different from supplement use." },
        { type: "pediatric", label: "Child poison-control priority", note: "Suspected acetaminophen exposure in a child needs poison control or emergency guidance, not home supplement dosing." },
        { type: "geriatric", label: "Older adult caution", note: "Nitroglycerin use, COPD/asthma, liver disease, cancer therapy, and polypharmacy increase risk." }
      ],
      tags: ["N-acetylcysteine", "NAC", "acetylcysteine", "acetaminophen overdose", "glutathione", "nitroglycerin", "hypotension", "bronchospasm", "antioxidant", "cancer therapy"],
      sourceKeys: ["mskcc-n-acetylcysteine", "medlineplus-acetylcysteine"]
    },
    {
      name: "Alpha-lipoic acid",
      category: "Antioxidant supplement",
      aliases: ["ALA", "alpha lipoic acid", "lipoic acid", "thioctic acid", "lipoate", "R-lipoic acid", "R-ALA"],
      usedFor: ["Marketed for diabetic nerve pain, glucose control, liver support, weight loss, inflammation, antioxidant support, multiple sclerosis symptoms, memory, and general metabolic health"],
      nclexEssential: true,
      majorRisks: ["Can lower blood glucose and contribute to hypoglycemia, especially with diabetes medications", "GI effects such as nausea, vomiting, reflux, dyspepsia, or abdominal discomfort can occur", "Rare insulin autoimmune syndrome or autoimmune hypoglycemia has been reported in genetically susceptible people", "High-dose antioxidant use may conflict with chemotherapy or radiation therapy goals", "Supplement forms and doses vary, and R-ALA products may have stronger biologic effect than mixed products"],
      interactions: ["Insulin", "Sulfonylureas and other diabetes medications", "Other glucose-lowering supplements such as berberine, bitter melon, cinnamon, or gymnema", "Chemotherapy or radiation therapy when the oncology team limits antioxidants", "Alcohol use disorder or malnutrition contexts where thiamine status should be reviewed"],
      contraindications: ["Recurrent hypoglycemia or brittle diabetes without clinician monitoring", "Current cancer therapy unless approved by oncology", "Pregnancy or breastfeeding unless specifically approved", "Known prior severe reaction or suspected insulin autoimmune syndrome", "Do not use instead of diabetes, neuropathy, liver, or neurologic care"],
      nursingAssessment: ["Ask exact product and dose, diabetes medications, glucose logs, hypoglycemia symptoms, neuropathy symptoms, alcohol use, nutritional status, liver/kidney disease, cancer therapy, pregnancy/lactation, GI symptoms, and other antioxidant or glucose-lowering supplements", "Assess whether the client is substituting alpha-lipoic acid for prescribed diabetes control, neuropathy assessment, foot care, or liver evaluation"],
      teaching: ["Clients taking diabetes medications should monitor glucose closely and report sweating, tremor, confusion, weakness, palpitations, or fainting.", "Tell oncology clinicians before using antioxidant supplements during chemotherapy or radiation.", "Food sources are different from concentrated capsules.", "Stop and seek care for severe hypoglycemia symptoms, persistent vomiting, rash, jaundice, or neurologic change."],
      nclexTraps: ["Alpha-lipoic acid is not just a vitamin-style antioxidant; glucose safety is the nursing priority.", "A neuropathy supplement does not replace foot checks, A1c/glucose management, or evaluation for B12 deficiency and other causes.", "Antioxidant claims can be a problem during some cancer treatments."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid supplement dosing unless the obstetric or pediatric clinician approves." },
        { type: "pediatric", label: "Child avoid unless directed", note: "No routine pediatric supplement role without clinician guidance." },
        { type: "geriatric", label: "Older adult caution", note: "Diabetes medications, renal disease, neuropathy, malnutrition, cancer therapy, and polypharmacy increase risk." }
      ],
      tags: ["alpha-lipoic acid", "ALA", "lipoic acid", "diabetes", "neuropathy", "hypoglycemia", "insulin", "antioxidant", "cancer therapy", "supplement"],
      sourceKeys: ["mskcc-alpha-lipoic-acid"]
    },
    {
      name: "Bromelain",
      category: "Proteolytic enzyme supplement",
      aliases: ["pineapple enzyme", "pineapple stem extract", "Ananas comosus", "bromelain tablets", "bromelain capsules"],
      usedFor: ["Marketed for arthritis, inflammation, swelling, sinus symptoms, digestion, circulation, postoperative swelling, bruising, burn debridement support, and cancer-prevention claims"],
      nclexEssential: true,
      majorRisks: ["Allergic reactions can occur, especially in pineapple/latex/related plant allergy patterns", "May increase bruising or bleeding risk based on fibrinolytic and antiplatelet-type concerns", "GI upset, diarrhea, nausea, and mouth/throat irritation can occur", "Can increase absorption or blood/urine levels of some antibiotics, especially tetracycline-class concerns", "Human evidence for arthritis, circulation, and cancer claims is limited or mixed"],
      interactions: ["Warfarin and other anticoagulants", "Aspirin, clopidogrel, NSAIDs, and other antiplatelet/bleeding-risk drugs", "Tetracycline antibiotics and possibly other antibiotics because absorption may increase", "Perioperative anesthesia/surgery plan", "Other bleeding-risk supplements such as garlic, ginkgo, fish oil, turmeric, or high-dose vitamin E"],
      contraindications: ["Bleeding disorder, thrombocytopenia, anticoagulant therapy, or upcoming surgery/procedure unless the clinician approves", "Pineapple, bromelain, latex, or related allergy history", "Pregnancy or breastfeeding unless specifically approved", "Active ulcer/GI bleeding or severe GI intolerance", "Do not use instead of wound, burn, cancer, arthritis, or vascular care"],
      nursingAssessment: ["Ask product dose, pineapple/latex allergy, anticoagulants/antiplatelets/NSAIDs, bruising, nosebleeds, black stools, planned surgery/dental work, antibiotic use, pregnancy/lactation, asthma/allergy history, GI symptoms, and whether bromelain is being used for cancer or circulation claims", "Assess burn/wound use carefully because medical debridement products are not the same as over-the-counter supplements."],
      teaching: ["Tell the surgeon, dentist, prescriber, and pharmacist before procedures or if taking blood thinners.", "Stop and seek care for hives, wheeze, swelling, unusual bleeding, black stools, vomiting blood, severe abdominal pain, or severe diarrhea.", "Do not combine multiple bleeding-risk supplements casually.", "Pineapple in food is different from concentrated bromelain dosing."],
      nclexTraps: ["Bromelain sounds like a digestion supplement, but the classic safety traps are bleeding and antibiotic absorption.", "A burn debridement product used clinically is not interchangeable with a supplement bottle.", "Warfarin plus bromelain should trigger bleeding-risk teaching."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid supplement dosing unless the obstetric or pediatric clinician approves." },
        { type: "pediatric", label: "Child allergy/bleeding caution", note: "Use only with pediatric guidance, especially with allergy history or procedures." },
        { type: "geriatric", label: "Older adult caution", note: "Anticoagulants, antiplatelets, NSAIDs, surgery, falls, and polypharmacy increase bleeding risk." }
      ],
      tags: ["bromelain", "pineapple", "bleeding", "warfarin", "anticoagulant", "tetracycline", "antibiotics", "allergy", "surgery", "bruising"],
      sourceKeys: ["mskcc-bromelain"]
    },
    {
      name: "Lion's mane mushroom",
      category: "Medicinal mushroom / dietary supplement",
      aliases: ["lion's mane", "lions mane", "Hericium erinaceus", "yamabushitake", "bearded tooth mushroom", "hou tou gu", "monkey head mushroom", "pom pom mushroom", "hedgehog fungus"],
      usedFor: ["Marketed for memory, cognitive support, mood, stress, anxiety, depression, sleep, immune support, nerve health, stomach protection, and general wellness"],
      nclexEssential: true,
      majorRisks: ["Abdominal discomfort, nausea, and rash have been reported", "Allergic reaction is possible, especially in mushroom allergy or mold sensitivity patterns", "Human evidence is limited; most anticancer, immune, nerve-regeneration, and wound-healing claims are preclinical or early-stage", "Supplement quality, extraction method, and dose vary widely", "Use caution with bleeding-risk, diabetes, immune-modifying, or perioperative situations because clinical interaction data are incomplete"],
      interactions: ["Anticoagulants, antiplatelets, NSAIDs, or surgery plans with provider/pharmacist review", "Diabetes medications if glucose changes or hypoglycemia symptoms occur", "Immunosuppressants, transplant medications, biologics, or autoimmune disease therapy with specialist review", "Sedating or psychoactive supplements/medications if used for mood or sleep claims", "Other mushroom blends that may add hidden or duplicate ingredients"],
      contraindications: ["Known mushroom allergy or prior rash/reaction to lion's mane", "Pregnancy or breastfeeding unless clinician approves", "Transplant status, significant immunosuppression, or active autoimmune disease without specialist input", "Upcoming surgery/procedure unless the surgical team approves", "Do not use instead of dementia, depression, anxiety, cancer, neuropathy, or GI evaluation"],
      nursingAssessment: ["Ask product form, fruiting body versus mycelium claims when available, dose, brand testing, reason for use, cognitive/mood symptoms, depression or suicidality screening when relevant, mushroom allergy, rash, GI symptoms, anticoagulants, diabetes medications, immune therapy, cancer treatment, pregnancy/lactation, and planned procedures", "Assess whether the client is substituting lion's mane for neurologic evaluation, mental-health treatment, or cancer care."],
      teaching: ["Food use is different from concentrated extracts or blends.", "Tell clinicians before use with blood thinners, diabetes therapy, immunosuppression, cancer treatment, pregnancy/lactation, or surgery.", "Stop and seek care for rash, hives, wheeze, swelling, severe GI symptoms, unusual bleeding, hypoglycemia symptoms, or worsening mood/suicidal thoughts.", "Do not trust supplement claims that promise memory recovery or cancer treatment."],
      nclexTraps: ["Lion's mane has early human data for memory/mood claims, but that does not make it a dementia or depression treatment.", "A mushroom supplement can still cause allergy, rash, GI effects, and interaction concerns.", "Immune-support claims are not automatically safe in transplant, autoimmune disease, or biologic therapy."],
      populationRisks: [
        { type: "pregnancy", label: "Pregnancy/lactation caution", note: "Avoid supplement dosing unless the obstetric or pediatric clinician approves." },
        { type: "pediatric", label: "Child avoid unless directed", note: "No routine child supplement role without pediatric guidance." },
        { type: "geriatric", label: "Older adult caution", note: "Cognitive symptoms, anticoagulants, diabetes therapy, cancer treatment, immune disease, falls, and polypharmacy make review important." }
      ],
      tags: ["lion's mane mushroom", "lions mane", "Hericium erinaceus", "memory", "mood", "stress", "rash", "mushroom allergy", "immune", "bleeding", "diabetes"],
      sourceKeys: ["mskcc-lions-mane-mushroom"]
    }
  ]
};
