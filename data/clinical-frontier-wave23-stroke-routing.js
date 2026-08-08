/* eslint-disable */
/* High-priority offline intent routing for the acute-stroke causal study wave. */
(function () {
  const baseMakeModelEnhancedResponse = typeof makeModelEnhancedResponse === "function"
    ? makeModelEnhancedResponse
    : null;
  if (!baseMakeModelEnhancedResponse) return;

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const TARGETS = {
    stroke: "Stroke",
    ischemic: "Ischemic stroke",
    cvt: "Cerebral venous thrombosis",
    perfusion: "Cerebral blood flow, autoregulation, and cerebral perfusion pressure",
    territories: "Circle of Willis and cerebral arterial territories",
    mca: "Middle cerebral artery stroke",
    aca: "Anterior cerebral artery stroke",
    pca: "Posterior cerebral artery stroke",
    posterior: "Vertebrobasilar and posterior circulation stroke",
    capsule: "Internal capsule and corticospinal tract stroke localization",
    hemisphere: "Dominant versus nondominant hemisphere stroke localization",
    penumbra: "Ischemic core and penumbra",
    lvo: "Large-vessel occlusion stroke",
    lacunar: "Lacunar stroke",
    broca: "Broca aphasia",
    wernicke: "Wernicke aphasia",
    neglect: "Hemispatial neglect",
    hemianopia: "Homonymous hemianopia and visual-field localization",
    mimics: "Stroke mimics and bedside glucose",
    nihss: "NIH Stroke Scale interpretation and limitations",
    time: "BE-FAST, last-known-well, and wake-up stroke",
    imaging: "Acute stroke imaging: noncontrast CT, CTA, CTP, DWI, and ADC",
    thrombolysis: "Intravenous thrombolysis for acute ischemic stroke",
    thrombectomy: "Mechanical thrombectomy for large-vessel occlusion",
    dysphagia: "Post-stroke dysphagia screening and aspiration prevention",
    monitoring: "Post-reperfusion stroke monitoring and cause workup"
  };

  const countSignals = (text, patterns) => patterns.reduce(
    (count, pattern) => count + (pattern.test(text) ? 1 : 0),
    0
  );

  const priorRouterClaimsEmergency = (input = "") => {
    const antidoteRouters = [
      window.ANI_ANTIDOTE_WAVE34_ROUTING,
      window.ANI_ANTIDOTE_WAVE33_ROUTING,
      window.ANI_ANTIDOTE_WAVE32_ROUTING,
      window.ANI_ANTIDOTE_WAVE31_ROUTING,
      window.ANI_ANTIDOTE_WAVE30_ROUTING,
      window.ANI_ANTIDOTE_WAVE29_ROUTING,
      window.ANI_ANTIDOTE_WAVE28_ROUTING,
      window.ANI_ANTIDOTE_WAVE26_ROUTING
    ];
    for (const routing of antidoteRouters) {
      if (!routing) continue;
      const method = typeof routing.isActiveEmergency === "function"
        ? routing.isActiveEmergency
        : routing.isActiveToxicologicEmergency;
      if (typeof method !== "function") continue;
      try {
        if (method.call(routing, input)) return true;
      } catch (_error) {
        // A lower-priority router must never break stroke emergency recognition.
      }
      break;
    }

    const opioidRouting = window.ANI_OPIOID_WAVE24_ROUTING;
    try {
      if (opioidRouting && typeof opioidRouting.isActiveOpioidEmergency === "function"
        && opioidRouting.isActiveOpioidEmergency(input)) return true;
    } catch (_error) {
      // Continue to the remaining emergency owners.
    }

    const renalRouting = window.ANI_RENAL_ACIDBASE_WAVE25_ROUTING;
    const renalMethods = [
      "isActiveDialysisAccessBleed",
      "isActiveMissedDialysisEmergency",
      "isActivePdPeritonitisConcern"
    ];
    try {
      if (renalRouting && renalMethods.some((name) => typeof renalRouting[name] === "function"
        && renalRouting[name](input))) return true;
    } catch (_error) {
      // Fall through to stroke recognition if a prior helper is unavailable.
    }
    return false;
  };

  const isActiveStrokeEmergency = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    if (/\b(study(?:ing)?|review(?:ing)?|nclex|practice question|quiz|case study|hypothetical|in this scenario|clinical scenario|exam question)\b/i.test(text)) return false;
    if (priorRouterClaimsEmergency(raw)) return false;
    const personal = /\b(i|im|i am|ive|i have|my|me|we|our|my mom|my dad|my child|he|she)\b/i.test(text);
    const active = /\b(right now|just started|just now|sudden(?:ly)?|new onset|currently|at this moment|minutes? ago|hours? ago|woke up|waking up|awoke|on waking|noticed)\b/i.test(text);
    const focalDeficit = /\b(cant speak|cannot speak|unable to speak|speech trouble|trouble speaking|difficulty speaking|cant get (?:the )?words out|expressive aphasia|receptive aphasia|slurred speech|face droop\w*|facial droop\w*|face(?:\s+\w+){0,3}\s+droop\w*|one sided weak\w*|one side weak\w*|unilateral weak\w*|(?:left|right) side (?:(?:is|feels?) )?(?:weak|numb)|one sided numb\w*|unilateral numb\w*|(?:cannot|cant) (?:move|raise|lift) (?:the |my |her |his )?(?:left |right )?(?:arm|leg|side)|vision\w*(?:\s+\w+){0,5}\s+(?:lost|loss|missing|gone)|lost vision|double vision|diplopia|cannot swallow|unable to swallow|dysphagia|worst headache of (?:my|her|his|their) life|thunderclap headache|new seizure|seizure|severe imbalance|severe ataxia|cannot walk|unable to walk|cannot (?:balance|stand)|unable to (?:balance|stand)|new confusion|confused|reduced consciousness|unresponsive|new neglect)\b/i.test(text);
    return personal && active && focalDeficit;
  };

  const targetFor = (input = "") => {
    const raw = String(input || "");
    const text = normalize(raw);
    const has = (pattern) => pattern.test(raw) || pattern.test(text);
    const strokeContext = has(/\b(stroke|storke|cva|acute ischemic stroke|ais|brain attack|brain infarct|focal neuro\w*|neuro\w* deficit|nihss|last known well|door to needle)\b/i);
    const venousThrombosisContext = has(/\b(cerebral venous sinus thromb\w*|cerebral venous thromb\w*|\bcvst\b)\b/i);
    const nonStrokeVascularContext = has(/\b(pulmonary embol\w*|\bpe\b|stemi|myocardial infarct\w*|heart attack|coronary|deep vein thromb\w*|\bdvt\b|acute limb ischemia|peripheral arterial|left ventricular outflow|cerebral venous sinus thromb\w*|cerebral venous thromb\w*|\bcvst\b)\b/i);

    if (priorRouterClaimsEmergency(raw) || isActiveStrokeEmergency(raw)) return "";
    if (venousThrombosisContext) return TARGETS.cvt;
    if (nonStrokeVascularContext && !strokeContext) return "";
    if (has(/\b(hemorrhagic stroke|intracerebral hemorrhage|subarachnoid hemorrhage|brain bleed|\bich\b|\bsah\b)\b/i)
      && has(/\b(thrombolys\w*|fibrinolys\w*|alteplase|tenecteplase|\btpa\b|\btnk\b|eligib\w*)\b/i)) return "";
    if (has(/\b(patient controlled analgesia|morphine|opioid|analgesia)\b/i) && has(/\bPCA\b/i)) return "";
    if (has(/\bPCA pump\b/i)) return "";
    if (has(/\b(affordable care act|insurance|health coverage|coverage plan)\b/i) && has(/\bACA\b/i)) return "";
    if (has(/\b(pension|retirement|contribution|cplusplus|c\+\+)\b/i) && has(/\bCPP\b/i)) return "";
    if (has(/\b(left ventricular outflow|outflow tract|cardiomyopathy)\b/i) && has(/\bLVO\b/i)) return "";
    if (has(/\b(kidney|renal|glomerul\w*)\b/i) && has(/\bsmall vessel\b/i)) return "";
    if (has(/\b(schizophrenia|psychosis|mania|thought disorder)\b/i) && has(/\bword salad\b/i)) return "";
    if (has(/\b(automatic identification system|vessel tracking|ship|marine|transponder)\b/i) && has(/\bAIS\b/i)) return "";
    if (has(/\bCBF\b/i) && has(/\b(brain tumor|neoplasm|oncolog\w*|tumor perfusion)\b/i)) return "";
    if (has(/\bwernicke aphasia\b/i) && has(/\bwernicke encephalopathy\b/i)) return "";
    if (has(/\b(middle|anterior|posterior) cerebral artery\b/i) && has(/\baneurysm\b/i)) return "";

    if ((has(/\bwernicke encephalopathy\b/i)
      || (has(/\bthiamine deficiency\b/i) && has(/\b(ophthalmoplegia|ataxia|confusion)\b/i)))
      && !has(/\baphasia\b/i)) return "";
    if (has(/\b(v\/?q|ventilation perfusion) mismatch\b/i)) return "";
    if (has(/\bmechanical valve\b/i) && !has(/\b(thrombect\w*|clot retrieval|\bEVT\b)\b/i)) return "";

    if (strokeContext
      && has(/\b(after|post)\s*(?:stroke\s*)?(?:tpa|tnk|alteplase|tenecteplase|thrombolysis|thrombectomy|evt|reperfusion)\b/i)
      && has(/\b(monitor|neuro check|blood pressure|\bBP\b|bleed|hemorrhag|deteriorat|headache|nausea|cause|etiology|secondary prevention|workup)\b/i)) {
      return TARGETS.monitoring;
    }
    if ((strokeContext || has(/\b(after|post) stroke\b/i))
      && (has(/\b(swallow|aspirat\w*|npo|wet voice|gag reflex)\b/i)
        || (has(/\b(water|drink|food|pill|medication|oral intake)\b/i)
          && has(/\b(give|allow|take|eat|drink|before|screen|safe|npo|nothing by mouth)\b/i))
        || (has(/\bdysphagia\b/i) && has(/\b(screen|nursing|aspirat\w*|npo|oral intake|after stroke)\b/i)))) {
      return TARGETS.dysphagia;
    }
    if (has(/\b(mechanical thrombect\w*|thrombectamy|endovascular thrombect\w*|clot retrieval|endovascular therapy|\bEVT\b|\bMT\b)\b/i)
      && (strokeContext || has(/\b(lvo|elvo|large vessel|basilar|m1|ica)\b/i))) {
      return TARGETS.thrombectomy;
    }
    const singleAlteplaseCausalQuestion = has(/\b(alteplase|activase|rtpa|\btpa\b|clot bust\w*)\b/i)
      && !has(/\b(tenecteplase|\btnk\b|versus|vs|compare|comparison)\b/i)
      && (
        (has(/\b(ct|head scan|brain scan|imaging)\b/i) && has(/\b(before|first|need|why)\b/i))
        || (has(/\b(aspirin|antiplatelet)\b/i) && has(/\b(after|right away|immediately|delay|wait)\b/i))
        || (has(/\b(bleed|bleeding|hemorrhage)\b/i) && has(/\b(why|can we not|cannot|cant|not just|might be)\b/i))
      );
    if (singleAlteplaseCausalQuestion) return "";
    if (has(/\b(thrombolys\w*|fibrinolys\w*|alteplase|tenecteplase|\btpa\b|\btnk\b|clot bust\w*)\b/i)
      && strokeContext) {
      return TARGETS.thrombolysis;
    }

    const imagingSignals = countSignals(raw, [
      /\b(noncontrast|non contrast|ncct|plain ct|head ct)\b/i,
      /\b(cta|ct angiograph\w*)\b/i,
      /\b(ctp|ct perfusion)\b/i,
      /\b(dwi|diffusion weighted)\b/i,
      /\b(adc|apparent diffusion coefficient)\b/i,
      /\b(mri|flair|perfusion mismatch)\b/i
    ]);
    if ((imagingSignals >= 2 && (strokeContext || has(/\b(thrombect\w*|penumbra|lvo)\b/i)))
      || has(/\b(stroke imaging|imaging for (?:acute )?stroke|ncct vs cta|cta vs ctp)\b/i)) {
      return TARGETS.imaging;
    }

    if (has(/\b(be[ -]?fast|fast stroke|last known well|last known normal|last seen well|\blkw\b|\blkn\b|wake[ -]?up stroke)\b/i)
      || (strokeContext && has(/\bunknown onset\b/i))) {
      return TARGETS.time;
    }
    if (has(/\b(nih stroke scale|nihss|stroke scale score)\b/i)) return TARGETS.nihss;
    if ((strokeContext && has(/\b(mimic|hypoglyc\w*|glucose|seizure|migraine|conversion|functional|bell palsy|toxic metabolic)\b/i))
      || has(/\bcheck glucose (?:in|for) (?:a )?stroke\b/i)) {
      return TARGETS.mimics;
    }

    if (has(/\b(ischemic core|ischaemic core|core penumbra|core versus penumbra|core vs penumbra|salvageable tissue)\b/i)
      || (has(/\b(penumbra|penumbara)\b/i) && has(/\b(ischemi\w*|stroke|brain|cerebr\w*|perfusion|infarct|core|salvage)\b/i))) {
      return TARGETS.penumbra;
    }
    if (has(/\b(large[ -]?vessel occlusion|large vessel stroke|\belvo\b)\b/i)
      || (has(/\bLVO\b/i) && strokeContext)) return TARGETS.lvo;
    if (has(/\b(lacunar|small vessel stroke|pure motor stroke|pure sensory stroke|pure sensory syndrome|ataxic hemiparesis|dysarthria clumsy hand)\b/i)
      || (has(/\bsmall[ -]?vessel disease\b/i) && strokeContext)
      || (has(/\b(penetrating|perforating) arter\w*\b/i) && has(/\b(pure motor|pure sensory|sensorimotor|ataxic|clumsy hand)\b/i))) {
      return TARGETS.lacunar;
    }

    const territorySignals = countSignals(raw, [/\bMCA\b/i, /\bACA\b/i, /\bPCA\b/i]);
    if (has(/\b(circle of willis|cerebral arterial territor\w*|brain artery territor\w*|mca aca pca|aca mca pca)\b/i)
      || (territorySignals >= 2 && has(/\b(compare|comparison|versus|vs|territor\w*)\b/i))) {
      return TARGETS.territories;
    }
    if (has(/\b(middle|anterior|posterior) cerebral artery\b/i) && has(/\b(anatomy|branches|blood supply)\b/i)) {
      return TARGETS.territories;
    }
    if (has(/\bmiddle cerebral artery\b/i)
      || (has(/\bMCA\b/i) && (strokeContext || has(/\b(infarct|territor\w*|syndrome)\b/i)))) return TARGETS.mca;
    if (has(/\banterior cerebral artery\b/i)
      || (has(/\bACA\b/i) && (strokeContext || has(/\b(infarct|territor\w*|syndrome|abulia)\b/i)))) return TARGETS.aca;
    if (has(/\bposterior cerebral artery\b/i)
      || (has(/\bPCA\b/i) && (strokeContext || has(/\b(infarct|territor\w*|syndrome|hemianop\w*)\b/i)))) return TARGETS.pca;
    if (has(/\b(vertebrobasilar|vertebral basilar|basilar artery occlusion|posterior circulation stroke|posterior stroke)\b/i)
      || (strokeContext && has(/\b(diplopia|dysarthria|dysphagia|ataxia|vertigo|crossed signs|locked[ -]?in)\b/i)
        && has(/\b(posterior|brainstem|cerebell\w*|basilar|vertebral)\b/i))) {
      return TARGETS.posterior;
    }

    if (has(/\b(internal capsule|corticospinal tract|pure motor hemiparesis|face arm leg weakness)\b/i)
      && (strokeContext || has(/\blocali[sz]\w*|upper motor neuron|contralateral\b/i))) {
      return TARGETS.capsule;
    }
    if (has(/\b(dominant hemisphere|nondominant hemisphere|non dominant hemisphere|left vs right hemisphere|right vs left hemisphere|language side|neglect side)\b/i)
      || (has(/\b(left|right) hemisphere\b/i) && has(/\b(language|aphasia)\b/i) && has(/\b(neglect|spatial attention)\b/i))
      || (strokeContext && has(/\b(aphasia versus neglect|aphasia vs neglect|dominant vs nondominant)\b/i))) {
      return TARGETS.hemisphere;
    }

    if (has(/\b(broca(?:s)? aphasia|expressive aphasia|nonfluent aphasia|motor aphasia|cant get (?:the )?words out|knows what (?:they|he|she) want(?:s)? to say)\b/i)
      || (has(/\bbroca\b/i) && has(/\b(wernicke|aphasia|speech|language|stroke)\b/i))) return TARGETS.broca;
    if (has(/\b(wernicke(?:s)? aphasia|receptive aphasia|fluent aphasia|sensory aphasia|fluent but (?:makes )?no sense|word salad|cannot understand language)\b/i)) {
      return TARGETS.wernicke;
    }
    if (has(/\b(hemispatial neglect|spatial neglect|left neglect|right neglect|extinction on double simultaneous stimulation)\b/i)
      || (strokeContext && (has(/\bignores? (?:the )?(?:left|right) side\b/i)
        || has(/\bignores?\b(?:\s+\w+){0,8}\s+on (?:the )?(?:left|right)\b/i)))) {
      return TARGETS.neglect;
    }
    if (has(/\b(homonymous hemianopia|homonymous hemianopsia|visual field cut|field cut|same side of vision|same (?:left|right) half of vision|half of vision.*both eyes|visual field locali[sz]\w*)\b/i)) {
      return TARGETS.hemianopia;
    }

    if ((has(/\b(cerebral perfusion pressure|cerebral autoregulation|brain autoregulation|cerebral blood flow)\b/i)
      || (has(/\b(CPP|CBF)\b/i) && has(/\b(brain|cerebr\w*|stroke|storke|neuro\w*|\bICP\b|\bMAP\b)\b/i)))
      && !has(/\bcardiopulmonary perfusion\b/i)) return TARGETS.perfusion;

    if (has(/\b(ischemic stroke|ischaemic stroke|clot caused stroke|clot stroke)\b/i)
      && has(/\b(what is|overview|pathophysiology|mechanism|how|cause|explain)\b/i)) return TARGETS.ischemic;
    if (text === "stroke" || text === "what is stroke" || text === "what is a stroke"
      || has(/\b(stroke overview|brain attack overview|explain a brain attack|what (?:is )?a stroke|stroke or brain attack|brain attack is)\b/i)) return TARGETS.stroke;

    return "";
  };

  makeModelEnhancedResponse = function (input = "", ...args) {
    if (priorRouterClaimsEmergency(input)) return baseMakeModelEnhancedResponse(input, ...args);
    if (isActiveStrokeEmergency(input)) {
      return "**Emergency:** Sudden trouble speaking, facial droop, one-sided weakness or numbness, new vision loss, or severe imbalance can be a stroke. Call 911 now and do not drive yourself. Note the exact last-known-well time. Do not give food, drink, or pills until emergency clinicians check swallowing, because stroke can make aspiration silent. Even if the symptoms improve, urgent evaluation is still needed because a transient ischemic attack can precede a larger stroke.";
    }
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

  window.ANI_STROKE_WAVE23_ROUTING = {
    version: "2026-07-17-stroke-causal",
    targets: TARGETS,
    canonicalTarget: targetFor,
    priorRouterClaimsEmergency,
    isActiveStrokeEmergency
  };
}());
