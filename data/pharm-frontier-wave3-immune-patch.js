/* eslint-disable */
/* Curated transplant, rheumatology, and immune-biologic cards plus navigable pathway references. */
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
      name: "Calcineurin inhibitors",
      generic: "calcineurin inhibitors",
      aliases: ["calcineurin inhibitor", "CNI immunosuppressants", "CNIs", "calcineurin-NFAT inhibitors"],
      class: "Calcium-calcineurin-NFAT pathway inhibitor immunosuppressant class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Tacrolimus", "Cyclosporine", "Voclosporin"],
      usedToTreat: "Prevention of solid-organ allograft rejection with tacrolimus or cyclosporine, selected autoimmune disease with cyclosporine, and active lupus nephritis with voclosporin plus background therapy.",
      description: "Calcineurin inhibitors suppress T-cell activation by preventing calcineurin from dephosphorylating NFAT, so NFAT cannot enter the nucleus and drive IL-2 and other cytokine transcription. Tacrolimus and voclosporin bind FKBP-family immunophilins, whereas cyclosporine binds cyclophilin; the shared downstream blockade explains both potent immunosuppression and class toxicities such as afferent arteriolar vasoconstriction, nephrotoxicity, hypertension, hyperkalemia, tremor, seizures, and PRES.",
      mechanism: "T-cell receptor signaling raises intracellular calcium, activating calmodulin and calcineurin. Drug-immunophilin complexes inhibit calcineurin phosphatase, keep NFAT phosphorylated in the cytoplasm, reduce IL-2 transcription, and suppress clonal T-cell activation. The pathway is shared, but monitoring is not: transplant tacrolimus and cyclosporine use formulation-specific blood troughs, while lupus-nephritis voclosporin dosing is driven chiefly by eGFR, blood pressure, and interactions.",
      boxedWarning: "Class safety is product- and indication-specific. Serious infection and malignancy risk accompanies therapeutic immunosuppression; nephrotoxicity, hypertension, hyperkalemia, neurotoxicity/PRES, QT risk, and CYP3A interactions can become urgent. Never interchange tacrolimus or cyclosporine formulations without a supervised conversion and level plan.",
      nursingEssentials: ["Identify the exact molecule, formulation, indication, dose time, and monitoring method before administration; a CNI name alone is not enough.", "Trend renal function, potassium, magnesium, blood pressure, glucose, neurologic status, infection, skin changes, and CYP3A/P-gp interactions; avoid grapefruit and live vaccines unless the specialist plan says otherwise."],
      keyLabs: ["Creatinine/eGFR, potassium, magnesium, glucose, liver tests, blood pressure, ECG when QT risk is stacked, and formulation-specific whole-blood trough concentrations for transplant tacrolimus or cyclosporine."],
      nclexTraps: ["Calcineurin nephrotoxicity can resemble rejection because both can raise creatinine; timing, levels, biopsy, hemodynamics, and the transplant team's assessment distinguish them.", "Sirolimus and everolimus bind FKBP12 but inhibit mTOR rather than calcineurin, so they are not calcineurin inhibitors."],
      tags: ["frontier-wave3", "drug class", "calcineurin inhibitor", "CNI", "NFAT", "IL-2", "tacrolimus", "cyclosporine", "voclosporin", "immunosuppression"]
    },
    {
      name: "mTOR inhibitors",
      generic: "mtor inhibitors",
      aliases: ["mTOR inhibitor immunosuppressants", "mammalian target of rapamycin inhibitors", "mechanistic target of rapamycin inhibitors", "rapalogs"],
      class: "FKBP12-bound mTOR complex 1 inhibitor class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Sirolimus", "Everolimus"],
      usedToTreat: "Selected solid-organ transplant regimens; sirolimus also treats lymphangioleiomyomatosis, while everolimus products have separate oncology, tuberous-sclerosis-complex, and seizure indications.",
      description: "mTOR inhibitors are rapamycin-related drugs that bind FKBP12 and inhibit mTOR complex 1, interrupting cytokine-driven protein synthesis and the G1-to-S cell-cycle transition so activated T and B lymphocytes cannot proliferate normally. They do not inhibit calcineurin or directly block IL-2 transcription; instead, they block the growth response after cytokine receptors have signaled, which helps explain delayed wound healing, mouth ulcers, dyslipidemia, cytopenias, proteinuria, edema, and noninfectious pneumonitis.",
      mechanism: "The drug-FKBP12 complex inhibits mTORC1 and downstream p70 S6 kinase/ribosomal S6 signaling, reducing translation, cell growth, angiogenesis, and cytokine-driven lymphocyte proliferation. Sirolimus and everolimus share this pathway but differ in approved products, exposure targets, transplant partners, and nontransplant uses.",
      boxedWarning: "Product-specific boxed warnings matter. Sirolimus carries transplant-specific warnings against use in liver or lung transplantation because of excess graft loss, mortality, hepatic-artery thrombosis, and bronchial-anastomotic dehiscence. Zortress everolimus warns about malignancy/serious infection, kidney-graft thrombosis, cyclosporine-associated nephrotoxicity, and increased mortality in heart transplantation.",
      nursingEssentials: ["Verify whether the order is transplant sirolimus, transplant Zortress everolimus, or an oncology/TSC everolimus product; dose, target concentration, schedule, and warning context are not interchangeable.", "Trend CBC, lipids, glucose, renal function, urine protein, liver tests, mouth ulcers, wound or anastomotic healing, edema, infection, and cough/dyspnea suggesting pneumonitis."],
      keyLabs: ["Whole-blood trough concentration when used for transplant, CBC, fasting lipids, glucose, creatinine/eGFR, urine protein, liver tests, and pulmonary evaluation for new respiratory symptoms."],
      nclexTraps: ["Binding FKBP12 does not make these calcineurin inhibitors: the inhibited enzyme is mTORC1, not calcineurin.", "A new infiltrate can be infection or drug pneumonitis; immunosuppression makes both plausible and requires prompt evaluation."],
      tags: ["frontier-wave3", "drug class", "mTOR", "mTORC1", "FKBP12", "sirolimus", "everolimus", "rapalog", "transplant"]
    },
    {
      name: "Purine antimetabolite immunosuppressants",
      generic: "purine antimetabolite immunosuppressants",
      aliases: ["transplant antimetabolites", "antimetabolite transplant immunosuppressants", "purine synthesis immunosuppressants"],
      class: "Lymphocyte purine-metabolism antimetabolite immunosuppressant class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Mycophenolic acid", "Azathioprine"],
      usedToTreat: "Prevention of renal or other protocol-specified transplant rejection and selected autoimmune diseases; exact labeled uses and pregnancy restrictions differ sharply by drug.",
      description: "Purine antimetabolite immunosuppressants prevent activated lymphocytes from making or using the guanine nucleotides required for DNA replication, but they reach that endpoint differently. Mycophenolic acid reversibly inhibits IMP dehydrogenase and selectively starves T and B cells of de novo guanosine, whereas azathioprine becomes 6-mercaptopurine and 6-thioguanine nucleotides that inhibit purine synthesis and can enter DNA; this difference drives distinct interaction, pharmacogenetic, pregnancy, and toxicity rules.",
      mechanism: "Activated lymphocytes rely heavily on de novo purine synthesis. Mycophenolic acid blocks IMPDH, lowering guanosine nucleotides without becoming a DNA base. Azathioprine is converted through 6-MP to active thioguanine nucleotides; TPMT, NUDT15, and xanthine oxidase determine metabolite exposure and marrow toxicity.",
      boxedWarning: "Mycophenolic acid carries boxed embryo-fetal toxicity, malignancy, and serious-infection warnings. Azathioprine carries a boxed malignancy warning and can cause severe or fatal myelosuppression, especially with TPMT/NUDT15 deficiency or xanthine-oxidase inhibition. These drugs are not generic substitutes for one another.",
      nursingEssentials: ["Verify pregnancy precautions, exact formulation, CBC trend, infection history, skin surveillance, and all interacting drugs before giving either agent.", "For azathioprine, identify allopurinol or febuxostat and TPMT/NUDT15 risk; for mycophenolic acid, prevent accidental milligram-for-milligram substitution with mycophenolate mofetil."],
      keyLabs: ["CBC with differential/platelets, renal and liver function, pregnancy testing when applicable, TPMT/NUDT15 evaluation when indicated for azathioprine, and graft or autoimmune response measures."],
      nclexTraps: ["A normal TPMT or NUDT15 result does not replace CBC monitoring.", "Myfortic delayed-release mycophenolic acid and mycophenolate mofetil have different absorption and cannot be substituted milligram for milligram."],
      tags: ["frontier-wave3", "drug class", "antimetabolite", "purine", "mycophenolic acid", "azathioprine", "IMPDH", "TPMT", "NUDT15"]
    },
    {
      name: "T-cell costimulation blockers",
      generic: "t cell costimulation blockers",
      aliases: ["T-cell costimulation modulators", "CD80 CD86 blockers", "CTLA4 Ig drugs", "CD28 costimulation blockers"],
      class: "CTLA4-Ig CD80/CD86 antagonist fusion-protein class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Belatacept", "Abatacept"],
      usedToTreat: "Belatacept prevents rejection in EBV-seropositive adult kidney-transplant recipients; abatacept treats RA, pJIA, and PsA and helps prevent acute GVHD in specified unrelated-donor HSCT regimens.",
      description: "T-cell costimulation blockers are CTLA4-Ig fusion proteins that bind CD80 and CD86 on antigen-presenting cells, preventing those ligands from delivering the required second signal through CD28 on a T cell. Antigen recognition without adequate costimulation produces incomplete activation rather than normal clonal expansion; belatacept is optimized for transplant immunosuppression, while abatacept is used primarily for inflammatory arthritis and selected GVHD prophylaxis.",
      mechanism: "A naive T cell needs both T-cell-receptor recognition of peptide-MHC and CD28 engagement by CD80/CD86. CTLA4-Ig proteins outcompete CD28 for those ligands, reducing IL-2 production, proliferation, cytokine release, and T-cell help to B cells. Belatacept has amino-acid changes that increase CD80/CD86 avidity relative to abatacept.",
      boxedWarning: "Belatacept carries a boxed PTLD warning, especially for CNS disease, and is restricted to EBV-seropositive kidney-transplant recipients; it also warns about serious infection and malignancy and is not recommended in liver transplantation. Abatacept has no boxed warning but can cause serious infection and must not be stacked casually with TNF blockers, other biologic DMARDs, or JAK inhibitors.",
      nursingEssentials: ["Distinguish belatacept from abatacept before applying any indication, viral-monitoring, or dosing schedule.", "Screen infection, TB and hepatitis risk, vaccination status, and concurrent biologic immunosuppression; in transplant or HSCT contexts follow EBV, CMV, BK, PJP, and other protocol-specific prophylaxis and monitoring."],
      keyLabs: ["EBV serology before belatacept, TB and hepatitis screening, CBC/CMP, graft function or inflammatory-disease measures, and EBV/CMV monitoring for protocol-specified transplant or HSCT patients."],
      nclexTraps: ["Belatacept is not simply an IV form of abatacept; its indication and boxed PTLD restriction are different.", "Blocking costimulation is upstream immune signaling, not direct T-cell depletion."],
      tags: ["frontier-wave3", "drug class", "CTLA4 Ig", "CD80", "CD86", "CD28", "belatacept", "abatacept", "costimulation"]
    },
    {
      name: "Transplant induction antibodies",
      generic: "transplant induction antibodies",
      aliases: ["kidney transplant induction agents", "transplant induction immunosuppression", "basiliximab versus antithymocyte globulin"],
      class: "Peri-transplant T-cell-directed induction biologic class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Basiliximab", "Rabbit antithymocyte globulin"],
      usedToTreat: "Perioperative prevention of kidney-allograft rejection; rabbit antithymocyte globulin also treats acute kidney-transplant rejection under the labeled regimen.",
      description: "Transplant induction antibodies suppress the intense early T-cell response around transplantation, but basiliximab and rabbit antithymocyte globulin are not interchangeable versions of one treatment. Basiliximab is a nondepleting monoclonal antibody that blocks CD25, the high-affinity IL-2 receptor alpha chain on activated T cells; rabbit antithymocyte globulin is a polyclonal antibody mixture that binds many T-cell surface proteins and rapidly depletes or functionally alters circulating T cells.",
      mechanism: "Basiliximab competitively prevents IL-2 from signaling through high-affinity IL-2 receptors without broadly reducing lymphocyte counts. Rabbit ATG coats multiple T-cell antigens, producing complement- and Fc-mediated depletion, opsonization, apoptosis, and altered activation/trafficking. The stronger depletion of ATG also brings greater cytokine-release, cytopenia, serum-sickness, infection, and malignancy burden.",
      boxedWarning: "Basiliximab carries a boxed requirement for experienced transplant supervision and adequately equipped facilities. Current rabbit Thymoglobulin labeling has no boxed warning, but anaphylaxis, severe infusion-associated cytokine release, leukopenia, thrombocytopenia, infection, and malignancy require immediate preparedness and dose decisions.",
      nursingEssentials: ["Verify the exact induction agent, species, dose, premedication, infusion duration, line/filter requirements, CBC thresholds, and transplant protocol.", "Monitor airway, blood pressure, temperature, oxygenation, rash, rigors, cytokine-release physiology, WBC/platelets, infection, and delayed serum-sickness symptoms."],
      keyLabs: ["CBC with differential/platelets, vital signs and oxygenation during infusion, renal/graft function, infection studies, and protocol-specific lymphocyte or viral monitoring."],
      nclexTraps: ["Basiliximab blocks activated T-cell proliferation without depleting all circulating T cells.", "Rabbit Thymoglobulin and equine ATGAM differ in source, antigen profile, indication, and dosing and must not be substituted."],
      tags: ["frontier-wave3", "drug class", "transplant induction", "basiliximab", "antithymocyte globulin", "CD25", "T cell depletion"]
    },
    {
      name: "Antithymocyte globulin",
      generic: "antithymocyte globulin",
      aliases: ["ATG", "anti thymocyte globulin", "thymocyte immune globulin", "polyclonal T cell depleting globulin"],
      class: "Species-specific polyclonal anti-lymphocyte immune-globulin class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Rabbit antithymocyte globulin", "Equine antithymocyte globulin"],
      usedToTreat: "Rabbit ATG prevents or treats acute kidney-allograft rejection; equine ATGAM treats renal-allograft rejection and moderate-to-severe aplastic anemia in patients unsuitable for bone-marrow transplantation.",
      description: "Antithymocyte globulin (ATG) refers to species-specific polyclonal IgG mixtures that bind many lymphocyte surface proteins and deplete or functionally silence T cells through complement, Fc-mediated clearance, apoptosis, altered signaling, and anergy. The source animal is not a minor formulation detail: rabbit Thymoglobulin and equine ATGAM have different antibody populations, potency, labeled indications, dose units, infusion procedures, skin-testing expectations, and boxed-warning status; both can cause cytokine release, cytopenias, infection, and delayed serum sickness and must never be substituted.",
      mechanism: "Both products coat broad lymphocyte antigen sets rather than one receptor. Rabbit ATG is strongly T-cell depleting and also changes adhesion, trafficking, and activation. Equine ATG depletes circulating lymphocytes, mainly T cells, through complement-dependent lysis and activation-induced apoptosis and may induce partial activation/anergy; in aplastic anemia, removal of immune attack permits hematopoietic recovery and growth-factor signaling.",
      boxedWarning: "Species-specific warning context is essential. ATGAM carries a boxed warning for potentially life-threatening IV anaphylaxis and requires monitoring during infusion and for at least 24 hours afterward; skin testing is strongly recommended but cannot eliminate risk. Current Thymoglobulin labeling has no boxed warning, yet severe anaphylaxis and cytokine-release physiology still require immediate emergency readiness.",
      nursingEssentials: ["Stop at an order that says only ATG: verify rabbit versus equine product, indication, dose in mg/kg, planned days, premedication, skin-test policy, line/filter, infusion duration, and rescue resources.", "Monitor airway, oxygenation, hemodynamics, fever/rigors, rash, CBC/platelets, infection, liver/renal function, and delayed serum sickness; avoid live vaccines and follow product-specific cytopenia hold rules."],
      keyLabs: ["CBC with differential/platelets, renal and liver function, infection/viral monitoring, graft function or aplastic-anemia marrow response, and continuous/serial vital signs around infusion."],
      nclexTraps: ["ATG is not one interchangeable drug: always identify the source animal and brand.", "Skin testing can identify some equine-protein risk but a negative test does not guarantee freedom from anaphylaxis."],
      tags: ["frontier-wave3", "drug class", "antithymocyte globulin", "ATG", "rabbit", "equine", "Thymoglobulin", "ATGAM", "T cell depletion"]
    },
    {
      name: "IL-23 p19 inhibitors",
      generic: "il 23 p19 inhibitors",
      aliases: ["IL-23 p19 antagonists", "interleukin 23 p19 inhibitors", "p19 biologics"],
      class: "Interleukin-23 p19-subunit antagonist monoclonal-antibody class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Risankizumab", "Guselkumab", "Tildrakizumab"],
      usedToTreat: "Product-specific plaque psoriasis, psoriatic arthritis, Crohn disease, ulcerative colitis, and related IL-23/Th17-driven inflammatory disease indications.",
      description: "IL-23 p19 inhibitors bind the p19 subunit unique to IL-23 and prevent IL-23-receptor signaling, reducing maintenance and pathogenic activity of Th17-lineage cells and downstream IL-17A, IL-17F, IL-22, cytokine, and chemokine signaling. They spare IL-12 because IL-12 uses p35 plus the shared p40 subunit; that molecular distinction separates p19-selective drugs from ustekinumab, which binds shared p40 and blocks both IL-12 and IL-23.",
      mechanism: "Neutralizing IL-23 p19 interrupts receptor-driven JAK2/TYK2-STAT3/STAT4 signaling that supports Th17 survival and effector cytokine production. Risankizumab, guselkumab, and tildrakizumab share the target but differ in approved diseases, route/induction schedule, dosing interval, and hepatic-monitoring requirements in inflammatory bowel disease contexts.",
      boxedWarning: "No shared boxed warning defines this class. Screen for infection and tuberculosis, update nonlive vaccines before therapy, avoid live vaccines during treatment, and follow product-specific liver-test monitoring for inflammatory-bowel-disease regimens. Serious hypersensitivity and infection require prompt evaluation.",
      nursingEssentials: ["Confirm p19-selective versus p40 blockade and the exact product-specific disease/induction/maintenance schedule.", "Assess TB and infection risk, vaccination status, liver tests where required, injection or infusion reaction, and objective skin, joint, or bowel response."],
      keyLabs: ["TB screening, liver tests for product/indication-specific regimens, infection evaluation, and disease-response markers such as skin assessment, CRP, stool markers, or endoscopy when ordered."],
      nclexTraps: ["p19-selective inhibition blocks IL-23 but not IL-12.", "A drug ending in -kizumab is not enough to identify the target; risankizumab/guselkumab/tildrakizumab target IL-23 p19, while different biologics target IL-17 or other pathways."],
      tags: ["frontier-wave3", "drug class", "IL-23", "p19", "Th17", "risankizumab", "guselkumab", "tildrakizumab"]
    },
    {
      name: "IL-17 pathway inhibitors",
      generic: "il 17 pathway inhibitors",
      aliases: ["IL-17 inhibitors", "interleukin 17 antagonists", "IL-17 biologics"],
      class: "Interleukin-17 ligand or receptor antagonist biologic class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Secukinumab", "Ixekizumab", "Brodalumab", "Bimekizumab"],
      usedToTreat: "Product-specific plaque psoriasis, psoriatic arthritis, axial spondyloarthritis, and hidradenitis suppurativa indications.",
      description: "IL-17 pathway inhibitors reduce neutrophil-recruiting and epithelial inflammatory signaling, but their subclasses matter. Secukinumab and ixekizumab neutralize IL-17A, bimekizumab neutralizes IL-17A and IL-17F including the A/F heterodimer, and brodalumab blocks IL-17 receptor A so several IL-17-family cytokines cannot signal; broader pathway blockade changes the teaching clues and does not make the products interchangeable.",
      mechanism: "IL-17 cytokines bind receptor complexes containing IL-17RA, activating ACT1/NF-kappa-B and MAP-kinase pathways that induce chemokines, antimicrobial peptides, and neutrophilic inflammation. Ligand-directed antibodies remove selected cytokines, whereas brodalumab blocks the shared receptor component used by IL-17A, F, C, A/F, and IL-25.",
      boxedWarning: "Brodalumab carries a boxed warning for suicidal ideation and behavior and requires the SILIQ REMS program. Other class members do not share that box. Across the pathway, evaluate infection/TB risk, avoid live vaccines, monitor mucocutaneous Candida, and use caution with inflammatory bowel disease because new or worsened IBD can occur.",
      nursingEssentials: ["Identify ligand target versus receptor target and never transfer brodalumab's REMS or dosing rules to another IL-17 drug.", "Monitor mood and suicidality for brodalumab, candidiasis and infection for the class, bowel symptoms suggesting IBD, vaccination status, and disease-specific response."],
      keyLabs: ["TB screening, infection evaluation, liver tests when clinically indicated, and disease-specific skin/joint/bowel assessment; there is no universal serum IL-17 target level."],
      nclexTraps: ["Bimekizumab blocks both IL-17A and IL-17F; brodalumab blocks the receptor rather than one ligand.", "Brodalumab's boxed suicidality warning is drug-specific, not a class-wide boxed warning."],
      tags: ["frontier-wave3", "drug class", "IL-17", "IL-17A", "IL-17F", "IL-17RA", "brodalumab", "bimekizumab"]
    },
    {
      name: "Terminal complement C5 inhibitors",
      generic: "terminal complement c5 inhibitors",
      aliases: ["C5 complement inhibitors", "terminal complement inhibitors", "C5 monoclonal antibodies"],
      class: "Terminal complement C5 cleavage inhibitor monoclonal-antibody class",
      entryType: "drug-class-card",
      classCard: true,
      isDrugClassCard: true,
      classExampleNames: ["Eculizumab", "Ravulizumab"],
      usedToTreat: "Product-specific paroxysmal nocturnal hemoglobinuria, complement-mediated atypical HUS, anti-AChR-positive generalized myasthenia gravis, and anti-AQP4-positive neuromyelitis optica spectrum disorder.",
      description: "Terminal complement C5 inhibitors bind C5 and prevent its cleavage into inflammatory C5a and C5b, so C5b cannot initiate the C5b-9 membrane-attack complex. This stops terminal-complement intravascular hemolysis or tissue injury but also removes a critical defense against Neisseria, making meningococcal sepsis or meningitis possible even after appropriate vaccination; ravulizumab is engineered for a much longer dosing interval than eculizumab.",
      mechanism: "High-affinity C5 binding prevents generation of C5a and C5b while leaving earlier complement functions relatively intact. Blocking C5b-9 protects PNH red cells, limits complement-mediated TMA in aHUS, and reduces terminal-complement injury at the neuromuscular junction or in AQP4-IgG-positive NMOSD. Plasma exchange, plasmapheresis, or IVIG can alter exposure and may require supplemental dosing.",
      boxedWarning: "Eculizumab and ravulizumab carry boxed warnings for life-threatening or fatal meningococcal infection and are restricted through the ULTOMIRIS and SOLIRIS REMS. Complete or update MenACWY and MenB vaccination according to current ACIP guidance at least 2 weeks before therapy when possible; urgent starts require label-directed antibacterial prophylaxis. Vaccination does not eliminate risk, so suspected infection requires immediate evaluation and treatment.",
      nursingEssentials: ["Verify REMS requirements, meningococcal vaccination/prophylaxis, unresolved infection status, exact weight-based product schedule, and supplemental-dose rules around plasma exchange or IVIG.", "Teach fever, headache, neck stiffness, photophobia, rash, myalgia, confusion, or rapid decline as an emergency even in a vaccinated patient; also monitor for relapse or hemolysis/TMA after interruption."],
      keyLabs: ["CBC, LDH, bilirubin, reticulocytes, haptoglobin and PNH markers when relevant; platelets, creatinine and hemolysis/TMA studies for aHUS; vaccination records and immediate cultures/evaluation for suspected meningococcal disease."],
      nclexTraps: ["Meningococcal vaccination reduces but does not abolish the risk created by terminal-complement blockade.", "C5 inhibitors prevent membrane-attack-complex formation; they are not broad B-cell or T-cell suppressants."],
      tags: ["frontier-wave3", "drug class", "complement", "C5", "C5a", "C5b", "MAC", "eculizumab", "ravulizumab", "meningococcal"]
    },
    {
      name: "Tacrolimus",
      generic: "tacrolimus",
      aliases: ["FK506", "Prograf", "Astagraf XL", "Envarsus XR"],
      brandExamples: ["Prograf", "Astagraf XL", "Envarsus XR"],
      class: "FKBP12-binding calcineurin inhibitor immunosuppressant",
      usedToTreat: "Prevention of rejection after kidney, liver, heart, or lung transplantation under product- and protocol-specific immediate-release or extended-release regimens.",
      description: "Tacrolimus is a potent FKBP12-binding calcineurin inhibitor that keeps NFAT phosphorylated outside the nucleus, suppresses IL-2 and other cytokine transcription, and prevents T-cell activation after organ transplantation. Its narrow therapeutic index and CYP3A/P-gp metabolism make formulation, dose timing, trough concentration, renal function, potassium, magnesium, glucose, blood pressure, and interacting drugs inseparable from safe administration.",
      mechanism: "Tacrolimus enters lymphocytes and binds FKBP12. The tacrolimus-FKBP12 complex inhibits calcium/calmodulin-dependent calcineurin phosphatase, preventing NFAT dephosphorylation and nuclear entry; transcription of IL-2, interferon-gamma, and other activation signals falls, reducing T-cell proliferation and cytotoxic function.",
      boxedWarning: "Malignancies and serious infections: tacrolimus-induced immunosuppression increases susceptibility to lymphoma and other malignancies, especially skin cancer, and to bacterial, viral, fungal, protozoal, and opportunistic infections that may be fatal. Use only under experienced transplant supervision and maintain the lowest effective immunosuppressive exposure.",
      nursingEssentials: ["Verify the exact product and release form; immediate-release, once-daily extended-release products, granules, and IV tacrolimus are not freely interchangeable. Draw a true whole-blood trough immediately before the next dose and document dose time.", "Monitor creatinine/eGFR, urine output, potassium, magnesium, glucose, blood pressure, tremor/headache/confusion/seizure or PRES, infection, skin changes, QT risk, TMA, and CYP3A/P-gp interactions including grapefruit."],
      keyLabs: ["Whole-blood tacrolimus trough by product/protocol, creatinine/eGFR, potassium, magnesium, glucose/A1c, liver tests, CBC, blood pressure, ECG when indicated, and viral monitoring such as BK/CMV per transplant protocol."],
      nclexTraps: ["Tacrolimus nephrotoxicity and rejection can both raise creatinine; do not reflexively increase the dose without the transplant evaluation and a correctly timed level.", "Tremor, headache, confusion, visual change, or seizure can signal neurotoxicity/PRES even when a prior trough was acceptable."],
      sourceNote: "Curated from current U.S. PROGRAF/tacrolimus prescribing information (DailyMed, revised 2025/2026).",
      tags: ["frontier-wave3", "transplant", "calcineurin inhibitor", "FKBP12", "NFAT", "IL-2", "tacrolimus trough", "nephrotoxicity", "PRES"]
    },
    {
      name: "Cyclosporine",
      generic: "cyclosporine",
      aliases: ["ciclosporin", "Sandimmune", "Neoral", "Gengraf", "cyclosporine modified", "cyclosporine nonmodified"],
      brandExamples: ["Sandimmune", "Neoral", "Gengraf"],
      class: "Cyclophilin-binding calcineurin inhibitor immunosuppressant",
      usedToTreat: "Prevention of kidney, liver, or heart allograft rejection; modified microemulsion products also treat selected severe rheumatoid arthritis and recalcitrant plaque psoriasis.",
      description: "Cyclosporine is a cyclophilin-binding calcineurin inhibitor that prevents NFAT activation and IL-2 transcription, suppressing T-cell expansion in transplantation and selected autoimmune disease. Modified microemulsion and nonmodified formulations are not bioequivalent, so an unsupervised one-for-one switch can cause rejection from underexposure or nephrotoxicity, hypertension, neurotoxicity, and infection from overexposure.",
      mechanism: "Cyclosporine binds cytoplasmic cyclophilin; the complex inhibits calcineurin phosphatase, prevents NFAT dephosphorylation and nuclear translocation, and reduces transcription of IL-2 and other T-cell cytokines. It also constricts renal afferent arterioles, explaining an exposure-related fall in GFR that can be functional early and structurally nephrotoxic with sustained injury.",
      boxedWarning: "Boxed warning context is formulation and indication specific: cyclosporine requires experienced immunosuppressive supervision, blood-level and organ-toxicity monitoring, and protection against inappropriate interchange of modified and nonmodified products. Chronic immunosuppression increases malignancy and serious-infection risk; modified-product use for rheumatoid arthritis or psoriasis adds prominent nephrotoxicity and hypertension restrictions.",
      nursingEssentials: ["Read the full product name and MODIFIED status, verify dose time, use the protocol's trough target and assay, and keep administration consistent in relation to food. Never substitute Sandimmune-type and modified products without a conversion and monitoring plan.", "Trend creatinine/eGFR, blood pressure, potassium, magnesium, lipids, liver tests, tremor/seizure/PRES, gingival hyperplasia, hirsutism, infection, skin cancer, CYP3A/P-gp interactions, and grapefruit exposure."],
      keyLabs: ["Whole-blood cyclosporine trough or protocol-specified concentration, creatinine/eGFR, potassium, magnesium, liver tests, fasting lipids, CBC, uric acid when indicated, and blood pressure."],
      nclexTraps: ["Neoral/Gengraf-type modified cyclosporine and Sandimmune-type nonmodified cyclosporine are not bioequivalent despite sharing the generic name.", "Gingival hyperplasia and hirsutism point toward cyclosporine, while diabetes is a more prominent tacrolimus clue; both can be nephrotoxic."],
      sourceNote: "Curated from current U.S. cyclosporine and cyclosporine MODIFIED prescribing information (DailyMed, revised 2025/2026).",
      tags: ["frontier-wave3", "transplant", "calcineurin inhibitor", "cyclophilin", "NFAT", "modified formulation", "nephrotoxicity", "gingival hyperplasia", "hirsutism"]
    },
    {
      name: "Sirolimus",
      generic: "sirolimus",
      aliases: ["rapamycin", "Rapamune"],
      brandExamples: ["Rapamune"],
      class: "FKBP12-bound mTOR complex 1 inhibitor immunosuppressant",
      usedToTreat: "Prevention of organ rejection in kidney-transplant recipients under protocol-specific regimens and treatment of lymphangioleiomyomatosis.",
      description: "Sirolimus is an FKBP12-binding mTORC1 inhibitor that blocks cytokine-driven protein synthesis and G1-to-S lymphocyte proliferation without inhibiting calcineurin. That distinction explains why it can reduce calcineurin exposure yet creates a different toxicity pattern dominated by delayed wound and anastomotic healing, mouth ulcers, hyperlipidemia, cytopenias, proteinuria, edema, lymphocele, infection, and noninfectious pneumonitis.",
      mechanism: "The sirolimus-FKBP12 complex inhibits mTOR complex 1 and downstream p70 S6 kinase/ribosomal S6 signaling. Activated T and B cells can still receive IL-2 signals, but they cannot translate those growth signals into normal protein synthesis, cell-cycle progression, and clonal proliferation; smooth-muscle and endothelial growth are also inhibited.",
      boxedWarning: "Immunosuppression increases susceptibility to serious infection and lymphoma or other malignancy. Sirolimus is not recommended in liver transplantation because excess mortality, graft loss, and hepatic-artery thrombosis occurred, and it is not recommended in lung transplantation because bronchial-anastomotic dehiscence, including fatal events, occurred.",
      nursingEssentials: ["Obtain protocol-timed whole-blood troughs and verify loading, maintenance, cyclosporine separation, CYP3A/P-gp interactions, and grapefruit avoidance.", "Inspect surgical wounds and anastomotic healing; monitor mouth ulcers, edema/lymphocele, CBC, lipids, urine protein, renal/liver function, infection, thrombotic microangiopathy, and new cough/dyspnea suggesting pneumonitis."],
      keyLabs: ["Whole-blood sirolimus trough, CBC/platelets, fasting lipids, creatinine/eGFR, urine protein, liver tests, glucose, and pulmonary evaluation for new respiratory symptoms."],
      nclexTraps: ["Sirolimus binds FKBP12 but does not inhibit calcineurin; it inhibits mTORC1 downstream of cytokine signaling.", "Its antiproliferative action can impair healing, so an apparently clean surgical incision does not remove concern for deeper anastomotic or lymphatic complications."],
      sourceNote: "Curated from current U.S. RAPAMUNE prescribing information (DailyMed, revised 2026).",
      tags: ["frontier-wave3", "transplant", "mTOR inhibitor", "mTORC1", "FKBP12", "sirolimus trough", "wound healing", "pneumonitis", "LAM"]
    },
    {
      name: "Everolimus",
      generic: "everolimus",
      aliases: ["Zortress", "Afinitor", "Afinitor Disperz"],
      brandExamples: ["Zortress", "Afinitor", "Afinitor Disperz"],
      class: "FKBP12-bound mTOR complex 1 inhibitor with transplant and antineoplastic products",
      usedToTreat: "Zortress with reduced calcineurin-inhibitor exposure after selected kidney or liver transplantation; Afinitor products for specified cancers, tuberous-sclerosis-complex tumors, and TSC-associated seizures.",
      description: "Everolimus is an FKBP12-binding mTORC1 inhibitor that suppresses p70 S6 kinase signaling, protein synthesis, angiogenesis, and cytokine-driven lymphocyte or tumor-cell proliferation. Zortress is a trough-guided transplant immunosuppressant, whereas Afinitor products use disease-specific oncology or TSC schedules; treating those brand contexts as interchangeable creates serious dosing, monitoring, and warning errors.",
      mechanism: "Everolimus binds FKBP12 and the complex inhibits mTORC1, reducing phosphorylation of p70 S6 kinase and ribosomal S6 protein. In transplantation this limits cytokine-driven T- and B-cell proliferation; in susceptible tumors it reduces growth, metabolism, angiogenic signaling, and cell-cycle progression. It does not directly inhibit calcineurin.",
      boxedWarning: "Zortress boxed warnings include malignancies and serious infections, kidney-allograft thrombosis, nephrotoxicity when used with standard cyclosporine exposure, and increased mortality in heart transplantation; liver-transplant dosing must not begin before the labeled postoperative interval. Afinitor products have a different non-boxed oncology/TSC warning framework, so verify the product before applying safety rules.",
      nursingEssentials: ["Confirm Zortress versus Afinitor/Disperz, indication, formulation, dose, schedule, food consistency, trough target if transplant, reduced calcineurin partner, and CYP3A/P-gp interactions.", "Monitor CBC, renal function, urine protein, lipids, glucose, liver tests, mouth ulcers, wound healing, edema, infection, noninfectious pneumonitis, metabolic toxicity, embryo-fetal risk, and graft thrombosis in the early kidney-transplant period."],
      keyLabs: ["Everolimus whole-blood trough for Zortress, calcineurin-inhibitor level, CBC, creatinine/eGFR, urine protein, fasting lipids, glucose/A1c, liver tests, and pulmonary evaluation for new respiratory symptoms."],
      nclexTraps: ["Zortress and Afinitor contain everolimus but are not interchangeable clinical regimens.", "A mouth ulcer plus cough and diffuse infiltrates can represent mTOR toxicity, but infection must be excluded urgently in an immunosuppressed patient."],
      sourceNote: "Curated from current U.S. ZORTRESS and AFINITOR prescribing information (DailyMed, revised 2026).",
      tags: ["frontier-wave3", "transplant", "oncology", "mTOR inhibitor", "mTORC1", "FKBP12", "Zortress", "Afinitor", "pneumonitis"]
    },
    {
      name: "Mycophenolic acid",
      generic: "mycophenolic acid",
      aliases: ["mycophenolate sodium", "Myfortic", "MPA", "delayed release mycophenolate sodium"],
      brandExamples: ["Myfortic"],
      class: "Reversible inosine monophosphate dehydrogenase inhibitor antimetabolite immunosuppressant",
      usedToTreat: "Prevention of kidney-allograft rejection in combination with cyclosporine and corticosteroids in adult and pediatric transplant recipients under labeled criteria.",
      description: "Mycophenolic acid is a reversible, uncompetitive IMP dehydrogenase inhibitor that depletes guanosine nucleotides and selectively suppresses T- and B-lymphocyte proliferation because activated lymphocytes depend heavily on de novo purine synthesis. Myfortic delayed-release mycophenolate sodium delivers this active acid differently from mycophenolate mofetil, so the products cannot be substituted milligram for milligram despite converging on the same metabolite.",
      mechanism: "Mycophenolic acid preferentially inhibits type II IMPDH, blocking conversion of inosine monophosphate toward guanosine monophosphate. T and B cells have limited ability to rescue guanine through salvage pathways, so DNA/RNA synthesis, clonal expansion, antibody production, and lymphocyte adhesion fall while many other cells can rely more on salvage synthesis.",
      boxedWarning: "Embryo-fetal toxicity, malignancies, and serious infections: first-trimester exposure increases pregnancy loss and congenital-malformation risk; therapeutic immunosuppression increases lymphoma/skin-cancer and severe bacterial, viral, fungal, protozoal, and opportunistic infection risk. Follow pregnancy testing, contraception, counseling, and registry requirements and use experienced transplant supervision.",
      nursingEssentials: ["Verify Myfortic/mycophenolate sodium rather than mycophenolate mofetil, swallow delayed-release tablets intact, and avoid unsupervised product substitution. Review antacids, bile-acid sequestrants, and other drugs that alter absorption or enterohepatic recycling.", "Trend CBC, infection including CMV/BK and opportunistic disease, GI ulceration/bleeding/perforation, renal/liver function, pregnancy prevention, skin surveillance, pure red cell aplasia, and unexplained neurologic change suggesting PML."],
      keyLabs: ["Pregnancy testing per labeling, CBC with differential/platelets, creatinine/eGFR, liver tests, graft function, and protocol-specific CMV/BK or other viral monitoring."],
      nclexTraps: ["Myfortic is delayed-release mycophenolic acid, not a milligram-for-milligram substitute for CellCept/mycophenolate mofetil.", "Severe diarrhea can be drug toxicity, infection, or both; do not simply suppress symptoms without transplant-team assessment."],
      sourceNote: "Curated from current U.S. MYFORTIC prescribing information (DailyMed, revised 2025).",
      tags: ["frontier-wave3", "transplant", "mycophenolic acid", "mycophenolate sodium", "IMPDH", "purine", "pregnancy", "CMV", "BK virus"]
    },
    {
      name: "Azathioprine",
      generic: "azathioprine",
      aliases: ["Imuran", "Azasan", "AZA"],
      brandExamples: ["Imuran", "Azasan"],
      class: "6-mercaptopurine prodrug and thiopurine antimetabolite immunosuppressant",
      usedToTreat: "Adjunct prevention of renal-allograft rejection and treatment of active rheumatoid arthritis; additional specialist uses are off-label and require disease-specific evidence and monitoring.",
      description: "Azathioprine is a thiopurine prodrug converted to 6-mercaptopurine and then 6-thioguanine nucleotides that inhibit purine synthesis and enter DNA, suppressing proliferating T and B lymphocytes. TPMT and NUDT15 inactivate toxic metabolites, while xanthine oxidase clears 6-MP; deficient enzymes or inhibition by allopurinol/febuxostat can convert an ordinary dose into severe or fatal pancytopenia.",
      mechanism: "Sulfhydryl-mediated conversion releases 6-MP, which HGPRT and downstream enzymes activate to 6-thioguanine nucleotides. These metabolites inhibit de novo purine pathways and incorporate into DNA, disrupting replication and lymphocyte expansion. TPMT methylation, NUDT15 hydrolysis, and xanthine-oxidase oxidation determine active-metabolite burden.",
      boxedWarning: "Malignancy: chronic azathioprine immunosuppression increases human malignancy risk, including post-transplant lymphoma and skin cancer; fatal hepatosplenic T-cell lymphoma has occurred especially in adolescents or young adults with inflammatory bowel disease, sometimes with a TNF blocker. Counsel about this risk, mutagenic potential, hematologic toxicity, and sun protection.",
      nursingEssentials: ["Obtain and trend CBC exactly as ordered; evaluate TPMT/NUDT15 risk but never treat a normal genotype as permission to skip blood counts. Hold and escalate rapid or persistent leukopenia, thrombocytopenia, anemia, fever, bleeding, or infection.", "Identify allopurinol and febuxostat before administration: allopurinol generally requires major azathioprine reduction under specialist direction, while febuxostat coadministration is not recommended. Monitor pancreatitis, hepatotoxicity, PML symptoms, pregnancy, and skin cancer."],
      keyLabs: ["CBC with differential/platelets weekly early then at label- and protocol-specified intervals, liver tests, renal function, TPMT/NUDT15 genotype or phenotype when indicated, and infection/pregnancy assessment."],
      nclexTraps: ["TPMT/NUDT15 testing predicts only part of risk and cannot replace serial CBC monitoring.", "Allopurinol blocks a 6-MP inactivation route and can markedly increase thiopurine toxicity; febuxostat is generally avoided with azathioprine."],
      sourceNote: "Curated from current U.S. AZATHIOPRINE prescribing information (DailyMed, updated 2026).",
      tags: ["frontier-wave3", "transplant", "thiopurine", "6 mercaptopurine", "6 TGN", "TPMT", "NUDT15", "allopurinol", "myelosuppression"]
    },
    {
      name: "Rabbit antithymocyte globulin",
      generic: "rabbit antithymocyte globulin",
      aliases: ["antithymocyte globulin rabbit", "rabbit ATG", "rATG", "Thymoglobulin", "anti thymocyte globulin"],
      brandExamples: ["Thymoglobulin"],
      class: "Polyclonal rabbit anti-human T-lymphocyte IgG immune globulin",
      usedToTreat: "Prophylaxis and treatment of acute rejection in kidney-transplant recipients as part of a concomitant immunosuppressive regimen.",
      description: "Rabbit antithymocyte globulin is a polyclonal rabbit IgG preparation raised against human thymocytes that binds many T-cell antigens, rapidly depletes circulating T lymphocytes, and modulates activation, adhesion, trafficking, and cytotoxic function. Its broad depletion makes it useful for kidney-transplant induction or rejection treatment but also produces infusion cytokine release, leukopenia, thrombocytopenia, serum sickness, infection, and malignancy risk that is very different from nondepleting basiliximab.",
      mechanism: "Antibodies recognize multiple T-cell surface proteins including CD2, CD3, CD4, CD8, CD11a/CD18, CD25, CD44, CD45, and HLA molecules. Opsonization, complement activation, Fc-receptor-mediated clearance, apoptosis, and altered signaling/trafficking remove or disable T cells; circulating counts can fall within a day even though tissue immune effects are more complex.",
      boxedWarning: "High-yield warning context: current Thymoglobulin labeling has no boxed warning. Treat anaphylaxis and severe infusion-associated cytokine release as immediate emergencies; stop the infusion, support airway/hemodynamics, and follow protocol. Leukopenia, thrombocytopenia, infection, malignancy, serum sickness, and immunization limitations require ongoing surveillance.",
      nursingEssentials: ["Verify rabbit-protein history, product identity, dose, premedication, test or protocol requirements, high-flow vein or central access, inline filter, infusion duration, and emergency medications. Thymoglobulin is not interchangeable with equine ATGAM.", "Monitor vital signs and oxygenation closely during infusion; distinguish rigors/fever from evolving cytokine-release or anaphylaxis, and use WBC/platelet thresholds for dose reduction or interruption exactly as ordered."],
      keyLabs: ["CBC with differential/platelets before and during therapy, renal/graft function, infection studies, liver tests, and protocol-specific lymphocyte, CMV, EBV, BK, or other viral monitoring."],
      nclexTraps: ["Rabbit ATG depletes T cells; basiliximab blocks CD25 signaling without comparable broad depletion.", "A delayed fever, rash, arthralgia, and renal change days after exposure can be serum sickness rather than an immediate infusion reaction."],
      sourceNote: "Curated from current U.S. THYMOGLOBULIN prescribing information (DailyMed, revised 2026).",
      tags: ["frontier-wave3", "transplant", "antithymocyte globulin", "rabbit ATG", "Thymoglobulin", "T cell depletion", "cytokine release", "serum sickness"]
    },
    {
      name: "Equine antithymocyte globulin",
      generic: "equine antithymocyte globulin",
      aliases: ["equine thymocyte immune globulin", "ATGAM", "horse ATG", "anti thymocyte globulin equine"],
      brandExamples: ["ATGAM"],
      class: "Polyclonal equine anti-human lymphocyte IgG immune globulin",
      usedToTreat: "Management of renal-allograft rejection and treatment of moderate-to-severe aplastic anemia in patients unsuitable for bone-marrow transplantation, with concomitant immunosuppression and specialist supervision.",
      description: "Equine antithymocyte globulin (ATGAM) is a polyclonal horse IgG preparation that binds numerous lymphocyte and marrow-cell proteins, depletes circulating lymphocytes most strongly among T cells, and can induce T-cell anergy. It differs fundamentally from rabbit Thymoglobulin: ATGAM also has a labeled aplastic-anemia role and carries a boxed anaphylaxis warning requiring infusion monitoring and continued observation for at least 24 hours.",
      mechanism: "ATGAM antibodies bind a broad set of proteins on lymphocytes as well as granulocytes, platelets, marrow cells, and other targets. Complement-dependent lysis and activation-induced apoptosis deplete lymphocytes, while partial activation can produce T-cell anergy. In aplastic anemia, suppressing pathogenic immune attack permits marrow recovery; ATGAM may also stimulate hematopoietic stem-cell growth and release of IL-3 and GM-CSF.",
      boxedWarning: "Anaphylaxis: IV ATGAM can cause potentially life-threatening anaphylaxis. Skin testing before treatment is strongly recommended to identify patients at greatest risk, but it does not eliminate risk. Monitor during infusion and for at least 24 hours afterward; discontinue immediately and provide emergency treatment if anaphylaxis develops.",
      nursingEssentials: ["Confirm equine product and indication, prior equine-protein anaphylaxis, skin-test result and limitations, premedication, IV-only dilution, inline filter, infusion duration, concomitant immunosuppression, and emergency readiness. Never substitute rabbit ATG by dose conversion.", "Monitor cytokine-release and infusion reactions, serum sickness, infection including CMV/EBV/HSV, platelets/neutrophils, renal/liver function, and aplastic-anemia blood-count or renal-graft response; avoid live vaccines."],
      keyLabs: ["CBC with differential/platelets, reticulocyte count and marrow-response studies for aplastic anemia, renal and liver function, graft function, infection cultures/viral monitoring, and serial vital signs/oxygenation during and after infusion."],
      nclexTraps: ["ATGAM is equine and Thymoglobulin is rabbit; species changes the product, dose, indication, and warning framework.", "The aplastic-anemia indication is for patients unsuitable for bone-marrow transplantation and does not replace transplant evaluation when curative transplantation is appropriate."],
      sourceNote: "Curated from current U.S. ATGAM prescribing information (DailyMed, revised 2023/2024).",
      tags: ["frontier-wave3", "transplant", "aplastic anemia", "equine ATG", "ATGAM", "T cell depletion", "anaphylaxis", "serum sickness"]
    },
    {
      name: "Belatacept",
      generic: "belatacept",
      aliases: ["Nulojix", "CTLA4 Ig transplant"],
      brandExamples: ["Nulojix"],
      class: "High-avidity CTLA4-Ig CD80/CD86 T-cell costimulation blocker",
      usedToTreat: "Prevention of organ rejection in EBV-seropositive adult kidney-transplant recipients with basiliximab induction, mycophenolate mofetil, and corticosteroids under the labeled regimen.",
      description: "Belatacept is a CTLA4-Ig biologic fusion protein that binds CD80 and CD86 on antigen-presenting cells, blocks their interaction with CD28, and prevents the second signal required for full T-cell activation in kidney transplantation. Its renal-sparing lack of direct calcineurin nephrotoxicity does not make it low risk: EBV-negative or unknown patients face unacceptable post-transplant lymphoproliferative disorder (PTLD) risk, especially in the central nervous system.",
      mechanism: "Belatacept combines the extracellular domain of CTLA4 with a modified human IgG1 Fc region and has substitutions that increase binding to CD80/CD86. Blocking CD28 costimulation lowers IL-2 production, proliferation, cytokine signaling, and T-cell help to B cells while leaving the first antigen-specific T-cell-receptor signal intact.",
      boxedWarning: "Post-transplant lymphoproliferative disorder (PTLD), predominantly involving the CNS, occurs more often with belatacept. Use only in EBV-seropositive recipients; EBV-seronegative or unknown status is contraindicated. Other malignancies and serious infections can occur, only experienced transplant clinicians should prescribe it, and use in liver transplantation is not recommended because graft loss and death increased. Monitor new headache, confusion, personality or cognitive change, focal deficit, seizure, or declining consciousness and urgently escalate suspected CNS PTLD or PML for transplant and neurologic evaluation.",
      nursingEssentials: ["Document EBV seropositivity before the first dose and verify the kidney-transplant schedule, infusion timing, companion immunosuppression, basiliximab induction, and CMV/PJP prophylaxis. Do not improvise use for another transplanted organ.", "Monitor graft function and acute rejection, neurologic/cognitive/behavioral changes suggesting CNS PTLD or PML, fever/infection, CMV, BK, TB, malignancy, and infusion reaction. Conversion from a calcineurin inhibitor can increase rejection risk and requires transplant-team control."],
      keyLabs: ["EBV serology before therapy, creatinine/eGFR and graft assessment, CBC/CMP, TB screening, CMV/BK and other protocol-specific viral monitoring, and evaluation for PTLD/PML when symptoms arise."],
      nclexTraps: ["EBV vaccination does not exist; the gate is documented prior EBV exposure/seropositivity, not a vaccine record.", "Belatacept blocks costimulation rather than depleting T cells, and it is not a routine substitute for tacrolimus in any patient with kidney dysfunction."],
      sourceNote: "Curated from current U.S. NULOJIX prescribing information (DailyMed, revised 2025/2026).",
      tags: ["frontier-wave3", "transplant", "belatacept", "CTLA4 Ig", "CD80", "CD86", "CD28", "EBV", "PTLD", "kidney transplant"]
    },
    {
      name: "Voclosporin",
      generic: "voclosporin",
      aliases: ["Lupkynis"],
      brandExamples: ["Lupkynis"],
      class: "FKBP-binding calcineurin inhibitor immunosuppressant for lupus nephritis",
      usedToTreat: "Adult active lupus nephritis in combination with background immunosuppressive therapy, typically mycophenolate mofetil and corticosteroids; combination with cyclophosphamide is not established or recommended.",
      description: "Voclosporin is an oral calcineurin inhibitor for active lupus nephritis that suppresses calcineurin-NFAT signaling and T-cell cytokine transcription while also stabilizing podocyte cytoskeletal and filtration-barrier function. Unlike transplant tacrolimus or cyclosporine, safe use is organized around exact twice-daily empty-stomach dosing, serial eGFR percentage changes, blood pressure, potassium, QT and neurologic risk, and CYP3A interactions rather than routine transplant trough targets.",
      mechanism: "Voclosporin forms an immunophilin complex that inhibits calcineurin, preventing NFAT activation and reducing T-cell cytokine transcription. Calcineurin inhibition in podocytes also helps preserve synaptopodin and actin-cytoskeleton organization, reducing proteinuria, although the label notes that the complete molecular basis of voclosporin calcineurin suppression is not fully established.",
      boxedWarning: "Malignancies and serious infections: voclosporin and other immunosuppressants increase risk of lymphoma, skin and other malignancies, and serious bacterial, viral, fungal, protozoal, or opportunistic infections that may require hospitalization or cause death. Use the lowest effective immunosuppression, monitor infection and skin changes, and provide sun protection counseling.",
      nursingEssentials: ["Establish baseline eGFR and blood pressure; administer whole capsules on an empty stomach close to every 12 hours with at least 8 hours between doses. Follow label-defined eGFR reductions and reassessment intervals rather than guessing from one creatinine value.", "Contraindicate strong CYP3A4 inhibitors, reduce dose with moderate inhibitors, avoid strong/moderate inducers and grapefruit, and monitor nephrotoxicity, hypertension, potassium, tremor/seizure/PRES, QT/electrolytes, infection, skin cancer, and statin myopathy from OATP inhibition."],
      keyLabs: ["eGFR every 2 weeks for the first month, every 4 weeks through the first year, then quarterly; blood pressure, potassium, magnesium, CBC, liver tests, urine protein and lupus-nephritis response, ECG/electrolytes in high-risk patients."],
      nclexTraps: ["Do not add voclosporin to cyclophosphamide as though every lupus-nephritis regimen is interchangeable; that combination is not established and is not recommended.", "A fall in proteinuria does not excuse a sustained eGFR decline; nephrotoxicity rules can require dose reduction or discontinuation."],
      sourceNote: "Curated from current U.S. LUPKYNIS prescribing information (DailyMed, revised October 2025).",
      tags: ["frontier-wave3", "lupus nephritis", "calcineurin inhibitor", "NFAT", "podocyte", "eGFR", "CYP3A4", "nephrotoxicity", "proteinuria"]
    },
    {
      name: "Certolizumab pegol",
      generic: "certolizumab pegol",
      aliases: ["Cimzia", "certolizumab"],
      brandExamples: ["Cimzia"],
      class: "PEGylated Fc-free anti-TNF-alpha Fab fragment biologic",
      usedToTreat: "Moderate-to-severe Crohn disease, rheumatoid arthritis, polyarticular juvenile idiopathic arthritis, psoriatic arthritis, ankylosing spondylitis, nonradiographic axial spondyloarthritis, and moderate-to-severe plaque psoriasis under age- and regimen-specific criteria.",
      description: "Certolizumab pegol is a PEGylated humanized Fab fragment that binds and neutralizes soluble and membrane TNF-alpha but lacks the Fc region of a complete antibody, so it does not fix complement or produce Fc-mediated antibody-dependent cytotoxicity. PEGylation prolongs exposure, and the absent Fc is associated with negligible or low placental transfer in studied late-pregnancy exposures, but boxed infection/malignancy risk and the full TNF-blocker safety framework still apply.",
      mechanism: "The Fab binds TNF-alpha with high affinity and prevents TNF-receptor activation, lowering adhesion molecules, chemokines, IL-1, prostaglandins, nitric oxide, and leukocyte recruitment. It does not neutralize lymphotoxin-alpha/TNF-beta and, because it lacks Fc, does not trigger complement fixation, ADCC, monocyte/lymphocyte apoptosis, or neutrophil degranulation in vitro.",
      boxedWarning: "Serious infections and malignancy: TNF blockade increases risk of hospitalization or death from TB, bacterial sepsis, invasive fungal disease, and other opportunistic infections. Test and treat latent TB before therapy, monitor for active TB even after a negative baseline test, stop for serious infection or sepsis, and recognize that lymphoma and other malignancies, some fatal, have occurred in children and adolescents receiving TNF blockers.",
      nursingEssentials: ["Screen active/latent TB, hepatitis B, infection, malignancy history, heart failure, demyelinating disease, cytopenia, vaccination status, and concurrent biologic/JAK therapy before starting; avoid live vaccines and unsafe biologic combinations.", "Teach injection-site rotation and infection reporting; monitor new dyspnea/edema/weight gain, neurologic deficits, bruising/cytopenia, lupus-like symptoms, hypersensitivity, skin lesions, and HBV reactivation during and after therapy."],
      keyLabs: ["TB testing, hepatitis B serology, CBC, liver tests, infection studies as indicated, pregnancy counseling/registry discussion when relevant, and disease-response markers such as CRP or joint/skin/bowel assessment."],
      nclexTraps: ["Minimal placental transfer does not mean no fetal or neonatal considerations; weigh maternal disease, drug exposure, and live-vaccine timing with specialists.", "Certolizumab is Fc-free but is still a TNF blocker with boxed infection and malignancy warnings."],
      sourceNote: "Curated from current U.S. CIMZIA prescribing information (DailyMed, revised September 2025).",
      tags: ["frontier-wave3", "rheumatology", "TNF inhibitor", "TNF alpha", "PEGylated Fab", "Fc free", "Crohn disease", "placental transfer", "TB"]
    },
    {
      name: "Abatacept",
      generic: "abatacept",
      aliases: ["Orencia", "CTLA4 Ig"],
      brandExamples: ["Orencia"],
      class: "CTLA4-Ig CD80/CD86 selective T-cell costimulation modulator",
      usedToTreat: "Moderate-to-severe rheumatoid arthritis, polyarticular juvenile idiopathic arthritis, active psoriatic arthritis, and prophylaxis of acute GVHD with a calcineurin inhibitor plus methotrexate in specified unrelated-donor HSCT regimens.",
      description: "Abatacept is a CTLA4-Ig biologic fusion protein that binds CD80 and CD86 on antigen-presenting cells, blocks their interaction with CD28, and withholds the second signal required for full T-cell activation. It reduces T-cell proliferation and inflammatory cytokines without directly depleting T cells; route, age, indication, and schedule differ between weekly subcutaneous arthritis therapy, periodic IV arthritis therapy, and four-dose IV acute-GVHD prophylaxis.",
      mechanism: "The extracellular CTLA4 domain binds CD80/CD86 with greater avidity than CD28, preventing costimulatory signaling after antigen recognition. Incomplete activation reduces IL-2, TNF-alpha, interferon-gamma, clonal proliferation, and T-cell help that sustains autoimmune synovitis or donor-alloreactive responses.",
      boxedWarning: "High-yield warning context: current ORENCIA labeling has no boxed warning. Serious infection, anaphylaxis/hypersensitivity, blunted vaccine response, and increased respiratory adverse reactions in COPD require surveillance. Do not combine casually with TNF antagonists, other biologic DMARDs, or JAK inhibitors because serious infection increases without established benefit.",
      nursingEssentials: ["Screen TB, viral hepatitis, active/recurrent infection, vaccination status, COPD, and concurrent immunosuppression. Give live vaccines before therapy when appropriate and avoid them during treatment and for the labeled period after discontinuation.", "For HSCT GVHD prophylaxis, verify the transplant-day schedule and companion calcineurin inhibitor/methotrexate, monitor EBV reactivation and PTLD risk, provide institution-directed EBV prophylaxis, and monitor CMV infection/reactivation for 6 months."],
      keyLabs: ["TB and hepatitis screening, CBC/CMP, infection evaluation, inflammatory-disease response, and EBV/CMV monitoring in the HSCT prophylaxis setting; monitor glucose carefully with maltose-containing IV formulation and incompatible meters."],
      nclexTraps: ["Abatacept and belatacept share CTLA4-Ig costimulation blockade but have different indications and boxed-warning status.", "The IV abatacept vial contains maltose, which can falsely elevate readings on susceptible glucose dehydrogenase pyrroloquinolinequinone meters; use a glucose-specific method."],
      sourceNote: "Curated from current U.S. ORENCIA prescribing information (DailyMed, revised 2025/2026).",
      tags: ["frontier-wave3", "rheumatology", "GVHD", "abatacept", "CTLA4 Ig", "CD80", "CD86", "CD28", "costimulation", "EBV", "CMV"]
    }
  ];

  const classOverrides = new Map([
    ["basiliximab", "IL-2 receptor alpha (CD25) antagonist chimeric monoclonal antibody"],
    ["risankizumab", "IL-23 p19 antagonist humanized IgG1 monoclonal antibody"],
    ["guselkumab", "IL-23 p19 antagonist human IgG1-lambda monoclonal antibody"],
    ["tildrakizumab", "IL-23 p19 antagonist humanized IgG1-kappa monoclonal antibody"],
    ["brodalumab", "IL-17 receptor A antagonist human IgG2-kappa monoclonal antibody"],
    ["bimekizumab", "Dual IL-17A and IL-17F antagonist humanized IgG1 monoclonal antibody"],
    ["vedolizumab", "Gut-selective alpha4beta7 integrin antagonist humanized IgG1 monoclonal antibody"],
    ["belimumab", "Soluble BLyS/BAFF inhibitor human IgG1-lambda monoclonal antibody"],
    ["anifrolumab", "Type I interferon receptor subunit 1 (IFNAR1) antagonist human IgG1-kappa monoclonal antibody"],
    ["eculizumab", "Terminal complement C5 cleavage inhibitor humanized monoclonal antibody"],
    ["ravulizumab", "Long-acting terminal complement C5 cleavage inhibitor humanized monoclonal antibody"]
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
      tags: Array.from(new Set([...(existing.tags || []), "frontier-wave3", "precise immune subclass"])),
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
  db.pharmFrontierWave3ImmunePatch = {
    version: "2026-07-12-transplant-rheumatology-immune",
    promotedDrugCount: 12,
    subclassCardCount: 9,
    preciseClassOverrideCount: classOverrides.size,
    totalCardCount: cards.length
  };
  db.version = [db.version, "pharm-frontier-wave3-immune"].filter(Boolean).join("+");
}());
