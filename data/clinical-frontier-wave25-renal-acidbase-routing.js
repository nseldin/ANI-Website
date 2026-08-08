/* eslint-disable */
/* High-priority offline routing for renal physiology, kidney failure, dialysis, and acid-base reasoning. */
(function () {
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function"
    ? makeModelEnhancedResponse
    : null;
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function"
    ? highYieldDrugClueMatch
    : null;

  const VERSION = "2026-07-17-renal-acidbase-causal";
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const has = (raw, text, pattern) => pattern.test(raw) || pattern.test(text);

  const BASE_HIGH_YIELD_DEFERRALS = new Set([
    "SGLT2 cardiorenal pathway and euglycemic ketoacidosis",
    "Aspirin antiplatelet analgesic and salicylate-toxicity pathway",
    "Losartan",
    "Irbesartan",
    "Furosemide",
    "Acetazolamide"
  ].map(normalize));
  const shouldDeferToBaseHighYield = (input = "") => {
    if (!baseHighYieldDrugClueMatch) return false;
    const candidate = baseHighYieldDrugClueMatch(input);
    if (!candidate) return false;
    const label = typeof pharmDrugDisplayName === "function"
      ? pharmDrugDisplayName(candidate, "")
      : (candidate.displayName || candidate.name || candidate.generic || "");
    return BASE_HIGH_YIELD_DEFERRALS.has(normalize(label));
  };

  const TARGETS = {
    renalPhysiology: "Kidney functions and integrated renal physiology",
    nephron: "Nephron anatomy and segmental transport",
    filtrationBarrier: "Glomerular filtration barrier and proteinuria",
    renalHemodynamics: "Renal blood flow, GFR, filtration fraction, and autoregulation",
    tubuloglomerularFeedback: "Tubuloglomerular feedback",
    concentration: "Countercurrent multiplication and urine concentration",
    waterHandling: "ADH, osmolality, and free-water clearance",
    renalAcid: "Renal acid excretion and bicarbonate regeneration",
    endocrine: "Renal endocrine functions: renin, erythropoietin, and vitamin D",
    aki: "Acute kidney injury",
    prerenal: "Prerenal AKI",
    tubularInjury: "Acute tubular necrosis",
    intrinsicAki: "Intrinsic AKI",
    postrenal: "Postrenal AKI",
    urineIndices: "AKI urine sediment, FeNa, FeUrea, and limitations",
    ckd: "Chronic kidney disease",
    ckdRisk: "CKD GFR and albuminuria risk classification",
    kidneyFailure: "End-stage renal disease",
    uremia: "Uremia",
    ckdAnemia: "Anemia of chronic kidney disease",
    ckdMbd: "Chronic kidney disease-mineral and bone disorder",
    krt: "Kidney replacement therapy: indications and modality choice",
    hemodialysis: "Hemodialysis: diffusion, convection, ultrafiltration, and prescription",
    peritonealDialysis: "Peritoneal dialysis: exchanges, dwell, transport, and adequacy",
    crrt: "Continuous kidney replacement therapy",
    access: "Hemodialysis vascular access: fistula, graft, and catheter",
    accessThrombosis: "AV fistula thrombosis",
    accessInfection: "AV fistula infection",
    ultrafiltration: "Dialysis ultrafiltration, target weight, and volume management",
    dialysisHypotension: "Dialysis hypotension",
    disequilibrium: "Hemodialysis disequilibrium syndrome",
    pdPeritonitis: "Peritoneal dialysis peritonitis",
    diabeticNephropathy: "Diabetic nephropathy",
    acidBase: "Acid-base balance and the bicarbonate buffer",
    compensation: "Expected acid-base compensation",
    bloodGas: "Systematic blood gas interpretation",
    bloodGasTypes: "ABG versus VBG and serum total carbon dioxide",
    anionGap: "Anion gap physiology and interpretation",
    deltaGap: "Delta gap and mixed metabolic disorders",
    metabolicAcidosis: "Metabolic acidosis",
    nagma: "Normal-anion-gap metabolic acidosis",
    rta: "Renal tubular acidosis types 1, 2, and 4",
    urineAnionGap: "Urine anion gap and renal ammonium response",
    metabolicAlkalosis: "Metabolic alkalosis",
    respiratoryAcidosis: "Respiratory acidosis",
    respiratoryAlkalosis: "Respiratory alkalosis",
    mixedAcidBase: "Mixed acid-base disorders"
  };

  const educational = (text) => /\b(study(?:ing)?|review(?:ing)?|nclex|exam|practice question|quiz|case study|case report|hypothetical|simulation|simulated|scenario|vignette|assignment|for school|research paper|in this question|in this case|in general|what are the signs|explain|pathophysiology|mechanism)\b/i.test(text);
  const personalCurrent = (text) => /\b(i|im|i am|ive|i have|my|me|we|our|my mom|my dad|my child|my friend|he|his|she|her|they|their)\b/i.test(text)
    && /\b(now|right now|currently|just started|just happened|today|at this moment|minutes? ago|hours? ago|wont stop|will not stop|keeps bleeding|after dialysis|missed dialysis)\b/i.test(text);

  const isActiveDialysisAccessBleed = (input = "") => {
    const text = normalize(input);
    if (!text || educational(text) || !personalCurrent(text)) return false;
    const access = /\b(dialysis fistula|hemodialysis fistula|av fistula|dialysis graft|av graft|dialysis access|dialisis fistla|fistla|needle site|access site)\b/i.test(text);
    const bleeding = /\b(bleed(?:ing)?|blood spurting|spurting blood|wont stop bleeding|will not stop bleeding|soaking through|profuse blood|hemorrhag\w*)\b/i.test(text);
    return access && bleeding;
  };

  const isActiveMissedDialysisEmergency = (input = "") => {
    const text = normalize(input);
    if (!text || educational(text) || !personalCurrent(text)) return false;
    const dialysis = /\b(missed|skipped|couldnt get|could not get|didnt get|did not get)\b/i.test(text)
      && /\b(dialysis|dialisis|dialasys|hemodialysis|hd session|pd exchanges?|peritoneal dialysis)\b/i.test(text);
    const danger = /\b(cant breathe|cannot breathe|trouble breathing|severe shortness of breath|gasping|chest pain|fainted|fainting|confused|new confusion|seizure|unresponsive|blue lips|palpitations|heart racing|extreme weakness|cannot stay awake)\b/i.test(text);
    return dialysis && danger;
  };

  const isActivePdPeritonitisConcern = (input = "") => {
    const text = normalize(input);
    if (!text || educational(text) || !personalCurrent(text)) return false;
    const pd = /\b(peritoneal dialysis|belly dialysis|home dialysis bag|pd catheter|pd exchange|pd drain|dialysate|effluent|cycler)\b/i.test(text);
    const concern = /\b(cloudy|white flecks?|abdominal pain|belly pain|fever|chills|redness|pus|exit site pain|nausea|vomiting)\b/i.test(text);
    return pd && concern;
  };

  const hasNonmedicalCollision = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (/\b(high definition|hd video|hd tv|hdmi|resolution|camera|movie|streaming)\b/i.test(text)
      && !/\b(kidney|renal|dialysis|hemodialysis)\b/i.test(text)) return true;
    if (/\b(parkinson|parkinsons|police department|pupillary distance|product design|professional development|probability distribution)\b/i.test(text)
      && /\bpd\b/i.test(text)
      && !/\b(peritoneal|dialysis|dialysate|cycler)\b/i.test(text)) return true;
    if (/\b(rapid response team|code team|hospital emergency team)\b/i.test(text)
      && /\brrt\b/i.test(text)
      && !/\b(renal|kidney|dialysis|replacement)\b/i.test(text)) return true;
    if (/\b(aki name|name aki|aki meaning|aki character|aki anime|aki hayakawa)\b/i.test(text)) return true;
    if (/\b(obstetric fistula|vesicovaginal fistula|rectovaginal fistula|anal fistula|dental fistula)\b/i.test(text)
      && !/\b(dialysis|hemodialysis|av fistula|vascular access)\b/i.test(text)) return true;
    if (/\b(diet|dieting|weight loss|bodybuilding|fitness|boxing|wrestling|weigh in|scale)\b/i.test(text)
      && /\bdry weight\b/i.test(text)
      && !/\b(dialysis|fluid|edema|ultrafiltration)\b/i.test(text)) return true;
    if (/\b(silver|chemical element|periodic table|attorney general|state attorney|news|legal)\b/i.test(text)
      && /\bag\b/i.test(text)
      && !/\b(anion|acidosis|electrolyte|bicarbonate|chloride)\b/i.test(text)) return true;
    if (/\b(winter weather|weather forecast|winter season|snow|temperature|coat|climate)\b/i.test(text)
      && /\bformula\b/i.test(text)
      && !/\b(acid|base|blood gas|bicarbonate|paco2)\b/i.test(text)) return true;
    if (/\b(salary|pay|work|job|benefits|workers comp|legal compensation|executive compensation)\b/i.test(text)
      && /\bcompensation\b/i.test(text)
      && !/\b(acid|base|blood gas|abg|bicarbonate|paco2)\b/i.test(text)) return true;
    if (/\b(bus|train|transit|route|schedule|airport|road)\b/i.test(text)
      && /\brta\b/i.test(text)
      && !/\b(renal|kidney|acidosis|potassium)\b/i.test(text)) return true;
    if (/\b(stock|stocks|trading|finance|portfolio|option|options|dividend)\b/i.test(text)
      && /\bdelta ratio\b/i.test(text)) return true;
    if (/\b(co2 emissions?|carbon footprint|climate|greenhouse gas|exhaust)\b/i.test(text)
      && !/\b(blood|serum|abg|vbg|pco2|bicarbonate|acid|base|ventilat)\b/i.test(text)) return true;
    if (/\b(baseball|runs batted|pitcher|inning|home run)\b/i.test(text)
      && /\bbase (?:excess|deficit)\b/i.test(text)) return true;
    if (/\b(alkaline diet|alkaline water|baking soda recipe|acid reflux|heartburn|door gap|gap in the door)\b/i.test(text)
      && !/\b(blood gas|anion gap|metabolic|respiratory|acidosis|alkalosis)\b/i.test(text)) return true;
    return false;
  };

  const hasNumericBloodGas = (input = "") => {
    const raw = String(input || "");
    const slashGas = /\b(?:abg|vbg|arterial blood gas|venous blood gas|blood gas)\b[^0-9]{0,24}[0-9](?:\.[0-9]{1,3})?\s*\/\s*[0-9]{1,3}(?:\.[0-9]+)?\s*\/\s*[0-9]{1,3}(?:\.[0-9]+)?/i.test(raw);
    const labelledPh = /\bpH\s*(?:is|=|of|:)?\s*[67](?:\.\d+)?\b/i.test(raw);
    const labelledComponent = /\b(?:PaCO2|Pa\s*CO2|PvCO2|Pv\s*CO2|PCO2|P\s*CO2|HCO3|HCO\s*3|bicarb(?:onate)?)\s*(?:is|=|of|:)?\s*\d+(?:\.\d+)?\b/i.test(raw);
    return slashGas || (labelledPh && labelledComponent);
  };

  const targetFor = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text || isActiveDialysisAccessBleed(raw) || isActiveMissedDialysisEmergency(raw)
      || isActivePdPeritonitisConcern(raw) || hasNonmedicalCollision(raw)) return "";
    /* Numeric gases are answered in place by ANI's quantitative interpreter. */
    if (hasNumericBloodGas(raw)) return "";
    const matches = (pattern) => has(raw, text, pattern);
    const isEstablishedLabAnionGapIntent = /^(?:what does|what is) (?:a |the )?high anion gap (?:mean|indicate)$/.test(text);

    /* Acid-base routes are specific first so words such as renal and kidney do not swallow the question. */
    if (matches(/\b(delta[ -]?(?:delta|gap|ratio)|corrected bicarbonate|mixed metabolic disorders?)\b/i)) return TARGETS.deltaGap;
    if (matches(/\b(urine anion gap|urinary anion gap|uag formula|urine ammonium|urinary ammonium|is the kidney excreting ammonium)\b/i)
      || (matches(/\bUAG\b/i) && matches(/\b(urine|renal|kidney|acidosis|ammonium)\b/i))) return TARGETS.urineAnionGap;
    if (matches(/\b(renal tubular acidosis|distal rta|proximal rta|type ?1 rta|type ?2 rta|type ?4 rta|hyperkalemic rta|hypoaldosteronism acidosis)\b/i)
      || (matches(/\bRTA\b/i) && matches(/\b(renal|kidney|acidosis|potassium|bicarbonate)\b/i))) return TARGETS.rta;
    if (matches(/\b(normal[ -]anion[ -]gap metabolic acidosis|normal gap acidosis|non[ -]anion[ -]gap metabolic acidosis|nagma|hyperchloremic acidosis|bicarbonate loss acidosis)\b/i)) return TARGETS.nagma;
    if (matches(/\b(mixed acid[ -]?base disorders?|mixed acid base|triple acid[ -]?base disorder|two acid base problems|normal ph but abnormal co2 and bicarbonate)\b/i)) return TARGETS.mixedAcidBase;
    if (matches(/\b(winter(?:s|s formula| formula)|expected (?:acid[ -]?base )?compensation|compensation rules?|acute versus chronic compensation|acute vs chronic compensation|is this compensated|appropriate compensation)\b/i)
      && matches(/\b(acid|base|abg|vbg|blood gas|bicarbonate|hco3|paco2|metabolic|respiratory|winter)\b/i)) return TARGETS.compensation;
    if (matches(/\b(abg versus vbg|abg vs vbg|arterial versus venous blood gas|venous gas okay|vbg okay|serum co2 versus bicarbonate|serum total co2|blood gas bicarbonate|paco2 versus serum co2|paco2 vs serum co2|base excess|base deficit)\b/i)) return TARGETS.bloodGasTypes;
    if (matches(/\b(step[ -]by[ -]step abg|systematic blood gas|interpret (?:this |an )?(?:abg|vbg|blood gas)|abg interpretation|vbg interpretation|blood gas interpretation|read (?:this |an )?abg|acid base interpretation)\b/i)) return TARGETS.bloodGas;
    if (!isEstablishedLabAnionGapIntent
      && (matches(/\b(anion gap formula|calculate (?:the )?anion gap|correct(?:ed)? anion gap|albumin corrected anion gap|why (?:is )?(?:the )?anion gap high|high anion gap|low anion gap|high gap acid(?:osis)?|hagma|agma)\b/i)
        || (text === "anion gap"))) return TARGETS.anionGap;
    if (matches(/\b(metabolic alkalosis|chloride responsive alkalosis|chloride resistant alkalosis|urine chloride.*alkalosis|contraction alkalosis|vomiting alkalosis)\b/i)) return TARGETS.metabolicAlkalosis;
    if (matches(/\b(respiratory acidosis|resp acid(?:osis)?|acute hypercapnia|chronic hypercapnia|co2 retention|carbon dioxide retention|hypoventilation acidosis|acid from not breathing enough)\b/i)) return TARGETS.respiratoryAcidosis;
    if (matches(/\b(respiratory alkalosis|hyperventilation alkalosis|low carbon dioxide from hyperventilation|low pco2 alkalosis)\b/i)) return TARGETS.respiratoryAlkalosis;
    if (matches(/\b(metabolic acidosis|acidotic with low bicarbonate|low bicarbonate acidosis|high gap acidosis|kussmaul acidosis)\b/i)) return TARGETS.metabolicAcidosis;
    if (matches(/\b(acid[ -]?base balance|bicarbonate buffer|henderson[ -]?hasselbalch|how do lungs and kidneys control ph|why does bicarbonate affect ph|co2 bicarbonate buffer)\b/i)) return TARGETS.acidBase;
    if (matches(/\b(how do kidneys (?:remove|excrete) acid|how do kidneys make (?:new )?bicarbonate|renal acid excretion|ammoniagenesis|ammonium trapping|titratable acid|bicarbonate regeneration)\b/i)) return TARGETS.renalAcid;

    /* Dialysis and kidney-failure routes. */
    if (matches(/\b(pd peritonitis|peritoneal dialysis peritonitis|cloudy (?:pd )?(?:fluid|effluent|dialysate|drain fluid|drainage|bag)|cloudy (?:belly|home) dialysis (?:drain )?(?:bag|fluid)|abdominal pain during peritoneal dialysis|infected pd catheter)\b/i)) return TARGETS.pdPeritonitis;
    if (matches(/\b(dialysis disequilibrium|dialysis dysequilibrium|dds after dialysis|headache confusion after first dialysis|seizure after dialysis|reverse urea effect)\b/i)
      || (matches(/\b(dialysis|hemodialysis|first treatment)\b/i) && matches(/\b(headache|confusion|seizure|vomiting|restless|altered consciousness)\b/i))) return TARGETS.disequilibrium;
    if (matches(/\b(intradialytic hypotension|dialysis hypotension|low blood pressure during dialysis|fainting during dialysis|cramps and low pressure during dialysis|low blood pressure.{0,35}cramps.{0,35}dialysis|dialisis (?:made )?(?:my |the )?(?:blood )?pressure crash(?:ed)?|pressure crash(?:ed)?.{0,30}(?:dialysis|dialisis).{0,30}cramps?)\b/i)) return TARGETS.dialysisHypotension;
    if (matches(/\b(dry weight|target weight after dialysis|ultrafiltration rate|fluid removal rate|plasma refill|volume management during dialysis)\b/i)
      && matches(/\b(dialysis|hemodialysis|ultrafiltration|fluid|dry weight|intradialytic)\b/i)) return TARGETS.ultrafiltration;
    if (matches(/\b(no thrill|lost thrill|absent thrill|no bruit|lost bruit|clotted fistula|thrombosed fistula|fistula thrombosis)\b/i)
      && matches(/\b(fistula|graft|dialysis|access|thrill|bruit)\b/i)
      || matches(/\bfistla (?:stopped|quit|isnt|is not) buzz(?:ing)?(?: after (?:dialysis|dialisis))?\b/i)) return TARGETS.accessThrombosis;
    if (matches(/\b(infected fistula|fistula infection|access infection|redness over fistula|pus from fistula|warm painful dialysis access|(?:warm|red|painful).{0,35}fistula.{0,25}pus)\b/i)) return TARGETS.accessInfection;
    if (matches(/\b(dialysis fistula|hemodialysis fistula|av fistula|dialysis graft|av graft|dialysis catheter|hemodialysis access|vascular access for dialysis|fistula graft catheter options?|fistula thrill|fistula bruit|no thrill|no bruit|protect the fistula arm)\b/i)) return TARGETS.access;
    if (matches(/\b(hd vs pd(?: vs crrt)?|hd versus pd(?: versus crrt)?|hemodialysis versus peritoneal dialysis|hemodialysis vs peritoneal dialysis|compare dialysis modalities|compare hd pd crrt)\b/i)) return TARGETS.krt;
    if (matches(/\b(missed dialysis complications|skipping dialysis risks?|what happens (?:if|when) (?:you|someone) miss(?:es)? dialysis|missed dialysis(?: patient)? case|case (?:study|report|scenario|vignette)(?: about| involving| of)? (?:a )?(?:patient )?(?:who )?missed dialysis)\b/i)) return TARGETS.krt;
    if (matches(/\b(continuous renal replacement therapy|continuous kidney replacement therapy|crrt|ckrt|cvvh|cvvhd|cvvhdf|slow continuous dialysis|continuous slow dialysis)\b/i)
      || (matches(/\b(?:too|hemodynamically) unstable\b/i) && matches(/\b(?:regular )?(?:hd|hemodialysis|dialysis)\b/i))) return TARGETS.crrt;
    if (matches(/\b(peritoneal dialysis|capd|ccpd|automated peritoneal dialysis|pd exchange|pd dwell|pd cycler|dialysate dwell|peritoneal transport)\b/i)) return TARGETS.peritonealDialysis;
    if (matches(/\b(hemodialysis|haemodialysis|dialyzer|dialysate countercurrent|kt\/?v|urea reduction ratio|how does dialysis filter blood|hd prescription)\b/i)) return TARGETS.hemodialysis;
    if (matches(/\b(when (?:do|does|should) (?:you|someone|a patient) (?:need|start|get) dialysis|when (?:do|should) (?:you|we|they) dialyze|when to dialyze|indications? for dialysis|aeiou dialysis|dialysis indications|kidney replacement therapy|renal replacement therapy|krt modality|dialysis versus transplant|hd vs pd vs crrt|hd versus pd)\b/i)
      || (matches(/\bRRT\b/i) && matches(/\b(renal|kidney|dialysis|replacement|aki|uremia)\b/i))) return TARGETS.krt;
    if (matches(/\b(ckd mineral bone disorder|ckd[ -]?mbd|renal osteodystrophy|secondary hyperparathyroidism in ckd|phosphate retention ckd|high pth kidney disease)\b/i)) return TARGETS.ckdMbd;
    if (matches(/\b(anemia of (?:chronic )?kidney disease|ckd anemia|renal anemia|low erythropoietin anemia|why kidney disease causes anemia|why (?:does )?renal failure (?:make|cause).{0,20}anemi\w*)\b/i)) return TARGETS.ckdAnemia;
    const uremiaDrugBindingIntent = matches(/\buremi\w*\b/i) && (
      matches(/\b(total (?:versus|vs) free|free (?:drug|medicine|medication|antiseizure|antiepileptic)? ?(?:level|concentration)|unbound (?:drug|medicine|medication|level|concentration)|therapeutic drug monitoring)\b/i)
      || (matches(/\b(displac\w*|bind\w*|bound)\b/i) && matches(/\b(albumin|protein)\b/i))
      || (matches(/\b(antiseizure|antiepileptic|phenytoin|valproate)\b/i)
        && matches(/\b(free|unbound|albumin|protein binding|total level|drug level|medication level|concentration)\b/i))
    );
    if (uremiaDrugBindingIntent) return "";
    if (matches(/\b(uremia|uremic syndrome|uremic encephalopathy|uremic pericarditis|uremic platelet dysfunction|uremic symptoms)\b/i)) return TARGETS.uremia;
    if (matches(/\b(kidney failure symptoms|end stage kidney disease|end stage renal disease|eskd|esrd|stage 5 kidney failure)\b/i)) return TARGETS.kidneyFailure;
    if (matches(/\b(ckd heat map|ckd risk grid|cga classification|gfr and albuminuria categories|ckd g stage|ckd a stage|a1 a2 a3 albuminuria|g1 g2 g3a g3b g4 g5)\b/i)
      || (/\bG(?:1|2|3a|3b|4|5)\b/i.test(raw) && /\bA[123]\b/i.test(raw))) return TARGETS.ckdRisk;
    if (matches(/\b(diabetic nephropathy|diabetic kidney disease|diabetes causing kidney damage|albuminuria from diabetes|why diabetes damages kidneys)\b/i)) return TARGETS.diabeticNephropathy;
    if (text === "ckd" || matches(/\b(chronic kidney disease|chronic renal disease|chronic renal failure|kidney disease for three months|kidneys slowly failing)\b/i)) return TARGETS.ckd;
    if (matches(/\b(prerenal (?:versus|vs) intrinsic (?:versus|vs) postrenal|prerenal intrinsic and postrenal|compare prerenal intrinsic postrenal)\b/i)) return TARGETS.aki;
    if (matches(/\b(acute tubular injury|acute tubular necrosis|ati kidney|atn kidney|ischemic tubular injury|nephrotoxic tubular injury|muddy brown granular casts)\b/i)) return TARGETS.tubularInjury;
    if (matches(/\b(fena|fe na|fractional excretion of sodium|feurea|fe urea|fractional excretion of urea|muddy brown casts|urine sediment in aki|urine indices|urine sodium prerenal)\b/i)) return TARGETS.urineIndices;
    if (matches(/\b(postrenal aki|postrenal acute kidney injury|obstructive aki|urinary obstruction causing kidney injury|hydronephrosis aki|blocked urine causing creatinine rise|bilateral obstruction)\b/i)) return TARGETS.postrenal;
    if (matches(/\b(intrinsic aki|intrarenal aki|intrinsic acute kidney injury|glomerular interstitial vascular pigment kidney injury|active urine sediment)\b/i)) return TARGETS.intrinsicAki;
    if (matches(/\b(prerenal aki|pre renal aki|prerenal azotemia|low perfusion kidney injury|dehydration causing creatinine rise|kidneys not getting enough blood)\b/i)) return TARGETS.prerenal;
    if (text === "aki" || matches(/\b(acute kidney injury|acute renal failure|aki staging|kidneys suddenly failing|sudden creatinine rise|why creatinine rose quickly|oliguria with rising creatinine|creat(?:inine|nin) (?:shot|went|is) up.{0,35}(?:barely peeing|not peeing|low urine)|barely peeing.{0,35}creat(?:inine|nin))\b/i)) return TARGETS.aki;

    /* Renal physiology routes. */
    if (matches(/\b(tubuloglomerular feedback|macula densa|glomerulotubular feedback|sglt2 egfr dip mechanism|adenosine afferent arteriole)\b/i)) return TARGETS.tubuloglomerularFeedback;
    if (matches(/\b(glomerular filtration barrier|podocyte slit diaphragm|nephrin|why protein leaks into urine|why (?:does )?protein leak through (?:the )?glomerulus|how proteinuria happens|albumin crosses glomerulus|charge selectivity glomerulus|kidney filters?.{0,30}(?:protein|protien).{0,20}(?:pee|urine))\b/i)) return TARGETS.filtrationBarrier;
    if (matches(/\b(renal blood flow|renal plasma flow|filtration fraction|gfr autoregulation|renal autoregulation|afferent versus efferent arteriole|afferent vs efferent arteriole|myogenic response kidney)\b/i)) return TARGETS.renalHemodynamics;
    if (matches(/\b(countercurrent multiplication|countercurrent exchange|loop of henle concentration|medullary osmotic gradient|vasa recta|urea recycling|how kidneys concentrate urine)\b/i)) return TARGETS.concentration;
    if (matches(/\b(adh and osmolality|antidiuretic hormone kidney|vasopressin kidney|free water clearance|aquaporin 2|dilute versus concentrated urine|dilute vs concentrated urine|how kidneys handle water)\b/i)) return TARGETS.waterHandling;
    if (matches(/\b(kidney endocrine functions?|renal endocrine functions?|kidneys make erythropoietin|kidneys activate vitamin d|renin erythropoietin vitamin d|epo renin calcitriol)\b/i)
      || (matches(/\brenin\b/i) && matches(/\b(?:epo|erythropoietin)\b/i) && matches(/\b(?:active )?vitamin d|calcitriol\b/i))) return TARGETS.endocrine;
    if (matches(/\b(nephron anatomy|parts of the nephron|segmental nephron transport|proximal tubule loop distal collecting duct|where is sodium reabsorbed|nephron transporters|diuretic sites in nephron)\b/i)) return TARGETS.nephron;
    if (text === "kidney" || text === "kidneys" || matches(/\b(what do (?:the )?kidneys do|how do (?:the )?kidneys work|how do (?:the )?kidneys filter blood|kidney functions?|renal physiology overview|integrated renal physiology|why are kidneys important)\b/i)) return TARGETS.renalPhysiology;
    return "";
  };

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      if (isActiveDialysisAccessBleed(input)) {
        return "**Emergency - bleeding dialysis fistula or graft:** Call 911 now and tell the dispatcher this is bleeding from a hemodialysis access. Apply firm, continuous direct pressure with a small clean dressing or folded gauze directly over the bleeding point. Do not keep lifting the dressing to look, and do not delay the emergency call. Stay with the person. Even if the bleeding stops, emergency evaluation is still needed because high-flow access bleeding can restart and can cause rapid blood loss.";
      }
      if (isActiveMissedDialysisEmergency(input)) {
        return "**Emergency:** Severe trouble breathing, chest pain, fainting, confusion, seizure, extreme weakness, or palpitations after missed dialysis can reflect dangerous fluid, potassium, acid-base, or uremic complications. Call 911 now and do not drive yourself or wait for the next scheduled treatment. Tell the dispatcher that dialysis was missed and describe the symptoms. Do not try to correct this with extra medicines, salt substitutes, potassium products, or large amounts of fluid unless emergency clinicians direct you.";
      }
      if (isActivePdPeritonitisConcern(input)) {
        return "**Urgent dialysis concern:** Cloudy peritoneal-dialysis drainage, abdominal pain, fever, chills, vomiting, or new catheter-site redness can mean PD-associated peritonitis or an exit-site infection. Contact the dialysis team immediately and obtain urgent clinical evaluation today; treatment should not wait for the next routine visit. Keep the drained bag or a clear photo if the dialysis team asks to inspect or culture it, and do not start leftover antibiotics. Call 911 for fainting, confusion, severe weakness, trouble breathing, uncontrolled pain, or rapidly worsening illness.";
      }
      if (shouldDeferToBaseHighYield(input)) return baseMakeModelEnhancedResponse(input, ...args);
      const target = targetFor(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      return {
        type: "pharm-database",
        query: target,
        detailType: "pathology",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in the clinical reference.",
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  window.ANI_RENAL_ACIDBASE_WAVE25_ROUTING = {
    version: VERSION,
    targets: TARGETS,
    canonicalTarget: targetFor,
    hasNumericBloodGas,
    isActiveDialysisAccessBleed,
    isActiveMissedDialysisEmergency,
    isActivePdPeritonitisConcern,
    shouldDeferToBaseHighYield,
    hasNonmedicalCollision
  };
}());
