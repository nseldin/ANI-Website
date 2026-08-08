/* eslint-disable */
/* Curated oncology antibody, cellular-therapy, and T-cell-engager study cards. */
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

  const cards = [
    {
      name: "Ado-trastuzumab emtansine",
      generic: "ado trastuzumab emtansine",
      aliases: ["ado-trastuzumab emtansine", "trastuzumab emtansine", "T-DM1", "Kadcyla"],
      brandExamples: ["Kadcyla"],
      class: "HER2-directed antibody-drug conjugate with a DM1 microtubule-inhibitor payload",
      usedToTreat: "Selected HER2-positive breast cancers, including residual invasive disease after neoadjuvant taxane/trastuzumab therapy and previously treated metastatic disease, according to HER2 testing and the current oncology regimen.",
      description: "Ado-trastuzumab emtansine (T-DM1) is a HER2-directed antibody-drug conjugate that uses trastuzumab to deliver the microtubule poison DM1 into HER2-overexpressing tumor cells. It preserves trastuzumab-like HER2 blockade and immune-mediated killing while adding intracellular cytotoxicity; hepatotoxicity, thrombocytopenia, hemorrhage, neuropathy, cardiac dysfunction, and pulmonary toxicity therefore require active surveillance.",
      mechanism: "The trastuzumab antibody binds subdomain IV of HER2 and the complex is internalized and degraded in lysosomes. DM1-containing catabolites then bind tubulin, collapse the microtubule network, arrest mitosis, and trigger apoptosis; the antibody component also inhibits HER2 signaling and can recruit antibody-dependent cellular cytotoxicity.",
      boxedWarning: "Hepatotoxicity, cardiac toxicity, and embryo-fetal toxicity: liver failure and death have occurred, so check hepatic function before treatment and before every dose. Assess left-ventricular function before and during therapy, and prevent fetal exposure. Never substitute this product for plain trastuzumab or trastuzumab deruxtecan.",
      nursingEssentials: ["Verify the full generic and brand, HER2 eligibility, dose, cycle, pregnancy precautions, and that the order is not intended for trastuzumab alone.", "Trend infusion reactions, bleeding, bruising, neuropathy, dyspnea/cough, edema, fatigue, jaundice or RUQ symptoms, and medication-related fall risk."],
      keyLabs: ["CBC with platelets before each dose, AST/ALT and bilirubin before each dose, baseline and periodic LVEF, pregnancy testing when applicable, and pulmonary evaluation for new respiratory symptoms."],
      nclexTraps: ["Kadcyla is not trastuzumab with an informal nickname: it contains the DM1 cytotoxin and has distinct dosing, toxicity, and preparation.", "Thrombocytopenia plus anticoagulant or antiplatelet exposure raises hemorrhage risk; do not dismiss new bruising or bleeding."],
      sourceNote: "Curated from the current U.S. KADCYLA prescribing information (DailyMed, revised 2026).",
      tags: ["frontier-wave3", "oncology", "HER2", "antibody drug conjugate", "ADC", "DM1", "microtubule inhibitor", "breast cancer", "T-DM1"]
    },
    {
      name: "Trastuzumab deruxtecan",
      generic: "trastuzumab deruxtecan",
      aliases: ["fam-trastuzumab deruxtecan-nxki", "fam trastuzumab deruxtecan nxki", "Enhertu", "T-DXd"],
      brandExamples: ["Enhertu"],
      class: "HER2-directed antibody-drug conjugate with a deruxtecan topoisomerase I-inhibitor payload",
      usedToTreat: "Selected HER2-positive, HER2-low, or HER2-ultralow breast cancers and certain HER2-positive or HER2-mutant gastric, lung, and solid tumors, based on current biomarker, disease, and prior-treatment criteria.",
      description: "Trastuzumab deruxtecan (T-DXd) is a HER2-directed antibody-drug conjugate that delivers the membrane-permeable topoisomerase I inhibitor DXd into HER2-expressing tumor cells. Its cleavable linker and diffusible payload can kill neighboring tumor cells with heterogeneous HER2 expression, but potentially fatal interstitial lung disease is the defining bedside hazard.",
      mechanism: "After the antibody binds HER2, the complex is internalized and lysosomal enzymes cleave the linker. Released DXd traps topoisomerase I-DNA cleavage complexes, prevents repair of single-strand DNA breaks, produces lethal replication-associated DNA damage, and triggers apoptosis; payload diffusion contributes to a bystander effect.",
      boxedWarning: "Interstitial lung disease/pneumonitis, including fatal cases, and embryo-fetal toxicity: immediately investigate new cough, dyspnea, fever, or worsening respiratory symptoms. Permanently discontinue for Grade 2 or higher ILD/pneumonitis and use effective contraception as directed.",
      nursingEssentials: ["Establish respiratory baseline and teach immediate reporting of cough, dyspnea, fever, or reduced exercise tolerance; do not wait for the next infusion visit.", "Monitor nausea/vomiting prophylaxis and control, neutropenia, fatigue, anemia, thrombocytopenia, infusion reactions, and symptoms of left-ventricular dysfunction."],
      keyLabs: ["CBC before treatment and as indicated, baseline and periodic LVEF, pregnancy testing when applicable, and prompt pulse oximetry/chest imaging or pulmonary workup for respiratory symptoms."],
      nclexTraps: ["Enhertu and Kadcyla are different HER2 ADCs: DXd inhibits topoisomerase I, whereas DM1 disrupts microtubules.", "A mild new cough can be the first signal of ILD; early interruption and evaluation matter before hypoxemia appears."],
      sourceNote: "Curated from the current U.S. ENHERTU prescribing information (DailyMed, revised 2026).",
      tags: ["frontier-wave3", "oncology", "HER2", "antibody drug conjugate", "ADC", "DXd", "topoisomerase I inhibitor", "ILD", "pneumonitis"]
    },
    {
      name: "Sacituzumab govitecan",
      generic: "sacituzumab govitecan",
      aliases: ["sacituzumab govitecan-hziy", "sacituzumab govitecan hziy", "Trodelvy"],
      brandExamples: ["Trodelvy"],
      class: "Trop-2-directed antibody-drug conjugate with an SN-38 topoisomerase I-inhibitor payload",
      usedToTreat: "Selected unresectable, locally advanced, or metastatic breast cancers after required prior systemic therapy, according to tumor subtype and the current oncology label.",
      description: "Sacituzumab govitecan is a Trop-2-directed antibody-drug conjugate that delivers SN-38, the active topoisomerase I-inhibiting metabolite of irinotecan, to Trop-2-expressing cancer cells. The drug's practical identity is targeted DNA damage paired with potentially severe neutropenia and diarrhea, especially in patients with reduced UGT1A1 activity.",
      mechanism: "The antibody binds Trop-2 and is internalized; linker hydrolysis releases SN-38 inside and around the tumor. SN-38 stabilizes topoisomerase I-DNA cleavage complexes, prevents re-ligation of single-strand breaks, converts them into replication-associated DNA damage, and causes apoptosis.",
      boxedWarning: "Severe or life-threatening neutropenia and severe diarrhea can occur. Monitor blood counts, hold or reduce treatment according to severity, urgently treat febrile neutropenia, and rapidly replace fluids/electrolytes and evaluate infectious causes when diarrhea occurs.",
      nursingEssentials: ["Check CBC before dosing and assess fever or infection immediately; granulocyte colony-stimulating factor may be used according to risk and protocol.", "Provide antiemetic support and distinguish acute infusion-related cholinergic symptoms from delayed diarrhea; monitor hydration, stool frequency, abdominal symptoms, and response to prescribed antidiarrheal therapy."],
      keyLabs: ["CBC with differential, temperature and infection assessment, electrolytes, creatinine, hydration status, liver function, and UGT1A1 context when clinically relevant."],
      nclexTraps: ["SN-38 is the active irinotecan metabolite; this explains both topoisomerase I inhibition and heightened toxicity with reduced UGT1A1 activity.", "Do not treat fever during neutropenia as an expected chemotherapy effect; it is an oncologic emergency."],
      sourceNote: "Curated from the current U.S. TRODELVY prescribing information (DailyMed, revised 2025).",
      tags: ["frontier-wave3", "oncology", "Trop-2", "antibody drug conjugate", "ADC", "SN-38", "topoisomerase I inhibitor", "neutropenia", "diarrhea"]
    },
    {
      name: "Enfortumab vedotin",
      generic: "enfortumab vedotin",
      aliases: ["enfortumab vedotin-ejfv", "enfortumab vedotin ejfv", "Padcev"],
      brandExamples: ["Padcev"],
      class: "Nectin-4-directed antibody-drug conjugate with an MMAE microtubule-inhibitor payload",
      usedToTreat: "Selected urothelial cancers, alone or with PD-1-directed therapy, and current perioperative cisplatin-ineligible muscle-invasive bladder-cancer regimens as specified by the oncology label.",
      description: "Enfortumab vedotin is a Nectin-4-directed antibody-drug conjugate that binds Nectin-4 on urothelial cancer cells and delivers monomethyl auristatin E (MMAE) to inhibit microtubule assembly and kill the targeted cell. Serious skin reactions are its signature emergency, while hyperglycemia, peripheral neuropathy, pneumonitis, and ocular surface injury are recurring monitoring priorities.",
      mechanism: "The antibody binds cell-surface Nectin-4, the complex is internalized, and proteases cleave the linker to release MMAE. MMAE binds tubulin, disrupts microtubule assembly, arrests the cell cycle, and causes apoptotic death.",
      boxedWarning: "Severe and fatal cutaneous reactions, including Stevens-Johnson syndrome and toxic epidermal necrolysis, can occur, often during the first treatment cycle. Monitor closely for rash, skin pain, blistering, fever, and mucosal lesions. Withhold immediately and obtain specialized evaluation for suspected SJS/TEN or severe skin reactions; permanently discontinue for confirmed SJS/TEN, Grade 4, or recurrent Grade 3 reactions.",
      nursingEssentials: ["Inspect skin and mucosa at baseline and throughout treatment; rapidly escalate blistering, targetoid lesions, skin pain, fever, facial edema, or oral/ocular/genital involvement.", "Monitor glucose even without known diabetes, motor/sensory neuropathy, cough/dyspnea, dry eye or vision change, infusion reactions, and fall or functional risk."],
      keyLabs: ["Blood glucose, CBC, liver and renal context, electrolytes, and prompt pulmonary or ophthalmic evaluation when symptoms develop."],
      nclexTraps: ["A new rash is not automatically a minor chemotherapy rash; mucosal injury, skin pain, blistering, or systemic illness can signal SJS/TEN.", "Vedotin identifies an MMAE-containing ADC; it does not mean all vedotin products target the same tumor antigen."],
      sourceNote: "Curated from the current U.S. PADCEV prescribing information (DailyMed, revised 2025).",
      tags: ["frontier-wave3", "oncology", "Nectin-4", "antibody drug conjugate", "ADC", "MMAE", "microtubule inhibitor", "urothelial cancer", "SJS", "TEN"]
    },
    {
      name: "Brentuximab vedotin",
      generic: "brentuximab vedotin",
      aliases: ["Adcetris"],
      brandExamples: ["Adcetris"],
      class: "CD30-directed antibody-drug conjugate with an MMAE microtubule-inhibitor payload",
      usedToTreat: "Selected CD30-expressing lymphomas, including classical Hodgkin lymphoma, systemic anaplastic large-cell lymphoma, other peripheral T-cell lymphomas, cutaneous anaplastic large-cell lymphoma, and mycosis fungoides in label-defined settings.",
      description: "Brentuximab vedotin is a CD30-directed antibody-drug conjugate that delivers the microtubule toxin MMAE into CD30-expressing lymphoma cells. Progressive multifocal leukoencephalopathy is the boxed danger, while cumulative peripheral neuropathy, cytopenias, infection, tumor lysis, liver injury, and pulmonary toxicity shape day-to-day nursing assessment.",
      mechanism: "After binding CD30, the ADC-CD30 complex is internalized and trafficked to lysosomes, where proteolysis releases MMAE. MMAE binds tubulin, disrupts the microtubule network, arrests cells in G2/M, and induces apoptosis.",
      boxedWarning: "JC-virus infection causing progressive multifocal leukoencephalopathy and death can occur. New weakness, gait change, vision loss, speech difficulty, cognitive change, or personality change requires immediate evaluation and treatment interruption.",
      nursingEssentials: ["Perform serial sensory and motor assessment because neuropathy is exposure-dependent and may require delay, dose reduction, or discontinuation.", "Monitor infusion reactions, infection, fever, cytopenia, tumor-lysis risk, hepatic symptoms, pulmonary symptoms, and all new focal or cognitive neurologic findings."],
      keyLabs: ["CBC with differential before each dose, liver function, renal function for exposure risk, tumor-lysis labs when burden is high, and neurologic evaluation/MRI-JC virus testing when PML is suspected."],
      nclexTraps: ["Concomitant bleomycin is contraindicated because pulmonary toxicity is increased.", "Peripheral neuropathy is common, but a subacute multifocal neurologic decline must trigger concern for PML rather than routine chemotherapy neuropathy."],
      sourceNote: "Curated from the current U.S. ADCETRIS prescribing information (DailyMed, revised 2025).",
      tags: ["frontier-wave3", "oncology", "CD30", "antibody drug conjugate", "ADC", "MMAE", "lymphoma", "PML", "neuropathy"]
    },
    {
      name: "Mirvetuximab soravtansine",
      generic: "mirvetuximab soravtansine",
      aliases: ["mirvetuximab soravtansine-gynx", "mirvetuximab soravtansine gynx", "Elahere"],
      brandExamples: ["Elahere"],
      class: "Folate receptor-alpha-directed antibody-drug conjugate with a DM4 microtubule-inhibitor payload",
      usedToTreat: "FR-alpha-positive, platinum-resistant epithelial ovarian, fallopian-tube, or primary peritoneal cancer after one to three prior systemic regimens, selected with an approved biomarker test.",
      description: "Mirvetuximab soravtansine is a folate receptor-alpha-directed antibody-drug conjugate that delivers DM4, a maytansinoid microtubule inhibitor, into biomarker-selected gynecologic cancer cells. Ocular toxicity is so central that baseline and scheduled slit-lamp examinations, prophylactic steroid drops, lubricating drops, and symptom-triggered dose decisions are part of the treatment itself.",
      mechanism: "The antibody binds folate receptor alpha and is internalized; proteolytic cleavage releases DM4. DM4 disrupts tubulin and microtubule dynamics, causing cell-cycle arrest and apoptosis in FR-alpha-expressing cells.",
      boxedWarning: "Severe ocular toxicity can cause keratopathy, dry eye, photophobia, eye pain, uveitis, and visual impairment. Obtain visual-acuity and slit-lamp examinations before therapy, every other cycle for the first eight cycles, and as clinically indicated; use prescribed topical steroid and lubricating drops and modify therapy for toxicity.",
      nursingEssentials: ["Verify FR-alpha test eligibility and the ophthalmic prevention plan before infusion; teach immediate reporting of blurred vision, eye pain/redness, photophobia, or worsening dryness.", "Avoid contact lenses unless the eye specialist approves them, monitor peripheral neuropathy and pneumonitis, and confirm D5W dilution because the product is incompatible with normal saline."],
      keyLabs: ["Scheduled visual-acuity and slit-lamp exams, CBC, liver tests, pregnancy testing when applicable, and pulmonary evaluation for new respiratory symptoms."],
      nclexTraps: ["Eye drops are prophylaxis, not optional comfort treatment.", "Elahere must be diluted in 5% dextrose; normal saline is incompatible."],
      sourceNote: "Curated from the current U.S. ELAHERE prescribing information (DailyMed, revised 2025).",
      tags: ["frontier-wave3", "oncology", "FR alpha", "folate receptor alpha", "antibody drug conjugate", "ADC", "DM4", "ocular toxicity", "ovarian cancer"]
    },
    {
      name: "Tisagenlecleucel",
      generic: "tisagenlecleucel",
      aliases: ["Kymriah", "tisa-cel", "tisa cel"],
      brandExamples: ["Kymriah"],
      class: "CD19-directed autologous CAR-T cell therapy with 4-1BB costimulation",
      usedToTreat: "Refractory or multiply relapsed B-cell precursor acute lymphoblastic leukemia in patients through age 25 and selected adults with relapsed or refractory large B-cell or follicular lymphoma after required prior therapy.",
      description: "Tisagenlecleucel is a one-time, patient-specific CD19-directed CAR-T therapy: the patient's T cells are collected, genetically engineered with a CD19 receptor using 4-1BB costimulation, expanded, and reinfused after lymphodepletion. The cells can proliferate and eradicate CD19-positive malignant and normal B cells, but cytokine release syndrome, neurotoxicity, prolonged cytopenias, infection, hypogammaglobulinemia, and secondary malignancy demand long-term follow-up.",
      mechanism: "The CAR combines an anti-CD19 recognition domain with CD3-zeta activation and 4-1BB costimulatory signaling. Binding CD19 activates the engineered T cell without conventional antigen presentation, causing cytokine release, clonal expansion, perforin/granzyme-mediated target-cell lysis, and persistent B-cell aplasia.",
      boxedWarning: "Cytokine release syndrome, neurologic toxicities, and secondary hematologic malignancies can be life-threatening or fatal. Do not infuse during uncontrolled active infection; verify rapid access to tocilizumab and emergency support, monitor closely after infusion, and arrange lifelong surveillance for secondary malignancy.",
      nursingEssentials: ["This is an autologous living product: verify two independent patient identifiers against the infusion bag and certificate, never use a leukocyte-depleting filter, and coordinate lymphodepletion and premedication exactly.", "Monitor fever, hypotension, hypoxia, tachycardia, organ dysfunction, handwriting/language/attention changes, seizure, infection, cytopenias, tumor lysis, and immunoglobulin deficiency; avoid driving or hazardous activity during the restricted post-infusion period."],
      keyLabs: ["Frequent vital signs and oxygenation, CBC, CMP including renal/hepatic function, coagulation and inflammatory markers per protocol, tumor-lysis labs, cultures when febrile, immunoglobulins, and neurologic assessment such as ICE when age-appropriate."],
      nclexTraps: ["CRS is systemic immune activation, not ordinary infusion fever; hypotension or hypoxia rapidly changes severity and management.", "Tocilizumab treats IL-6-driven CRS but does not reliably treat isolated ICANS; neurologic toxicity follows its own protocol."],
      sourceNote: "Curated from the current U.S. KYMRIAH prescribing information and FDA product page.",
      tags: ["frontier-wave3", "oncology", "CAR-T", "CAR T", "CD19", "4-1BB", "ALL", "lymphoma", "CRS", "ICANS", "cell therapy"]
    },
    {
      name: "Axicabtagene ciloleucel",
      generic: "axicabtagene ciloleucel",
      aliases: ["Yescarta", "axi-cel", "axi cel"],
      brandExamples: ["Yescarta"],
      class: "CD19-directed autologous CAR-T cell therapy with CD28 costimulation",
      usedToTreat: "Selected adults with large B-cell lymphoma that is refractory to first-line chemoimmunotherapy or relapses early, other relapsed or refractory large B-cell lymphoma, and relapsed or refractory follicular lymphoma under current criteria.",
      description: "Axicabtagene ciloleucel is a patient-specific autologous CD19-directed CAR-T immune-cell therapy whose engineered receptor binds CD19 and activates CD28 plus CD3-zeta signaling, causing the infused T cells to expand and kill malignant and normal CD19-positive B cells. Its antitumor potency is inseparable from early cytokine release syndrome, often-early neurologic toxicity, prolonged cytopenias, infection, B-cell aplasia, and lifelong secondary-malignancy surveillance.",
      mechanism: "The CAR links an anti-CD19 binding domain to CD3-zeta activation and CD28 costimulation. CD19 binding triggers engineered T-cell activation, cytokine production, proliferation, and perforin/granzyme-mediated lysis independent of major-histocompatibility-complex antigen presentation.",
      boxedWarning: "Cytokine release syndrome, neurologic toxicities, and secondary hematologic malignancies can be life-threatening or fatal. Do not infuse with active infection or inflammatory disease; confirm tocilizumab availability, monitor intensively after infusion, and maintain lifelong secondary-malignancy follow-up.",
      nursingEssentials: ["Verify patient-product identity, lymphodepleting chemotherapy, premedication, emergency readiness, and that no leukocyte-depleting filter is used.", "Trend fever, blood pressure, oxygen requirement, rhythm, capillary leak/organ function, speech, orientation, handwriting, attention, tremor, weakness, seizure, infection, cytopenia, and immunoglobulin deficiency."],
      keyLabs: ["Frequent vital signs and oxygenation, CBC, CMP, coagulation and inflammatory markers per protocol, cultures for fever, tumor-lysis studies, immunoglobulins, and serial structured neurologic assessment."],
      nclexTraps: ["CRS and sepsis can coexist; obtain cultures and treat infection risk while grading and treating CRS.", "Neurologic toxicity may occur with CRS or after CRS improves, so a normal blood pressure does not end neurologic monitoring."],
      sourceNote: "Curated from the current U.S. YESCARTA prescribing information and FDA product page (revised 2026).",
      tags: ["frontier-wave3", "oncology", "CAR-T", "CAR T", "CD19", "CD28", "large B cell lymphoma", "CRS", "ICANS", "cell therapy"]
    },
    {
      name: "Idecabtagene vicleucel",
      generic: "idecabtagene vicleucel",
      aliases: ["Abecma", "ide-cel", "ide cel"],
      brandExamples: ["Abecma"],
      class: "BCMA-directed autologous CAR-T cell therapy with 4-1BB costimulation",
      usedToTreat: "Adults with relapsed or refractory multiple myeloma after at least two prior lines that include an immunomodulatory drug, a proteasome inhibitor, and an anti-CD38 monoclonal antibody under current criteria.",
      description: "Idecabtagene vicleucel is a patient-specific autologous BCMA-directed CAR-T immune-cell therapy whose engineered receptor binds B-cell maturation antigen and activates 4-1BB plus CD3-zeta signaling, causing the infused T cells to expand and kill BCMA-positive myeloma plasma cells. It can produce deep myeloma responses, but cytokine release syndrome, neurotoxicity, HLH/MAS, prolonged cytopenias, infection, hypogammaglobulinemia, tumor lysis, and secondary hematologic malignancy require organized acute and long-term surveillance.",
      mechanism: "The CAR recognizes BCMA and signals through CD3-zeta plus 4-1BB. Contact with BCMA-positive plasma cells activates and expands the engineered T cells, releases inflammatory cytokines, and triggers perforin/granzyme-mediated target-cell death.",
      boxedWarning: "Cytokine release syndrome, neurologic toxicities, hemophagocytic lymphohistiocytosis/macrophage activation syndrome, prolonged cytopenias, and secondary hematologic malignancies may be life-threatening or fatal. Verify emergency resources and tocilizumab availability, monitor after infusion, and provide lifelong malignancy surveillance.",
      nursingEssentials: ["Verify autologous product identity, lymphodepletion, premedication, infection status, and emergency readiness before infusion.", "Monitor fever, hypotension, hypoxia, organ dysfunction, language/attention/handwriting change, seizure, hepatosplenomegaly or coagulopathy suggesting HLH/MAS, persistent cytopenia, bleeding, infection, and immunoglobulin deficiency."],
      keyLabs: ["Frequent vital signs/oxygenation, CBC, CMP, coagulation, ferritin and inflammatory markers per protocol, tumor-lysis labs, cultures when febrile, immunoglobulins, and serial neurologic assessment."],
      nclexTraps: ["BCMA identifies plasma-cell lineage; this is not a CD19 lymphoma CAR-T product.", "Persistent or recurrent fever with rapidly rising ferritin, cytopenias, liver injury, and coagulopathy after CAR-T can signal HLH/MAS, not simple prolonged CRS."],
      sourceNote: "Curated from the current U.S. ABECMA prescribing information and FDA product page (revised 2025).",
      tags: ["frontier-wave3", "oncology", "CAR-T", "CAR T", "BCMA", "4-1BB", "multiple myeloma", "CRS", "ICANS", "HLH", "MAS", "cell therapy"]
    },
    {
      name: "Blinatumomab",
      generic: "blinatumomab",
      aliases: ["Blincyto", "BiTE"],
      brandExamples: ["Blincyto"],
      class: "CD19xCD3 bispecific T-cell engager (BiTE)",
      usedToTreat: "CD19-positive B-cell precursor acute lymphoblastic leukemia, including measurable-residual-disease-positive, relapsed/refractory, and consolidation settings specified by the current protocol and label.",
      description: "Blinatumomab is a CD19xCD3 bispecific antibody-derived T-cell engager that binds CD3 on endogenous T cells and CD19 on B-lineage leukemia cells, activates the linked T cell, and redirects cytotoxic killing without requiring antigen presentation. Its very short half-life drives prolonged continuous IV infusion; cytokine release syndrome, ICANS/other neurologic toxicity, infection, tumor lysis, cytopenia, and line or pump errors are the core nursing risks.",
      mechanism: "One binding arm engages CD3 in the T-cell receptor complex and the other binds CD19 on malignant and normal B cells. The bridge forms an immune synapse, activates and expands T cells, releases cytokines and cytolytic proteins, and produces perforin/granzyme-mediated lysis of CD19-positive cells.",
      boxedWarning: "Cytokine release syndrome and neurologic toxicities, including ICANS, may be severe, life-threatening, or fatal. Use step-up and interruption/restart rules exactly, monitor for fever, hypotension, hypoxia, confusion, aphasia, tremor, seizure, or reduced consciousness, and treat promptly by severity.",
      nursingEssentials: ["Protect continuous-infusion integrity: verify bag, concentration, programmed rate, line, filter, and scheduled changes. Never flush the line in a way that delivers the residual drug as a bolus.", "Perform serial neurologic assessment and monitor fever/infection, tumor lysis, cytopenias, liver injury, pancreatitis symptoms, and safe mobility/driving restrictions."],
      keyLabs: ["CBC with differential, CMP/liver tests, electrolytes/uric acid/creatinine for tumor lysis, cultures for fever, and structured neurologic assessment including ICE when appropriate."],
      nclexTraps: ["Blinatumomab is not a conventional monoclonal antibody infusion; it continuously redirects the patient's own T cells.", "A pump interruption or accidental line flush can cause underexposure or an unintended bolus and must be handled by the product protocol."],
      sourceNote: "Curated from the current U.S. BLINCYTO prescribing information (DailyMed, revised 2025/2026).",
      tags: ["frontier-wave3", "oncology", "bispecific", "BiTE", "CD19", "CD3", "ALL", "continuous infusion", "CRS", "ICANS"]
    },
    {
      name: "Teclistamab",
      generic: "teclistamab",
      aliases: ["teclistamab-cqyv", "teclistamab cqyv", "Tecvayli"],
      brandExamples: ["Tecvayli"],
      class: "BCMAxCD3 bispecific T-cell engager",
      usedToTreat: "Relapsed or refractory multiple myeloma, either with daratumumab after at least one prior line containing a proteasome inhibitor and immunomodulatory drug or as monotherapy after the required later-line exposure under the current label.",
      description: "Teclistamab is a subcutaneous BCMAxCD3 bispecific monoclonal antibody that binds BCMA on myeloma plasma cells and CD3 on T cells, cross-links the two cells, and activates targeted T-cell killing. Step-up dosing reduces but does not eliminate cytokine release syndrome and ICANS; serious infection, hypogammaglobulinemia, cytopenias, hepatotoxicity, and reactivation risk remain central throughout therapy.",
      mechanism: "One arm binds BCMA on plasma cells and the other binds CD3 on T cells. Cross-linking creates an immune synapse, activates and expands T cells, releases cytokines and cytolytic proteins, and causes perforin/granzyme-mediated lysis of BCMA-positive cells.",
      boxedWarning: "Cytokine release syndrome and neurologic toxicity including ICANS can be life-threatening or fatal. Initiate with the exact step-up schedule, monitor around step-up doses, withhold until toxicity resolves or discontinue by severity, and follow the current restricted safety-program requirements.",
      nursingEssentials: ["Verify step-up dose number, prior dose timing, required observation, premedication, and whether infection or unresolved toxicity requires delay.", "Monitor fever, hypotension, hypoxia, confusion, handwriting/language/attention change, infection, cytopenias, bleeding, immunoglobulin deficiency, liver injury, injection-site reaction, and vaccination/prophylaxis plan."],
      keyLabs: ["CBC, liver tests, renal function/electrolytes, infection studies as indicated, immunoglobulins, and serial vital-sign/oxygenation and structured neurologic assessments."],
      nclexTraps: ["The target is BCMA on plasma cells, while CD3 recruits the T cell; do not reverse the two sides of the engager.", "A normal first dose does not make later step-up doses routine; timing and observation requirements still apply."],
      sourceNote: "Curated from the current U.S. TECVAYLI prescribing information (DailyMed, revised 2026).",
      tags: ["frontier-wave3", "oncology", "bispecific", "BCMA", "CD3", "multiple myeloma", "step up dosing", "CRS", "ICANS", "hypogammaglobulinemia"]
    },
    {
      name: "Tarlatamab",
      generic: "tarlatamab",
      aliases: ["tarlatamab-dlle", "tarlatamab dlle", "Imdelltra"],
      brandExamples: ["Imdelltra"],
      class: "DLL3xCD3 bispecific T-cell engager",
      usedToTreat: "Adults with extensive-stage small-cell lung cancer that has progressed during or after platinum-based chemotherapy.",
      description: "Tarlatamab is a DLL3xCD3 bispecific antibody-derived T-cell engager that binds DLL3 on small-cell lung cancer cells and CD3 on T cells, cross-links the two cells, and activates targeted T-cell killing. The treatment uses step-up IV dosing and prolonged early observation because cytokine release syndrome and ICANS can be life-threatening; cytopenias, infection, liver injury, and tumor lysis add further monitoring burden.",
      mechanism: "One arm binds DLL3 on tumor cells and the other binds CD3 on T cells. The resulting immune synapse activates T cells, releases inflammatory cytokines and cytolytic proteins, and drives perforin/granzyme-mediated lysis of DLL3-expressing cells.",
      boxedWarning: "Cytokine release syndrome and neurologic toxicity including ICANS may be life-threatening or fatal. Use the labeled step-up schedule, required concomitant medications and early observation, monitor closely, and withhold or permanently discontinue according to severity.",
      nursingEssentials: ["Confirm step-up dose, infusion timing, premedication/hydration, observation window, caregiver and proximity plan, and readiness to manage CRS or neurologic deterioration.", "Monitor fever, hypotension, hypoxia, tachycardia, confusion, aphasia, tremor, weakness, seizure, cytopenias, infection, liver injury, appetite/nutrition, sodium, uric acid, and tumor-lysis risk."],
      keyLabs: ["CBC, CMP including sodium and liver tests, renal function/uric acid and other tumor-lysis labs, cultures for fever, frequent vital signs/oxygenation, and serial structured neurologic assessment."],
      nclexTraps: ["DLL3 is the tumor target and CD3 is the T-cell recruiter; tarlatamab is not a checkpoint inhibitor.", "The first step-up doses require much more observation than an ordinary one-hour infusion because delayed CRS can follow completion."],
      sourceNote: "Curated from the current U.S. IMDELLTRA prescribing information (DailyMed, revised 2025).",
      tags: ["frontier-wave3", "oncology", "bispecific", "DLL3", "CD3", "small cell lung cancer", "step up dosing", "CRS", "ICANS"]
    }
  ];

  const classOverrides = new Map([
    ["daratumumab", "CD38-directed cytolytic monoclonal antibody"],
    ["elotuzumab", "SLAMF7-directed immunostimulatory monoclonal antibody"],
    ["mosunetuzumab", "CD20xCD3 bispecific T-cell engager"],
    ["glofitamab", "CD20xCD3 bispecific T-cell engager with a 2:1 CD20-binding format"],
    ["epcoritamab", "CD20xCD3 bispecific T-cell engager"],
    ["amivantamab", "EGFR/MET-directed bispecific antibody"],
    ["ramucirumab", "VEGFR2 antagonist monoclonal antibody"],
    ["cetuximab", "EGFR antagonist chimeric monoclonal antibody"],
    ["panitumumab", "EGFR antagonist fully human monoclonal antibody"],
    ["dinutuximab", "GD2-directed cytolytic monoclonal antibody"]
  ]);

  const map = new Map();
  db.drugs.forEach((drug) => {
    const key = normalize(drug.generic || drug.name || drug.displayName);
    if (key && !map.has(key)) map.set(key, drug);
  });

  classOverrides.forEach((classText, rawKey) => {
    const key = normalize(rawKey);
    const existing = map.get(key);
    if (!existing) return;
    map.set(key, {
      ...existing,
      class: classText,
      tags: Array.from(new Set([...(existing.tags || []), "frontier-wave3", "precise oncology subclass"])),
      expandedIndex: false,
      hidden: false,
      studentFacing: true
    });
  });

  cards.forEach((card) => {
    const key = normalize(card.generic || card.name || card.displayName);
    const existing = map.get(key) || {};
    map.set(key, {
      ...existing,
      ...card,
      generic: key,
      displayName: card.displayName || card.name,
      aliases: Array.from(new Set([...(card.aliases || []), ...(existing.aliases || [])])),
      brandExamples: Array.from(new Set([...(card.brandExamples || []), ...(existing.brandExamples || [])])),
      tags: Array.from(new Set([...(existing.tags || []), ...(card.tags || [])])),
      adverseEffects: Array.isArray(card.adverseEffects) ? card.adverseEffects : [],
      contraindications: Array.isArray(card.contraindications) ? card.contraindications : [],
      interactions: Array.isArray(card.interactions) ? card.interactions : [],
      populationRisks: Array.isArray(card.populationRisks) ? card.populationRisks : [],
      templateKey: "curated full study card",
      confidenceTier: "Curated full study card",
      expandedIndex: false,
      hidden: false,
      studentFacing: true,
      deprecatedCombinationProduct: false,
      combinationProduct: false,
      nclexEssential: true
    });
  });

  db.drugs = Array.from(map.values());
  db.pharmFrontierWave3Patch = {
    version: "2026-07-12-oncology-antibody-cellular",
    promotedCardCount: cards.length,
    preciseClassOverrideCount: classOverrides.size
  };
  db.version = [db.version, "pharm-frontier-wave3-oncology"].filter(Boolean).join("+");
}());
