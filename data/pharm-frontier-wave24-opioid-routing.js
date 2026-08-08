/* eslint-disable */
/* High-priority offline intent and safety routing for the opioid causal study wave. */
(function () {
  const baseHighYieldDrugClueMatch = typeof highYieldDrugClueMatch === "function"
    ? highYieldDrugClueMatch
    : null;
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function"
    ? makeModelEnhancedResponse
    : null;

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const card = (name) => {
    const target = normalize(name);
    const drugs = (window.ANI_PHARM_DATABASE && window.ANI_PHARM_DATABASE.drugs) || [];
    const matches = drugs.filter((drug) =>
      normalize(drug.generic || drug.name || drug.displayName) === target
      || normalize(drug.name || drug.displayName) === target
    );
    return matches.find((drug) => !drug.hidden && drug.studentFacing !== false)
      || matches[0]
      || null;
  };

  const TARGETS = {
    opioidClass: "Opioid analgesics",
    selection: "Opioid selection, formulation, and incomplete cross-tolerance",
    moud: "Medications for opioid use disorder",
    buprenorphineNaloxone: "Buprenorphine/naloxone induction and formulation rationale",
    antagonists: "Opioid antagonists: naloxone, nalmefene, and naltrexone",
    combinations: "Common opioid-acetaminophen combination products",
    mixedAgonists: "Mixed agonist-antagonist opioids: butorphanol, nalbuphine, and pentazocine",
    nociception: "Nociception and endogenous pain modulation",
    painMechanisms: "Pain mechanisms, central sensitization, hyperalgesia, and allodynia",
    respiratoryDepression: "Opioid-induced respiratory depression",
    adaptation: "Opioid tolerance, physical dependence, and addiction distinctions",
    hyperalgesia: "Opioid-induced hyperalgesia",
    oud: "Opioid use disorder",
    withdrawal: "Opioid withdrawal",
    precipitatedWithdrawal: "Precipitated opioid withdrawal",
    intoxication: "Opioid intoxication",
    overdose: "Opioid overdose",
    recurrentToxicity: "Naloxone response and recurrent opioid toxicity",
    pregnancy: "Opioid use disorder in pregnancy and peripartum care",
    neonatalWithdrawal: "Neonatal abstinence syndrome",
    pca: "Patient-controlled analgesia opioid safety",
    heroin: "Heroin"
  };

  const PATHOLOGY_TARGETS = new Set([
    TARGETS.nociception,
    TARGETS.painMechanisms,
    TARGETS.respiratoryDepression,
    TARGETS.adaptation,
    TARGETS.hyperalgesia,
    TARGETS.oud,
    TARGETS.withdrawal,
    TARGETS.precipitatedWithdrawal,
    TARGETS.intoxication,
    TARGETS.overdose,
    TARGETS.recurrentToxicity,
    TARGETS.pregnancy,
    TARGETS.neonatalWithdrawal,
    TARGETS.pca,
    TARGETS.heroin
  ].map(normalize));

  const countSignals = (text, patterns) => patterns.reduce(
    (count, pattern) => count + (pattern.test(text) ? 1 : 0),
    0
  );

  const isActiveOpioidEmergency = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (!text) return false;

    const explicitlyEducational = /\b(study|studying|review|reviewing|nclex|exam|test question|practice question|quiz|case study|case report|hypothetical|fictional|simulation|simulated|scenario|vignette|assignment|for school|research paper|documentary|in this question|in this case|in general)\b/i.test(text);
    const urgentLanguage = /\b(right now|currently|just happened|just took|just used|help|what do i do|what should i do|should i call 911|wont wake|will not wake|not breathing|stopped breathing|turning blue)\b/i.test(text);
    const conceptualQuestion = /\b(what are (?:the )?(?:signs|symptoms)|list (?:the )?(?:signs|symptoms)|pathophysiology|mechanism of|why do opioids|how do opioids|can opioids cause|explain|define|definition|compare|comparison)\b/i.test(text)
      || /\bwhat happens if (?:someone|somebody|a person|you) (?:takes?|uses?)\b/i.test(text);
    if (explicitlyEducational || (conceptualQuestion && !urgentLanguage)) return false;

    const opioidContext = /\b(opioid|opioids|opiate|opiates|narcotic|fentanyl|fentenyl|fentynal|heroin|heroine|pain pills?|oxycodone|oxycontin|hydrocodone|morphine|hydromorphone|dilaudid|codeine|tramadol|tapentadol|meperidine|demerol|methadone|buprenorphine|suboxone|narcan|naloxone|kloxxado|rivive|rextovy|opvee|nalmefene|prescription pain (?:medicine|medication))\b/i.test(text);
    const unresponsive = /\b(wont wake(?: up)?|will not wake(?: up)?|cant wake(?: up)?|cannot wake(?: up)?|hard to wake|unable to wake|not waking(?: up)?|unresponsive|unconscious|not responding|doesnt respond|isnt responding|passed out and wont wake|collapsed and wont wake)\b/i.test(text);
    const breathingDanger = /\b(not breathing|isnt breathing|arent breathing|stopped breathing|barely breathing|slow breathing|breathing (?:is )?(?:very )?slow|shallow breathing|irregular breathing|gasping|agonal breathing|apnea|no breaths?|few breaths?|choking while unconscious|gurgling while unconscious|snoring while unconscious|gurgling and (?:unresponsive|passed out)|snoring and (?:unresponsive|passed out))\b/i.test(text);
    const colorDanger = /\b(blue|gray|grey|purple|dusky) (?:lips?|fingertips?|nails?|skin|face)\b/i.test(text)
      || /\b(lips?|fingertips?|nails?|skin|face) (?:are |is |turned |turning )?(?:blue|gray|grey|purple|dusky)\b/i.test(text);
    const excessDose = /\b(took|taken|swallowed|used|injected|snorted|smoked|gave|given|got) (?:way )?(?:too much|too many|an extra|extra|a double|double|a triple|triple|the whole|entire bottle|unknown amount)\b/i.test(text)
      || /\b(?:extra|double|triple|too many|too much) (?:dose|doses|tablets?|pills?)\b/i.test(text)
      || /\b(overdosed|overdose happening|od(?:d)?ing|just od(?:d)?ed)\b/i.test(text);
    const miosis = /\b(pinpoint|very small|tiny) pupils?\b/i.test(text);
    const toxidromeSignals = countSignals(text, [
      /\b(pinpoint|very small|tiny) pupils?\b/i,
      /\b(slow|shallow|barely|no|stopped|not) breathing\b/i,
      /\b(wont wake|unresponsive|unconscious|not responding|passed out)\b/i,
      /\b(blue|gray|grey|purple|dusky) (?:lips?|skin|face)\b/i
    ]);
    const suspectedOpioid = opioidContext || (miosis && toxidromeSignals >= 2);
    if (!suspectedOpioid) return false;

    const severeDanger = unresponsive || breathingDanger || colorDanger;
    const current = /\b(now|right now|just now|just happened|just took|just used|currently|at this moment|minutes? ago|today|after taking|after using|after fentanyl|after heroin|wont wake|not breathing|stopped breathing|turning blue)\b/i.test(text);
    const pastOnly = /\b(last year|years? ago|months? ago|last month|previously|in the past|history of|used to)\b/i.test(text)
      && !current;
    if (pastOnly) return false;

    if (severeDanger && (opioidContext || toxidromeSignals >= 2)) return true;
    return excessDose;
  };

  const hasNonOpioidCollision = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);

    if (/\boud\b/i.test(text)
      && /\b(perfume|fragrance|cologne|scent|agarwood|wood|lute|instrument|musical|music|stringed|arabic)\b/i.test(text)
      && !/\b(opioid|opiate|addiction|use disorder|pain pills?|fentanyl|heroin)\b/i.test(text)) return true;
    if (/\bcows?\b/i.test(text)
      && /\b(field|farm|cattle|calves|pasture|herd|livestock|animal)\b/i.test(text)
      && !/\b(score|scale|opioid|opiate|withdrawal)\b/i.test(text)) return true;
    if (/\bnas\b/i.test(text)
      && /\b(network attached storage|storage|server|drive|rapper|artist|album|song|music)\b/i.test(text)
      && !/\b(neonatal|newborn|baby|opioid|opiate|withdrawal)\b/i.test(text)) return true;
    if (/\b(newborn|neonatal|baby)\b/i.test(text)
      && /\b(hypoglycemia|low blood sugar|sepsis|meningitis|infection|electrolyte|hypocalcemia)\b/i.test(text)
      && !/\b(opioid|opiate|methadone|buprenorphine|fentanyl|heroin|withdrawal|nows|nas)\b/i.test(text)) return true;

    const descriptiveNaloxegol = /\bpeg(?:ylated| modified| conjugated) naloxone\b/i.test(text)
      || (/\b(opioid induced constipation|opioid constipation|oic)\b/i.test(text)
        && /\b(pegylated|peg modified|peripheral|gut|constipation drug|naloxone)\b/i.test(text));
    const pamora = /\b(methylnaltrexone|relistor|naloxegol|movantik|naldemedine|symproic|pamora|peripherally acting mu opioid receptor antagonist)\b/i.test(text)
      || descriptiveNaloxegol;
    if (pamora) return true;

    const contrave = /\bcontrave\b/i.test(text)
      || (/\b(naltrexone|naltrexon|naltexone)\b/i.test(text)
        && /\b(bupropion|buproprion|bupropian)\b/i.test(text))
      || (/\b(opioid blocker|pomc|beta endorphin|alpha msh)\b/i.test(text)
        && /\b(weight|appetite|five percent|5 percent)\b/i.test(text));
    if (contrave) return true;

    if (/\b(apomorphine|apokyn|onapgo|kynmobi)\b/i.test(text)
      && !/\b(morphine sulfate|ms contin|roxanol|kadian)\b/i.test(text)) return true;
    if (/\b(oxytocin|pitocin)\b/i.test(text)
      && !/\b(oxycontin|oxycodone)\b/i.test(text)) return true;

    const nonAnalgesicPca = /\b(posterior cerebral artery|pca stroke|pca infarct|principal component analysis|prostate cancer|prostate carcinoma|prostate specific antigen|statistical|statistics|data science|dimensionality reduction)\b/i.test(text);
    if (nonAnalgesicPca) return true;
    return false;
  };

  const wave24Match = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    const has = (pattern) => pattern.test(raw) || pattern.test(text);
    if (!text || isActiveOpioidEmergency(raw) || hasNonOpioidCollision(raw)) return null;

    if (has(/\b(buprenorphine[ /+-]*naloxone|naloxone[ /+-]*buprenorphine|suboxone|zubsolv|bunavail|bup[ -]?nal|bupe[ -]?naloxone)\b/i)
      || (has(/\b(start|starting|induction|induce|why|formulation)\b/i)
        && has(/\bbuprenorphine\b/i) && has(/\bnaloxone\b/i))) {
      return card(TARGETS.buprenorphineNaloxone);
    }

    if (has(/\b(percocet|norco|vicodin|lortab|tylenol ?#? ?3|tylenol with codeine|opioid[ /-]*apap combinations?)\b/i)
      || (has(/\b(oxycodone|hydrocodone|codeine)\b/i)
        && has(/\b(acetaminophen|paracetamol|apap)\b/i))) {
      return card(TARGETS.combinations);
    }

    if (has(/\b(mixed opioid agonist antagonist|mixed agonist antagonist opioids?|kappa agonist mu antagonist|butorphanol|stadol|nalbuphine|nubain|pentazocine|talwin)\b/i)) {
      return card(TARGETS.mixedAgonists);
    }

    if (has(/\b(moud|medications? for opioid use disorder|medication treatment for opioid use disorder|medication assisted treatment(?: for)? opioids?|mat for opioid addiction|opioid addiction medications?)\b/i)
      || (has(/\b(methadone|buprenorphine|naltrexone)\b/i)
        && has(/\b(compare|comparison|versus|vs|which)\b/i)
        && has(/\b(oud|opioid use disorder|opioid addiction|heroin addiction)\b/i))) {
      return card(TARGETS.moud);
    }

    if ((has(/\b(naloxone|narcan)\b/i) && has(/\b(naltrexone|vivitrol|nalmefene|opvee)\b/i))
      || has(/\b(opioid antagonist comparison|overdose reversal drugs?|opioid blockers?|naloxone vs naltrexone|narcan vs vivitrol|naloxone vs nalmefene)\b/i)) {
      return card(TARGETS.antagonists);
    }

    if (has(/\b(opioid conversion|equianalgesic(?: opioid)? conversion|opioid rotation|morphine milligram equivalents?|mme conversion|switching opioids?|incomplete cross[ -]?tolerance|ir vs er opioids?|immediate release (?:versus|vs) extended release opioids?|equianalgesic table)\b/i)) {
      return card(TARGETS.selection);
    }

    if (text === "opioid" || text === "opioids" || text === "opiate" || text === "opiates"
      || has(/\b(opioid analgesics?|opiate pain medicines?|narcotic pain medicines?|mu opioid agonists?|opioid pharmacology|what are opioids?|how (?:do )?opioids work|how (?:do )?opioid (?:medicines?|drugs?) work|opioid mechanism(?:s)?|opioid receptor pharmacology|opiods|opiod analgesics?)\b/i)) {
      return card(TARGETS.opioidClass);
    }

    if (has(/\b(morphine sulfate|ms contin|roxanol|kadian|morphene|morphin|morphine)\b/i)) return card("Morphine");
    if (has(/\b(hydromorphone hydrochloride|hydromorphone|dilaudid|exalgo|hydromorfon|hydromophone)\b/i)) return card("Hydromorphone");
    if (has(/\b(fentanyl citrate|duragesic|sublimaze|fentanyl patch|transdermal fentanyl|pharmaceutical fentanyl|fentenyl|fentynal|fentanyl)\b/i)) return card("Fentanyl");
    if (has(/\b(oxycodone hydrochloride|oxycontin|roxicodone|oxycodone ir|oxycodone er|oxicodone|oxycodon|oxycodone)\b/i)) return card("Oxycodone");
    if (has(/\b(hydrocodone bitartrate|hysingla er|zohydro er|hydrocodone er|hydrocodon|hydrocone|hydrocodone)\b/i)) return card("Hydrocodone");
    if (has(/\b(codeine sulfate|codeine phosphate|codein|codiene|codeene|codeine)\b/i)) return card("Codeine");
    if (has(/\b(tramadol hydrochloride|ultram|conzip|tramadol er|tramadol ir|tramodol|tramadol)\b/i)) return card("Tramadol");
    if (has(/\b(tapentadol hydrochloride|nucynta er|nucynta|tapentadol ir|tapentadol er|tapentodol|tapentado|tapentadol)\b/i)) return card("Tapentadol");
    if (has(/\b(meperidine hydrochloride|demerol|pethidine|meperadin|meperidene|meperidine)\b/i)) return card("Meperidine");
    if (has(/\b(methadone hydrochloride|methadose|dolophine|methadone maintenance|methadone for oud|methadone for pain|methadon|methadown|methadone)\b/i)) return card("Methadone");
    if (has(/\b(buprenorphine hydrochloride|subutex|sublocade|brixadi|butrans|belbuca|buprenorphine partial agonist|buprenorfin|buprenophine|buprenorphine)\b/i)) return card("Buprenorphine");
    if (has(/\b(narcan|kloxxado|rivive|rextovy|naloxone nasal spray|opioid overdose antidote|opioid reversal medicine|nalaxon|nalaxone|naloxon|naloxone)\b/i)) return card("Naloxone");
    if (has(/\b(nalmefene hydrochloride|opvee|nalmefene nasal spray|long acting opioid reversal|nalmefine|nalmefen|nalmefene)\b/i)) return card("Nalmefene");
    if (has(/\b(naltrexone hydrochloride|vivitrol|revia|extended release naltrexone|xr naltrexone|opioid blocker shot|naltrexon|naltexone|naltrexone)\b/i)) return card("Naltrexone");
    if (has(/\b(lofexidine hydrochloride|lucemyra|opioid withdrawal non opioid medicine|alpha 2 agonist opioid withdrawal|lofexadin|lofexedine|lofexidine)\b/i)) return card("Lofexidine");
    return null;
  };

  const conceptTarget = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    const has = (pattern) => pattern.test(raw) || pattern.test(text);
    if (!text || isActiveOpioidEmergency(raw) || hasNonOpioidCollision(raw)) return "";

    if ((has(/\b(moud|medications? for opioid use disorder|medication treatment for opioid use disorder|mat for opioid addiction)\b/i))
      || (has(/\b(methadone|buprenorphine|naltrexone)\b/i)
        && has(/\b(compare|comparison|versus|vs|which)\b/i)
        && has(/\b(oud|opioid use disorder|opioid addiction|heroin addiction)\b/i))) {
      return TARGETS.moud;
    }

    if (has(/\b(patient controlled analgesia|pca pump|pca opioid safety|pca basal rate|pca lockout|family press (?:the )?pca|morphine pca|hydromorphone pca)\b/i)
      || (has(/\bPCA\b/i) && has(/\b(opioid|analgesi\w*|morphine|hydromorphone|dilaudid|pain pump|lockout|basal rate|button)\b/i))) {
      return TARGETS.pca;
    }

    if (has(/\b(neonatal opioid withdrawal syndrome|neonatal abstinence syndrome|newborn opioid withdrawal|newborn opiate withdrawal|baby withdrawing from opioids|eat sleep console|high pitched cry tremor diarrhea newborn)\b/i)
      || has(/\bNOWS\b/i)
      || (has(/\bNAS\b/i) && (text === "nas" || has(/\b(neonatal|newborn|baby|opioid|opiate|withdrawal)\b/i)))
      || (has(/\bESC\b/i) && has(/\b(newborn|neonatal|opioid|withdrawal|eat sleep console)\b/i))) {
      return TARGETS.neonatalWithdrawal;
    }

    if ((has(/\b(oud|opioid use disorder|opioid addiction|heroin addiction)\b/i)
      && has(/\b(pregnan\w*|pregnancy|labor|delivery|peripartum|postpartum|breastfeed\w*)\b/i))
      || has(/\b(pregnant on methadone|pregnant on buprenorphine|opioid addiction pregnancy|labor on methadone|postpartum oud|breastfeeding methadone buprenorphine)\b/i)) {
      return TARGETS.pregnancy;
    }

    if (has(/\b(renarcotization|recurrent respiratory depression after naloxone|naloxone wore off|narcan wore off|naloxone (?:can |may )?wear off|narcan (?:can |may )?wear off|repeat naloxone|repeat narcan|how often repeat narcan|how often (?:should )?(?:narcan|naloxone) be repeated|naloxone response|why (?:the )?overdose comes back|overdose came back after narcan|respiratory depression (?:can )?return after (?:narcan|naloxone))\b/i)) {
      return TARGETS.recurrentToxicity;
    }
    if (has(/\b(precipitated (?:opioid )?withdrawal|buprenorphine made withdrawal worse|suboxone precipitated withdrawal|naltrexone precipitated withdrawal|pw from fentanyl|started bupe too soon|rapid opioid withdrawal after antagonist)\b/i)) {
      return TARGETS.precipitatedWithdrawal;
    }
    if (has(/\b(opioid induced hyperalgesia|opioid hyperalgesia|oih|pain (?:is |got |gets )?worse on opioids|opioids causing more pain|paradoxical opioid pain|allodynia from opioids)\b/i)) {
      return TARGETS.hyperalgesia;
    }
    if (has(/\b(opioid induced respiratory depression|opioid respiratory depression|oird|slow breathing after morphine|opioids and co2|why opioids stop breathing|respitory depresion after opioid|respitory depresion (?:from|with) opiods?|opiod respitory depresion|opioid hypoventilation)\b/i)) {
      return TARGETS.respiratoryDepression;
    }
    if (has(/\b(opioid tolerance vs dependence|dependence (?:versus|vs) addiction|tolerance physical dependence oud|am i addicted if i have withdrawal|opioid dependence meaning|opioid adaptation|difference between tolerance and addiction)\b/i)
      || (has(/\btolerance (?:versus|vs) dependence\b/i)
        && has(/\b(opioid|opiate|pain pills?|fentanyl|heroin|morphine|oxycodone|hydrocodone|methadone|buprenorphine)\b/i))
      || (has(/\btolerance\b/i)
        && has(/\bphysical dependence\b/i)
        && has(/\b(addiction|oud|opioid use disorder)\b/i)
        && has(/\b(versus|vs|compare|comparison|difference)\b/i))) {
      return TARGETS.adaptation;
    }

    if (has(/\b(nociception|ascending pain pathway|descending pain pathway|pain gate control|a delta and c fibers|spinothalamic tract pain|endogenous opioid system|how pain travels to the brain)\b/i)
      || (has(/\bpain pathway\b/i) && !has(/\b(chest|abdominal|clinical pathway|care pathway)\b/i))) {
      return TARGETS.nociception;
    }
    if (has(/\b(nociceptive (?:versus|vs) neuropathic pain|pain types|central sensitization|peripheral sensitization|hyperalgesia (?:versus|vs) allodynia|allodynia|why touch hurts|pain amplification)\b/i)
      || (has(/\bhyperalgesia\b/i) && !has(/\bopioid|oih\b/i))) {
      return TARGETS.painMechanisms;
    }

    if (has(/\b(opioid withdrawal|opiate withdrawal|dope sick|opioid detox symptoms|cows score|clinical opiate withdrawal scale|heroin withdrawal|fentanyl withdrawal|pain pill withdrawal|opioid withdrawl|opiod withdrawal|opiod withdrawl)\b/i)
      || (has(/\bwithdrawl\b/i) && has(/\b(opioid|opiate|fentanyl|heroin|pain pills?|oxycodone|hydrocodone|morphine|methadone|buprenorphine)\b/i))) {
      return TARGETS.withdrawal;
    }
    if (has(/\b(opioid intoxication syndrome|opiate intoxication|opioid toxidrome|opioid high|miosis sedation|pinpoint pupils and drowsy)\b/i)) {
      return TARGETS.intoxication;
    }
    if (has(/\b(opioid overdose|opiate overdose|narcotic overdose|fentanyl overdose|heroin overdose|pain pill overdose|od on opioids|od on pain pills|pinpoint pupils slow breathing|cannot wake after opioid|blue lips after fentanyl|fentynal overdose|heroine overdose|opiod overdose|opiod overdoes)\b/i)
      && !has(/\b(reversal drug|antagonist comparison|naloxone (?:versus|vs)|narcan (?:versus|vs))\b/i)) {
      return TARGETS.overdose;
    }
    if (has(/\b(opioid use disorder|oud|opioid addiction|opiate use disorder|pain pill addiction|fentanyl addiction|heroin addiction|addicted to opioids|cant stop pain pills|opioid dependence with addiction|opiod use disorder)\b/i)) {
      return TARGETS.oud;
    }

    if (has(/\b(diacetylmorphine|diamorphine|street heroin|heroine drug|heroin use|dope opioid)\b/i)
      || text === "heroin" || text === "heroine") return TARGETS.heroin;
    return "";
  };

  const canonicalTarget = (input = "") => {
    if (isActiveOpioidEmergency(input)) return "";
    const raw = String(input || "");
    const deferSelegilineMeperidineInteraction = /\b(selegiline|selegeline|selegilin|seligiline|eldepryl|zelapar|emsam)\b/i.test(raw)
      && /\b(meperidine|demerol|pethidine)\b/i.test(raw)
      && /\b(interact(?:ion|s)?|serotonin(?: syndrome)?|maoi|mao[ -]?b)\b/i.test(raw);
    if (deferSelegilineMeperidineInteraction) return "";
    const concept = conceptTarget(input);
    if (concept) return concept;
    const routedDrug = wave24Match(input);
    return routedDrug ? (routedDrug.displayName || routedDrug.name || routedDrug.generic || "") : "";
  };

  if (baseHighYieldDrugClueMatch) {
    highYieldDrugClueMatch = function (input = "") {
      if (isActiveOpioidEmergency(input)) return null;
      const raw = String(input || "");
      if (/\b(selegiline|selegeline|selegilin|seligiline|eldepryl|zelapar|emsam)\b/i.test(raw)
        && /\b(meperidine|demerol|pethidine)\b/i.test(raw)
        && /\b(interact(?:ion|s)?|serotonin(?: syndrome)?|maoi|mao[ -]?b)\b/i.test(raw)) {
        return baseHighYieldDrugClueMatch(input);
      }
      return wave24Match(input) || baseHighYieldDrugClueMatch(input);
    };
    window.highYieldDrugClueMatch = highYieldDrugClueMatch;
  }

  if (baseMakeModelEnhancedResponse) {
    makeModelEnhancedResponse = function (input = "", ...args) {
      if (isActiveOpioidEmergency(input)) {
        return "**Emergency — possible opioid overdose:** Call 911 now. Give any available naloxone or other approved opioid-reversal product immediately and follow its instructions. Open the airway and begin rescue breathing or CPR/AED support as directed by the dispatcher or according to your training; do not delay ventilation or the emergency call while looking for naloxone. If the person does not respond or breathing becomes depressed again, use a new device and repeat the reversal medicine according to the product label. Stay with the person. If they are breathing, place them on their side in the recovery position. They still need emergency evaluation even if they wake up, because the opioid can outlast the reversal medicine and breathing can slow again.";
      }
      const target = canonicalTarget(input);
      if (!target) return baseMakeModelEnhancedResponse(input, ...args);
      return {
        type: "pharm-database",
        query: target,
        detailType: PATHOLOGY_TARGETS.has(normalize(target)) ? "pathology" : "drug",
        openDetail: true,
        highlightQuery: String(input || ""),
        preface: "Opening **" + target + "** in the clinical reference.",
        originalQuery: String(input || "")
      };
    };
    window.makeModelEnhancedResponse = makeModelEnhancedResponse;
  }

  window.ANI_OPIOID_WAVE24_ROUTING = {
    version: "2026-07-17-opioid-causal",
    targets: TARGETS,
    match: wave24Match,
    conceptTarget,
    canonicalTarget,
    isActiveOpioidEmergency
  };
}());
