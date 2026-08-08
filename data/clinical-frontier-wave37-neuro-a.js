/* eslint-disable */
/* Wave 37 neuro-otology cohort A: mechanism-first vestibular and hearing references. */
(function () {
  "use strict";

  const VERSION = "2026-07-21-wave37-neuro-a-2";
  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const unique = (values) => Array.from(new Set((values || []).filter(Boolean)));

  const localSourceReferences = Object.freeze([
    {
      key: "w37-ncbi-vor",
      label: "NCBI Bookshelf: Neuroanatomy, Vestibulo-ocular Reflex (updated 2023)",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK545297/",
      note: "Supports VOR purpose, peripheral sensors, central pathways, ocular motor output, oscillopsia, and clinical assessment concepts."
    },
    {
      key: "w37-ncbi-central-vestibular",
      label: "NCBI Bookshelf Neuroscience: Central Vestibular Pathways—Eye, Head, and Body Reflexes",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK10987/",
      note: "Supports the canal-to-vestibular-nucleus-to-ocular-motor circuitry and the relationship between vestibular input, conjugate eye movement, posture, and gaze stability."
    },
    {
      key: "w37-vhit-review-2023",
      label: "Curthoys et al.: Geometrical basis and interpretation of video head impulse testing (Frontiers in Neurology, 2023)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10126377/",
      note: "Supports vHIT gain and saccade interpretation, canal-plane geometry, measurement assumptions, artifacts, and the need to interpret recordings rather than a single device number."
    },
    {
      key: "w37-aao-ssnhl-2019",
      label: "AAO-HNSF: Clinical Practice Guideline—Sudden Hearing Loss (Update), 2019",
      url: "https://pubmed.ncbi.nlm.nih.gov/31369359/",
      note: "Supports prompt conductive-versus-sensorineural differentiation, audiometric confirmation, retrocochlear evaluation, treatment windows, shared decisions, follow-up audiometry, and rehabilitation."
    },
    {
      key: "w37-nidcd-sudden-deafness",
      label: "NIH/NIDCD: Sudden Sensorineural Hearing Loss (Sudden Deafness)",
      url: "https://www.nidcd.nih.gov/health/sudden-deafness",
      note: "Supports emergency recognition, common presentations, audiometry, possible etiologies, time-sensitive specialist care, and longer-term hearing support."
    },
    {
      key: "w37-saem-grace3",
      label: "Society for Academic Emergency Medicine: GRACE-3 Acute Dizziness and Vertigo Guideline",
      url: "https://www.saem.org/publications/grace/grace-3",
      note: "Supports timing-and-trigger classification, trained-clinician use of HINTS in acute vestibular syndrome with nystagmus, hearing and gait assessment, imaging escalation, and the distinction from episodic syndromes."
    },
    {
      key: "w37-kattah-hints-2009",
      label: "Kattah et al.: HINTS to diagnose stroke in acute vestibular syndrome (Stroke, 2009)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4593511/",
      note: "Supports the physiologic basis and original prospective evidence for combining head impulse, nystagmus, and skew in a selected high-risk acute vestibular syndrome cohort."
    },
    {
      key: "w37-hints-meta-2023",
      label: "Tarnutzer et al.: Clinician training, stroke location, and bedside diagnostic accuracy in acute vestibular syndrome (meta-analysis, 2023)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10524166/",
      note: "Supports strong performance after appropriate training, differences in specificity by examiner background, stroke-location effects, and early MRI limitations."
    },
    {
      key: "w37-hints-ed-review-2020",
      label: "Ohle et al.: HINTS accuracy when used by emergency physicians—a systematic review and meta-analysis (2020)",
      url: "https://pubmed.ncbi.nlm.nih.gov/32167642/",
      note: "Supports caution against treating HINTS as an isolated rule-out test without validated training, correct patient selection, and adequate clinical integration."
    }
  ]);

  const database = window.ANI_FOUNDATIONS_DATABASE && typeof window.ANI_FOUNDATIONS_DATABASE === "object"
    ? window.ANI_FOUNDATIONS_DATABASE
    : { entries: [], sourceReferences: [] };
  if (!Array.isArray(database.entries)) database.entries = [];
  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];

  const referenceIndex = new Map(database.sourceReferences
    .filter((reference) => reference && reference.key)
    .map((reference, index) => [String(reference.key), index]));
  localSourceReferences.forEach((reference) => {
    const existingIndex = referenceIndex.get(reference.key);
    if (Number.isInteger(existingIndex)) database.sourceReferences[existingIndex] = { ...reference };
    else {
      referenceIndex.set(reference.key, database.sourceReferences.length);
      database.sourceReferences.push({ ...reference });
    }
  });
  const sourceByKey = new Map(database.sourceReferences.map((reference) => [String(reference.key), reference]));
  const sourceNoteFor = (keys) => unique(keys).map((key) => {
    const source = sourceByKey.get(key);
    if (!source) throw new Error("Unknown Wave37 neuro-otology source key: " + key);
    return source.label + " (" + source.url + ")";
  }).join("; ");

  const article = (spec) => {
    const sourceKeys = unique(spec.sourceKeys || []);
    return {
      icon: spec.icon || "Neuro",
      nclexEssential: true,
      educationalArticle: true,
      ...spec,
      aliases: unique(spec.aliases || []),
      abbreviations: unique(spec.abbreviations || []),
      commonMisspellings: unique(spec.commonMisspellings || []),
      relatedTopics: unique(spec.relatedTopics || []),
      tags: unique(["wave37", "clinical reference", "neuro-otology", "clinical reasoning", ...(spec.tags || [])]),
      sourceKeys,
      sourceNote: sourceNoteFor(sourceKeys),
      wave37NeuroCohort: "A",
      wave37NeuroRevision: VERSION
    };
  };

  const entries = [
    article({
      name: "Vestibulo-ocular reflex",
      type: "foundation",
      icon: "VOR",
      category: "Neurology and Otology / Vestibular Physiology / Eye Movement Control",
      aliases: [
        "vestibular ocular reflex", "vestibuloocular reflex", "gaze stabilization reflex", "head eye reflex", "eyes move opposite the head", "why do eyes stay on a target when the head moves", "how the eyes stabilize vision during head movement", "reflex that keeps vision steady", "vestibular gaze reflex", "inner ear eye movement reflex", "abnormal VOR", "loss of gaze stability", "head impulse reflex", "catch up eye movement after head turn", "jumpy vision when walking", "bouncing vision with head movement", "visual blurring during head motion", "oscillopsia mechanism", "VOR gain", "VOR adaptation", "semicircular canal eye reflex"
      ],
      abbreviations: ["VOR", "aVOR", "tVOR", "vHIT", "HIT", "DVA"],
      commonMisspellings: [
        "vestibulo occular reflex", "vestibulo ocular reflec", "vestibular occular reflex", "vestibulooccular reflex", "vestibulo ocular relex", "vestibulo ocullar reflex", "vestibulooccular refelx", "vestibular ocular refleks", "VOR reflec", "occilopsia", "osciliopsia", "vestibulo occulomotor reflex"
      ],
      summary: "The vestibulo-ocular reflex (VOR) is the rapid sensorimotor system that turns the eyes opposite to head movement so an image remains near the same place on the retina. Semicircular canals chiefly sense angular head motion; the utricle and saccule contribute information about linear acceleration, translation, and gravity. Vestibular afferents carry that signal to brainstem vestibular nuclei, which coordinate the abducens and oculomotor pathways and activate paired extraocular muscles. Because this short pathway acts faster than vision alone can correct retinal slip, it keeps signs, faces, and the environment readable while a person walks or turns. Cerebellar circuits continuously calibrate the response. A deficient VOR may cause oscillopsia, motion-related blur, imbalance, or corrective saccades, but an abnormal test does not by itself identify the cause or prove that disease is peripheral. Bedside head impulse, video head impulse, caloric testing, rotational testing, and dynamic visual acuity challenge different frequencies or parts of the system and are not interchangeable.",
      quickAnswer: "VOR is best understood as image stabilization, not as a general balance score. When the head rotates right, paired canal activity signals rightward motion and brainstem circuits drive the eyes left by a closely matched amount. If the eyes drift with the head because that pathway is underperforming, a later corrective saccade returns the target to the fovea. The size and timing of that correction help trained clinicians localize vestibular hypofunction. Normal bedside performance does not exclude every vestibular disorder, and an abnormal response is not automatically benign: fixation, visual acuity, covert saccades, neck motion, technique, medications, bilateral loss, and central lesions can alter what is seen. Formal interpretation joins symptoms, nystagmus, hearing, neurologic and gait findings, test quality, and sometimes quantitative vestibular studies. Rapid head movements and caloric stimulation are clinical procedures, not home self-tests; they can be unsafe or misleading without screening, training, and the correct setting.",
      sections: [
        { label: "Purpose: preventing retinal slip", text: "Clear vision requires a target's image to stay close to the fovea, the retinal region with the finest spatial resolution. Head motion would otherwise sweep the image across the retina faster than ordinary visual tracking could compensate, producing retinal slip and blur. The VOR predicts the needed correction from vestibular motion signals and drives the eyes in the opposite direction before the visual scene has time to look displaced. That feed-forward quality explains why the reflex remains useful in darkness and why loss is most obvious during walking, running, riding in a vehicle, or turning the head. Vision then supplies error information that helps recalibrate the reflex over longer time scales." },
        { label: "Peripheral sensors: semicircular canals", text: "Each inner ear contains anterior, posterior, and horizontal semicircular canals arranged in roughly orthogonal planes. During angular acceleration, the bony labyrinth moves before endolymph fully catches up; relative fluid motion deflects the cupula in the ampulla and changes vestibular hair-cell firing. Hair cells do not label 'dizziness.' They convert mechanical deflection into changes around a tonic baseline discharge. That baseline is crucial because one side can signal increased activity while its coplanar partner signals reduced activity. The central nervous system reads the difference as the direction and velocity of rotation. Canal orientation also explains why testing geometry matters: an impulse that is not aligned with the intended canal may stimulate a different combination and complicate interpretation." },
        { label: "Push-pull organization and resting tone", text: "Coplanar canals work as functional pairs. A head turn that excites one horizontal canal normally inhibits the partner on the other side, producing a strong contrast signal. At rest, their tonic activity is approximately balanced. Sudden unilateral loss removes one side of that balance, so the brain initially receives a pattern resembling continuous rotation toward the intact side even though the head is still. This mismatch helps explain spontaneous nystagmus, vertigo, nausea, and postural drift in acute unilateral vestibular hypofunction. Central compensation later rebalances resting activity, which can reduce spontaneous symptoms even though rapid head-movement responses remain deficient." },
        { label: "Otolith contribution: translation and gravity", text: "The utricle and saccule contain hair cells loaded by otoconia, making them sensitive to linear acceleration and head orientation relative to gravity. Their ocular reflexes help stabilize gaze during translation and contribute to torsional and vertical eye alignment. The same graviceptive network connects to pathways that keep the eyes level. An unequal central interpretation can therefore produce an ocular tilt reaction or skew deviation. Otolith and canal signals interact, so the VOR is not one simple horizontal wire. The angular VOR is usually emphasized in head impulse testing, while translational VOR becomes especially relevant when the viewing target is near because the two eyes require different compensatory movements." },
        { label: "The rapid brainstem ocular-motor pathway", text: "Primary vestibular afferents travel in the vestibular division of cranial nerve VIII to vestibular nuclei in the pons and medulla. Interneurons then project through pathways including the medial longitudinal fasciculus to abducens and oculomotor nuclei. For a horizontal response, the circuit coordinates one lateral rectus with the opposite medial rectus so both eyes rotate together. Inhibitory pathways relax antagonists rather than letting competing muscles fight the movement. This compact route is often described as a three-neuron arc, but real gaze control also receives cerebellar, visual, proprioceptive, and cortical influence. A lesion anywhere from labyrinth to nerve, nuclei, connecting tract, ocular-motor nucleus, neuromuscular junction, muscle, or vision can affect the observed response for different reasons." },
        { label: "Gain, phase, and frequency", text: "VOR gain compares eye velocity with head velocity; ideal horizontal stabilization during ordinary rotation is near equal magnitude in the opposite direction. Phase describes timing. Both matter: eyes that move the correct distance too late still permit retinal slip. Gain is not a universal pass-fail constant. It changes with stimulus frequency, target distance, viewing conditions, age, equipment, calibration, and analysis method. Caloric testing uses a very low-frequency vestibular stimulus, rotational chair tests lower-to-mid frequencies, and head impulses probe high-frequency performance similar to abrupt real-world head movement. A patient can therefore have an abnormal result on one test and a less abnormal result on another without either test being 'wrong.'" },
        { label: "Cerebellar calibration, adaptation, and compensation", text: "The cerebellar flocculus and related networks compare intended gaze with visual error and adjust reflex gain. New glasses, vestibular injury, and recovery can make the old calibration inaccurate; repeated paired head-and-visual experience drives adaptation. Compensation also involves reweighting vision and somatosensation, restoring central resting balance, and learning substitution strategies such as predictive or catch-up saccades. Symptom improvement does not necessarily mean the damaged sensory organ recovered. The brain may have learned to manage the remaining signal. Conversely, sedating vestibular suppressants, prolonged immobility, poor vision, neuropathy, migraine, anxiety, or inconsistent activity can slow functional recovery even when the original lesion is stable." },
        { label: "What VOR failure feels like", text: "Oscillopsia is the illusion that the environment bounces, jumps, or smears during motion because images are not held steadily on the retina. People may see clearly while seated yet lose lines of text or road signs while walking. Bilateral loss often causes especially prominent motion blur and unsteadiness in darkness or on uneven ground because both vestibular input and visual compensation are limited. Unilateral loss may present more with acute vertigo and asymmetry, then improve as compensation develops. Symptoms are not specific: ocular disease, central disorders, migraine, medication effects, orthostatic symptoms, neuropathy, and functional dizziness can resemble parts of this experience. A symptom history must be linked to examination rather than translated directly into a VOR diagnosis." },
        { label: "Bedside head impulse: physiologic interpretation", text: "A trained clinician can challenge the high-frequency angular VOR while observing whether fixation is maintained. If the eyes leave the target with the head and then make a refixation saccade, the response suggests reduced gain for the stimulated pathway. A saccade visible after the head stops is overt; one occurring during the movement is covert and can be missed by unaided observation. A normal bedside response in a patient with genuine continuous acute vestibular syndrome can be a central warning rather than simple reassurance, because a destructive peripheral lesion would ordinarily reduce the ipsilesional response. However, this logic applies only within the correct syndrome and alongside the rest of the examination." },
        { label: "Video head impulse testing", text: "vHIT records head and eye velocity with a high-speed camera and calculates canal-specific gain and refixation saccades. It can expose covert saccades and quantify all six canals when performed correctly. The tracing is the evidence; a color-coded device label is only a summary. Loose goggles, strap slippage, camera movement, eyelashes, pupil loss, blinking, poor calibration, target distance, anticipatory saccades, inadequate peak acceleration, excessive head excursion, and wrong canal-plane alignment can create false abnormalities or hide real ones. Gain formulas and normal ranges differ across systems. Experts inspect impulse quality, reproducibility, asymmetry, saccade timing, and the clinical pattern before assigning meaning." },
        { label: "Calorics, rotational chair, and dynamic visual acuity", text: "Caloric irrigation creates a temperature-driven endolymph effect that predominantly assesses each horizontal canal at an artificial, very low-frequency stimulus. It is valuable for side-to-side comparison but does not measure the same operating range as vHIT. Rotational chair testing stimulates both labyrinths together across selected frequencies and is useful for bilateral weakness, compensation, or resolving equivocal calorics, although side localization may be limited. Dynamic visual acuity asks whether visual resolution degrades with controlled head motion; it reflects functional gaze stability but also depends on baseline acuity, attention, timing, and compensatory saccades. No single test describes the entire vestibular system." },
        { label: "False-positive and false-negative patterns", text: "An apparent corrective saccade can reflect loss of fixation, poor vision, misunderstanding, anxiety, examiner movement, or ocular-motor disease rather than vestibular hypofunction. Covert saccades, mild or frequency-specific loss, bilateral symmetric loss, and partial compensation can make bedside head impulse appear normal. Cervical guarding may prevent an adequate stimulus. Some central lesions involving vestibular nuclei, cerebellar structures, or their connections can reduce gain, so an abnormal impulse does not guarantee a peripheral disorder. Conversely, many central causes leave the bedside head impulse normal. These exceptions are why VOR findings should never erase focal neurologic signs, severe truncal instability, new headache or neck pain, acute hearing loss, or a central nystagmus pattern." },
        { label: "Safety and why this is not a self-test", text: "Rapid passive head movement requires trained technique and prior screening. Acute cervical trauma, suspected instability, severe pain or restricted motion, certain inflammatory or skeletal disorders, recent neck surgery, and other clinician-identified risks may make head impulse inappropriate or require modification. A patient cannot reliably surprise their own vestibular system while also judging subtle eye movement, and phone video does not convert an unsupervised attempt into a validated examination. Caloric or rotational testing can provoke severe vertigo, nausea, vomiting, or falls and belongs in an equipped clinical setting. Education may explain what the tests mean; it should not encourage forceful home maneuvers." },
        { label: "Nursing assessment and fall prevention", text: "Nursing care begins with function and trajectory: onset and timing of dizziness, continuous versus episodic symptoms, triggers, ability to sit and walk, vomiting, hydration, hearing change, diplopia, dysarthria, weakness, numbness, headache, neck pain, recent trauma, and medication exposure. Institute fall precautions when gait or visual stability is impaired; assist transfers, keep needed items within reach, reduce unassisted walking in darkness, and monitor orthostatic and neurologic status as indicated. During vestibular testing, prepare for nausea, protect the patient from falls, follow local medication-hold instructions, and document tolerance. In rehabilitation, reinforce the prescribed progression without improvising more intense exercises when symptoms or neurologic findings change." },
        { label: "Emergency implications", text: "A VOR finding is never an emergency diagnosis by itself. New continuous vertigo or imbalance with focal neurologic deficit, inability to stand or walk safely, new severe headache or neck pain, central-appearing nystagmus, new unilateral hearing loss, syncope, trauma, toxic exposure, or progressive change requires urgent assessment for stroke and other dangerous causes. In acute vestibular syndrome, head impulse contributes to HINTS only when a clinician trained in that examination evaluates a currently symptomatic patient with spontaneous nystagmus. An isolated 'positive head impulse' should not be used to discharge a patient whose history or other findings remain dangerous." },
        { label: "Connected concepts and durable reasoning", text: "Connect the VOR to semicircular canals, utricle and saccule, vestibular nerve, vestibular nuclei, medial longitudinal fasciculus, cranial nerves III and VI, extraocular muscles, cerebellar flocculus, nystagmus, vestibular neuritis, bilateral vestibulopathy, oscillopsia, vestibular rehabilitation, head impulse testing, vHIT, calorics, rotational chair testing, dynamic visual acuity, acute vestibular syndrome, HINTS, posterior circulation stroke, and brainstem reflexes. The durable chain is motion sensor to neural comparison to ocular-motor command to retinal stability; symptoms and tests make sense when each link and each possible failure is considered." }
      ],
      relatedTopics: ["Semicircular canals", "Utricle and saccule", "Vestibular nerve", "Vestibular nuclei", "Medial longitudinal fasciculus", "Extraocular muscles", "Nystagmus", "Oscillopsia", "Vestibular neuritis", "Bilateral vestibulopathy", "Vestibular rehabilitation", "Head impulse test", "Video head impulse test", "Caloric testing", "Rotational chair testing", "Dynamic visual acuity", "HINTS examination", "Posterior circulation stroke"],
      tags: ["vestibulo-ocular reflex", "VOR", "gaze stabilization", "retinal slip", "semicircular canals", "otoliths", "oscillopsia", "head impulse", "vHIT", "caloric testing", "vestibular rehabilitation", "nystagmus", "eye movements"],
      sourceKeys: ["w37-ncbi-vor", "w37-ncbi-central-vestibular", "w37-vhit-review-2023", "w37-saem-grace3"]
    }),

    article({
      name: "Sudden sensorineural hearing loss",
      type: "condition",
      icon: "Ear",
      category: "Neurology and Otology / Hearing Emergencies / Inner Ear Disorders",
      aliases: [
        "sudden hearing loss", "sudden deafness", "sudden inner ear hearing loss", "idiopathic sudden sensorineural hearing loss", "acute sensorineural hearing loss", "suddenly cannot hear in one ear", "woke up deaf in one ear", "hearing disappeared overnight", "one ear suddenly muffled", "sudden blocked ear but no wax", "sudden ear fullness and tinnitus", "sudden ringing and hearing loss", "sudden hearing loss with dizziness", "hearing suddenly sounds distorted", "one sided sudden hearing loss", "rapid hearing loss over a few days", "medical emergency hearing loss", "ear feels clogged after waking", "sudden loss of hearing without pain", "why did hearing vanish in one ear"
      ],
      abbreviations: ["SSNHL", "SSHL", "SNHL", "ISSNHL", "SHL", "PTA", "WRS", "SRT", "ABR", "IT steroid", "HBOT"],
      commonMisspellings: [
        "sudden sensorineurel hearing loss", "sudden sensorial hearing loss", "sudden sensorineural hearling loss", "sudden sensoneural hearing loss", "sudden neurosensory hearing loss", "sudden sensor neural hearing loss", "sudden sensori neural hearing loss", "SSNHL hearing lost", "suden deafness", "sudden hear loss", "sudden hearing lose", "idiopatic sudden hearing loss"
      ],
      summary: "Sudden sensorineural hearing loss (SSNHL) is a rapid loss of hearing caused by dysfunction of the cochlea, auditory nerve, or their immediate pathways rather than by obstruction of the ear canal or impaired middle-ear sound transmission. A commonly used audiometric definition is a decrease of at least 30 dB across three neighboring frequencies within 72 hours, but a smaller abrupt change can still be clinically important, especially when prior hearing was asymmetric or no baseline test exists. Patients often describe a blocked or full ear, new tinnitus, distorted sound, or waking with one ear unable to understand speech, so the condition is easily mistaken for wax, congestion, or eustachian tube dysfunction. Treat sudden unexplained hearing loss as a medical urgency: promptly distinguish conductive from sensorineural loss, obtain audiometry, identify bilateral, recurrent, neurologic, traumatic, infectious, vascular, toxic, or autoimmune clues, and coordinate urgent otolaryngology or emergency evaluation. Time matters because evidence-based treatment options are concentrated early, yet treatment decisions require discussion of uncertain benefit and patient-specific risk.",
      quickAnswer: "A normal-looking ear does not make sudden hearing loss harmless. External-canal wax and middle-ear fluid cause conductive loss; SSNHL arises deeper and may leave otoscopy normal. Bedside tuning-fork findings can help triage but are technique- and frequency-limited and must not delay audiometry or referral when the history is convincing. Adult guideline priorities include audiometric confirmation as soon as possible and within 14 days, evaluation for retrocochlear pathology with MRI or ABR, and shared decision-making about corticosteroids offered within two weeks when idiopathic SSNHL is suspected. Incomplete recovery may prompt specialist discussion of intratympanic steroid salvage during weeks two through six; hyperbaric oxygen is an option only in selected settings and is paired with steroid therapy within specified early windows. Routine head CT, broad untargeted laboratory panels, antivirals, thrombolytics, vasodilators, and vasoactive drugs are not default idiopathic-SSNHL care. New focal neurologic findings, severe gait disorder, acute vestibular syndrome, head trauma, meningitic illness, bilateral loss, or other instability changes the emergency pathway.",
      sections: [
        { label: "What the term means—and what it does not", text: "Sudden hearing loss is initially a symptom, not a final diagnosis. The first branch is conductive versus sensorineural. Conductive loss means sound is attenuated before it reaches the cochlea, as with canal occlusion, tympanic-membrane disease, or middle-ear fluid. Sensorineural loss reflects dysfunction in cochlear sensory transduction, the auditory nerve, or central auditory pathways. 'Idiopathic SSNHL' is used when an appropriate evaluation finds no specific cause; it should not be assigned before looking for modifying features. The AAO-HNSF adult guideline mainly addresses idiopathic cases and does not replace cause-specific care for stroke, trauma, infection, autoimmune disease, ototoxicity, neoplasm, or childhood hearing loss." },
        { label: "Why rapid recognition matters", text: "Cochlear hair cells and spiral-ganglion neurons convert precisely organized mechanical vibration into neural patterns for pitch and speech. They have limited regenerative capacity in humans. Abrupt inflammation, microvascular compromise, membrane injury, immune activity, or another insult can disrupt transduction before the external ear looks abnormal. Therapies proposed for idiopathic SSNHL are most plausible while injury is evolving rather than after irreversible loss and central reorganization. Clinical trials do not establish a guaranteed rescue, and spontaneous improvement makes efficacy difficult to measure, but delayed recognition can close the guideline-supported window for informed treatment choices. Urgency means same-day clinical contact and rapid coordination, not self-starting leftover medication." },
        { label: "Presentation and common language", text: "Many patients do not say 'hearing loss.' They report that an ear is blocked, voices sound robotic or distant, a phone works on only one side, localization suddenly fails, music is distorted, or tinnitus appeared with fullness. Some notice a pop. Loss is usually unilateral; vertigo or imbalance can occur and may imply broader labyrinthine involvement or a central vascular process. There may be no pain, drainage, fever, or visible abnormality. Because upper-respiratory symptoms and pressure sensations are common, anchoring on congestion is a major source of delay. Ask the person to compare ears using ordinary function, but do not substitute informal phone or finger tests for calibrated audiometry." },
        { label: "Audiometric definition and its limitations", text: "The conventional research definition uses a threshold decrease of at least 30 dB at three contiguous frequencies developing over no more than 72 hours. It creates a reproducible study boundary, not a biological cliff. A person with a smaller drop, a loss limited to speech-important frequencies, poor word recognition, or no prior audiogram may still have urgent sensorineural injury. Current testing is compared with an earlier audiogram when available; otherwise the opposite ear or population expectations provide an imperfect reference. Pure-tone thresholds show detection across frequency, while speech reception and word recognition add functional information. Tympanometry and acoustic measures help assess conductive mechanisms. The pattern guides reasoning but rarely names the cause by itself." },
        { label: "Plausible mechanisms and why most cases remain idiopathic", text: "Proposed mechanisms include inflammatory injury, immune-mediated inner-ear disease, vascular compromise, membrane disruption, and viral-associated responses. The cochlea has demanding metabolism and a delicate end-arterial supply, which makes ischemia biologically plausible; its fluid and ion gradients make inflammation or membrane disturbance potentially disruptive. Yet a plausible mechanism is not the same as a proven cause in an individual. Most adult unilateral cases lack a definitive etiologic marker after evaluation. This uncertainty explains why routine shotgun testing has low yield and why treatment recommendations emphasize options, natural history, risks, and shared decisions rather than claiming that one drug corrects a known lesion." },
        { label: "Identifiable causes and modifying factors", text: "Targeted history and examination look for head or acoustic trauma, recent surgery or pressure exposure, meningitic or systemic infection, autoimmune or inflammatory disease, neurologic symptoms, vascular risk, recurrent or fluctuating episodes, bilateral involvement, pregnancy, cancer, and exposure to ototoxic medicines. Ménière disease more often causes recurrent fluctuating hearing loss with episodic vertigo and aural symptoms, but a first event may be difficult to classify. Vestibular schwannoma and other retrocochlear lesions can present with asymmetric hearing, although sudden onset is less typical. Bilateral or recurrent loss raises concern for systemic, genetic, toxic, autoimmune, or central processes and deserves a cause-specific workup rather than automatic idiopathic labeling." },
        { label: "Emergency red flags", text: "Activate an emergency neurologic or systemic pathway when sudden hearing change accompanies facial weakness or numbness, diplopia, dysarthria, dysphagia, limb weakness or incoordination, severe truncal ataxia, new severe headache or neck pain, altered consciousness, or other focal findings. Acute unilateral hearing loss with continuous vertigo and spontaneous nystagmus can occur with inner-ear ischemia or an anterior inferior cerebellar artery territory stroke; it should not be dismissed as a benign ear disorder. Also escalate head trauma, barotrauma with severe symptoms, toxic exposure, rapidly progressive bilateral loss, fever with meningeal features, severe ear infection complications, or hemodynamic instability. A normal noncontrast head CT does not exclude inner-ear pathology or early posterior circulation ischemia." },
        { label: "Initial examination: locating the problem", text: "Record exact onset, whether loss was instantaneous or evolved over days, laterality, baseline hearing, tinnitus, fullness, vertigo, pain, discharge, recent infection, trauma, noise or pressure event, neurologic symptoms, recurrent episodes, and medication exposures. Otoscopy may reveal cerumen, foreign body, perforation, effusion, or infection, but a normal canal and tympanic membrane do not assess cochlear function. Compare gross hearing, inspect cranial nerves and eye movements, assess gait and coordination when safe, and look for mastoid, infectious, vascular, or traumatic signs. The goal is not to finish the diagnosis at bedside; it is to recognize sensorineural risk quickly enough to route the patient correctly." },
        { label: "Tuning forks: useful triage with real limits", text: "Weber and Rinne testing can support conductive-versus-sensorineural localization when performed by a trained clinician with an appropriate tuning fork and interpreted together. In unilateral sensorineural loss, Weber often lateralizes toward the better ear; with conductive loss, it often lateralizes toward the affected ear. Rinne usually remains air-conduction greater than bone-conduction in sensorineural loss but may reverse in substantial conductive loss. These patterns can fail with mild loss, mixed disease, profound unilateral loss, background noise, incorrect placement, patient misunderstanding, or examiner error. A reassuring or ambiguous tuning-fork result must not cancel a convincing sudden-loss history or delay audiometry." },
        { label: "Audiometry and prompt specialist coordination", text: "Formal audiometry should be obtained as soon as feasible; the adult AAO-HNSF guideline specifies confirmation within 14 days of symptom onset. Earlier is better because results establish severity and configuration, document word recognition, help distinguish conductive or mixed loss, and create a baseline for treatment response. The 14-day outer target should not be misread as permission to wait two weeks before seeking care. When same-day audiology is unavailable, clinicians should communicate the time-sensitive concern to otolaryngology or an appropriate emergency service and arrange the fastest reliable pathway. Repeat audiometry is needed at the end of treatment and within six months, with earlier testing often guiding salvage decisions." },
        { label: "Retrocochlear and cause-directed evaluation", text: "MRI focused on the internal auditory canals and brain is generally the most direct way to assess vestibular schwannoma and other retrocochlear or central pathology. Auditory brainstem response can be used in selected circumstances but may miss small lesions and can itself be affected by hearing loss. The choice considers availability, contraindications, probability, and patient preference. Routine noncontrast head CT is not recommended merely to evaluate presumptive idiopathic SSNHL because it poorly assesses the cochlea, auditory nerve, small internal-canal lesions, and early posterior fossa ischemia. CT remains appropriate for specific questions such as temporal-bone trauma or another clinician-identified indication." },
        { label: "Why broad routine laboratory panels are discouraged", text: "Untargeted blood panels in otherwise typical idiopathic SSNHL produce false positives, cost, anxiety, and cascades more often than actionable diagnoses. This is different from saying laboratory testing is never useful. Bilateral or recurrent disease, systemic inflammatory features, infection risk, toxic exposure, hematologic concerns, or another specific clue can justify focused testing. The reasoning is Bayesian: a test helps when the pretest question is defined and the result would change management. Ordering every possible infectious, autoimmune, clotting, or metabolic marker without a compatible history dilutes useful signal and may distract from audiometry, imaging, and timely treatment discussion." },
        { label: "Initial corticosteroids and shared decision-making", text: "For adults with presumed idiopathic SSNHL, the guideline treats corticosteroids within two weeks of onset as an option, not a promise or universal mandate. The proposed benefit is reduction of inflammatory and edematous injury in the cochlea, but evidence is limited by spontaneous recovery, variable definitions, and heterogeneous studies. Systemic steroids can worsen glucose control, blood pressure, mood, sleep, infection risk, gastrointestinal symptoms, and other conditions; interactions and contraindications matter. Intratympanic delivery reduces systemic exposure but involves a procedure and does not eliminate adverse effects. The clinician and patient should weigh severity, timing, comorbidities, preferences, access, uncertain benefit, and the consequences of no treatment." },
        { label: "Intratympanic therapy, salvage, and hyperbaric oxygen", text: "Medication placed through the tympanic membrane can diffuse toward the inner ear, permitting high local steroid exposure. It may be considered initially when systemic treatment is unsuitable and is recommended as a specialist-offered salvage option for incomplete recovery two to six weeks after onset. Procedure-specific issues include pain, transient dizziness, infection, and persistent tympanic-membrane perforation. Hyperbaric oxygen aims to increase dissolved oxygen reaching vulnerable cochlear tissue; the adult guideline lists it only as an option combined with steroids, within two weeks as initial therapy or within one month as salvage. Access, pressure injury, oxygen toxicity, confinement, cost, and contraindications require specialist assessment. It is not a stand-alone home oxygen strategy." },
        { label: "Treatments not used routinely for idiopathic SSNHL", text: "Routine antivirals are not supported simply because a viral mechanism is conceivable; a biologic theory without evidence of clinical benefit does not justify exposure. Routine thrombolytics, vasodilators, or vasoactive substances are also discouraged because presumed microvascular injury is not proof of a treatable clot and these therapies can harm. This guidance concerns idiopathic SSNHL. It does not prevent cause-specific therapy when a defined infection, autoimmune disease, toxin, vascular emergency, or other diagnosis is established. Supplements and unregulated remedies can interact with prescribed care and consume a narrow treatment window, so patients should discuss them rather than delaying evaluation." },
        { label: "Prognosis, uncertainty, and follow-up", text: "Recovery ranges from complete to none and may occur spontaneously, particularly early. Initial severity, audiogram configuration, age, vertigo, timing, and other factors show group associations but cannot predict an individual's outcome with certainty. Early improvement is encouraging, yet a temporary subjective change should be confirmed because tinnitus, recruitment, attention, and listening environment affect perceived hearing. Follow-up audiometry documents actual thresholds and word recognition, identifies incomplete recovery while salvage options may still be discussed, and provides a baseline for rehabilitation. Recurrence, contralateral symptoms, progressive asymmetry, or new neurologic signs should reopen the diagnostic question rather than being attributed automatically to the prior episode." },
        { label: "Nursing care and medication safety", text: "Nurses can prevent delay by treating 'clogged ear,' new unilateral tinnitus, and sudden speech-understanding difficulty as possible hearing loss even when pain and otoscopy are unremarkable. Document onset time, affected side, functional change, dizziness and gait, neurologic symptoms, exposures, baseline hearing devices, and the referral plan. For systemic steroids, monitor the prescribed safety parameters such as glucose, blood pressure, mood, sleep, infection symptoms, and gastrointestinal effects according to the patient's risks and local protocol. After intratympanic procedures, follow positioning and ear-care instructions, observe for severe vertigo or other complications, and verify that follow-up audiometry and specialist appointments are not lost during transitions." },
        { label: "Communication, tinnitus, and rehabilitation", text: "Unilateral loss can impair sound localization, speech understanding in noise, workplace safety, driving awareness, sleep, and emotional well-being even when the better ear hears ordinary conversation. Face the patient, reduce background noise, speak clearly without shouting or exaggerating lip movement, confirm understanding, and provide written information in an accessible format. Persistent loss may be addressed with conventional hearing aids, contralateral routing systems, bone-conduction devices, or cochlear implantation depending on anatomy and severity. Tinnitus counseling, sound strategies, mental-health support, and occupational accommodations matter because recovery is not only an audiogram outcome. Rehabilitation should begin when a need is identified rather than being withheld as a sign that acute treatment has 'failed.'" },
        { label: "Misdiagnosis, false reassurance, and durable rules", text: "Wax or effusion found in the canal does not necessarily explain the full reported change; mixed pathology can coexist. A normal tympanic membrane, lack of pain, or normal head CT cannot rule out SSNHL. Bedside hearing comparisons and tuning forks can miss frequency-specific or partial loss. Conversely, subjective muffling does not prove sensorineural injury; audiometry may show conductive loss or no measurable threshold change. The safe durable rule is to preserve the timeline: an abrupt unexplained change deserves prompt objective hearing assessment and expert routing, while neurologic or systemic red flags require an emergency pathway. Do not wait for spontaneous recovery before arranging evaluation, and do not self-treat with leftover steroids." },
        { label: "Connected topics", text: "Connect SSNHL to conductive hearing loss, cerumen impaction, otitis media with effusion, audiometry, speech discrimination, tympanometry, tuning-fork tests, cochlear anatomy, hair cells, cranial nerve VIII, tinnitus, vestibular schwannoma, Ménière disease, labyrinthitis, vestibular neuritis, autoimmune inner-ear disease, ototoxicity, acoustic trauma, perilymphatic fistula, posterior circulation stroke, acute vestibular syndrome, HINTS Plus, MRI of the internal auditory canals, corticosteroid safety, intratympanic injection, hyperbaric oxygen, hearing aids, cochlear implants, and communication access." }
      ],
      relatedTopics: ["Conductive hearing loss", "Sensorineural hearing loss", "Audiometry", "Speech discrimination testing", "Tympanometry", "Weber test", "Rinne test", "Cochlea", "Auditory nerve", "Tinnitus", "Vestibular schwannoma", "Ménière disease", "Labyrinthitis", "Vestibular neuritis", "Autoimmune inner-ear disease", "Ototoxicity", "Acoustic trauma", "Posterior circulation stroke", "HINTS examination", "Corticosteroids", "Intratympanic steroid injection", "Hyperbaric oxygen therapy", "Hearing aids", "Cochlear implants"],
      tags: ["sudden sensorineural hearing loss", "SSNHL", "sudden deafness", "hearing emergency", "audiometry", "tinnitus", "ear fullness", "corticosteroids", "intratympanic steroids", "hyperbaric oxygen", "MRI internal auditory canal", "audiologic rehabilitation"],
      sourceKeys: ["w37-aao-ssnhl-2019", "w37-nidcd-sudden-deafness", "w37-saem-grace3"]
    }),

    article({
      name: "HINTS examination",
      type: "physical-examination-maneuver",
      icon: "HINTS",
      category: "Diagnostics and Tests / Clinical Signs and Examination Findings / Neurologic and Vestibular Examination",
      encyclopediaSection: "clinical-signs",
      aliases: [
        "HINTS exam", "HINTS test", "head impulse nystagmus test of skew", "head impulse nystagmus skew examination", "HINTS bedside eye exam", "HINTS for stroke", "HINTS vertigo exam", "central versus peripheral vertigo exam", "eye movement exam for posterior stroke", "acute vestibular syndrome eye tests", "continuous vertigo nystagmus stroke exam", "HINTS Plus", "HINTS plus hearing", "head impulse nystagmus skew", "normal head impulse direction changing nystagmus skew", "how clinicians distinguish vestibular neuritis from stroke", "bedside exam for continuous dizziness", "why HINTS is not for every dizzy patient", "when can HINTS be used", "trained clinician HINTS"
      ],
      abbreviations: ["HINTS", "HINTS+", "AVS", "hHIT", "HIT", "INFARCT", "MRI-DWI", "AICA", "PICA"],
      commonMisspellings: [
        "HINTS examinaton", "HINTS examm", "HINTS assesment", "HINT test vertigo", "head impulce nystagmus skew", "head impuls nystagmus test", "nistagmus test of skew", "nystagmus skew examinaton", "HINTS nuerology", "HINTS vestibuler", "HINTs stroke exame", "hints vertago test"
      ],
      summary: "HINTS is a three-part bedside eye-movement examination—head impulse, nystagmus assessment, and test of skew—used by specifically trained clinicians to help distinguish a peripheral acute unilateral vestibular disorder, usually vestibular neuritis, from stroke or another central cause. Its validated clinical role is narrow: a patient must have an acute vestibular syndrome with ongoing, continuous dizziness or vertigo and spontaneous nystagmus at the time of examination. It is not a generic dizziness test, not a screening maneuver for brief positional attacks, and not a home self-test. The components are interpreted together. In the correct syndrome, a normal horizontal head impulse, direction-changing gaze-evoked or vertical/torsional nystagmus, or vertical ocular realignment on alternate cover is concerning for central disease; any one central feature makes the overall battery central or equivocal rather than reassuring. An abnormal unilateral head impulse alone does not erase other danger signs because some brainstem or cerebellar strokes affect vestibular pathways and can mimic peripheral loss. Accuracy depends on patient selection, examiner training, technique, and integration with hearing, gait, cranial-nerve, coordination, and other neurologic findings.",
      quickAnswer: "Use HINTS only when the clinical question is specifically 'vestibular neuritis-like acute vestibular syndrome or central lesion?' The patient should be acutely and persistently symptomatic and have spontaneous nystagmus; a person with episodic dizziness, triggered seconds-long positional symptoms, no nystagmus, intoxication, syncope, generalized weakness, or an obvious focal neurologic deficit is not converted into an appropriate HINTS case by performing the three maneuvers. A trained clinician identifies the pattern, not three independent yes/no results. A peripheral-compatible pattern requires an abnormal unilateral head impulse consistent with vestibular hypofunction, unidirectional predominantly horizontal nystagmus, and no skew. A normal impulse, direction change with gaze, vertical or purely torsional nystagmus, skew, an internally inconsistent or untestable element, or another central warning requires stroke-oriented escalation. HINTS Plus adds bedside hearing assessment because new unilateral hearing loss can accompany inner-ear or anterior inferior cerebellar artery ischemia. Central or equivocal findings warrant MRI/MRA according to current emergency guidance; early negative imaging may not end evaluation when suspicion remains.",
      sections: [
        { label: "The exact syndrome in which HINTS applies", text: "Acute vestibular syndrome (AVS) is an acute-onset, persistent vestibular illness lasting many hours to days, generally with continuous dizziness or vertigo, spontaneous nystagmus, nausea or vomiting, head-motion intolerance, and gait unsteadiness. Symptoms can worsen when the head moves, but they do not disappear between movements. HINTS evidence was developed for this syndrome because vestibular neuritis and posterior circulation stroke can look remarkably similar. The patient must still have spontaneous nystagmus during assessment for the classic HINTS framework used here. If there is no nystagmus, GRACE-3 emphasizes gait severity and the broader neurologic assessment rather than pretending a HINTS result has the same meaning." },
        { label: "Timing and triggers come before the word 'dizzy'", text: "Symptom quality is unreliable: patients use dizzy, spinning, lightheaded, off-balance, and faint interchangeably. Timing and triggers better define the diagnostic problem. Brief episodes predictably triggered by position suggest a triggered episodic vestibular syndrome, for which positional testing such as Dix-Hallpike—not HINTS—is the relevant bedside pathway. Recurrent spontaneous episodes suggest a different differential including vestibular migraine, Ménière disease, arrhythmia, or transient ischemia. Persistent symptoms define AVS. Head movement aggravates nearly every vestibular disorder and is not the same as a trigger that starts a discrete short attack. Selecting the wrong syndrome destroys the evidence behind the test." },
        { label: "Why three eye findings can localize disease", text: "Stable gaze depends on the labyrinths, vestibular nerves, vestibular nuclei, cerebellum, medial longitudinal fasciculus, and ocular-motor nuclei. A peripheral destructive lesion usually creates an asymmetric high-frequency VOR, a predictable unidirectional nystagmus pattern, and no central vertical alignment error. A brainstem or cerebellar lesion may spare the peripheral VOR while disrupting gaze holding or graviceptive alignment. HINTS samples these complementary circuits. The value comes from convergence: the three components ask whether one coherent peripheral physiology explains the syndrome. A central clue means that coherence has failed, even when another component appears peripheral." },
        { label: "Head impulse component: what the result means", text: "The head impulse component challenges the horizontal VOR while a trained examiner observes fixation. A clear refixation saccade after an impulse toward one side usually indicates reduced peripheral vestibular function on that side and can support vestibular neuritis in a matching AVS pattern. A normal response is concerning in AVS because the profound continuous symptoms and nystagmus then lack the expected peripheral VOR deficit. This reversal is counterintuitive: 'normal' is the central warning within HINTS. Bedside observation can miss covert saccades, and bilateral, mild, recovering, technical, ocular, or visual factors can alter the finding. It is never interpreted outside the full syndrome and examination." },
        { label: "Head impulse exceptions and stroke mimics", text: "An abnormal head impulse is not a universal certificate of peripheral disease. Strokes involving the vestibular nucleus, root-entry zone, cerebellar flocculus, or anterior inferior cerebellar artery territory can impair VOR pathways. Labyrinthine ischemia can look physiologically peripheral because the ischemic injury truly is in the inner ear, yet its cause and near-term stroke implications may be vascular. Coexisting chronic vestibular loss can also produce an old corrective saccade during a new central event. Conversely, a small peripheral deficit may look normal without quantitative recording. The examiner must compare both sides and integrate nystagmus, skew, hearing, gait, other neurologic findings, and the patient's baseline." },
        { label: "Nystagmus component: direction and gaze dependence", text: "Acute unilateral peripheral loss usually produces predominantly horizontal-torsional jerk nystagmus whose fast phase remains in the same direction across horizontal gaze, often becoming more prominent when looking toward the fast phase. Central gaze-holding failure may produce direction-changing gaze-evoked nystagmus: right-beating in right gaze and left-beating in left gaze. Pure vertical or pure torsional spontaneous nystagmus is also a central warning. These are pattern descriptions, not a rule that every horizontal nystagmus is benign. Central lesions can produce unidirectional horizontal nystagmus, fixation can suppress peripheral nystagmus, and excessive gaze angle can create physiologic end-point nystagmus. Technique and context determine whether a pattern is real." },
        { label: "Test of skew: vertical alignment and graviceptive pathways", text: "Skew deviation is a vertical ocular misalignment caused by unequal central otolith-gravity signaling, often in the brainstem or cerebellum. Alternate cover can reveal a vertical refixation movement when one eye is uncovered. A clear skew in AVS is a central sign, but absence of skew does not exclude stroke because many central lesions spare this pathway. Small preexisting strabismus, poor fixation, monocular visual loss, orbital disease, fatigue, or examiner parallax can confuse the observation. The sign must be distinguished from horizontal refixation and interpreted with the patient's baseline ocular alignment when known." },
        { label: "Combining the three components", text: "A peripheral-compatible HINTS pattern is internally coherent: a unilateral abnormal impulse that matches acute vestibular hypofunction, unidirectional predominantly horizontal nystagmus, and no skew. The overall result becomes central when even one component is central—normal impulse, direction-changing gaze-evoked or vertical/pure torsional nystagmus, or skew. If a component cannot be performed or interpreted confidently, the result is incomplete or equivocal, not negative. This asymmetric logic reflects the test's purpose: identify evidence that the syndrome is not fully explained by a simple peripheral lesion. Documentation should name each observation rather than record only 'HINTS positive' or 'HINTS negative,' phrases that are dangerously ambiguous." },
        { label: "HINTS Plus and new hearing loss", text: "HINTS Plus adds a bedside comparison of hearing. New unilateral hearing loss during AVS matters because the labyrinth and cochlea share blood supply from branches commonly arising in the anterior inferior cerebellar artery circulation. Ischemia can therefore injure hearing and balance together before other obvious neurologic deficits appear. Hearing loss also occurs with nonvascular labyrinthitis and other ear disease, so it localizes cochlear or eighth-nerve involvement without naming the cause. A finger-rub comparison is only a screen and may miss frequency-specific loss or be confounded by baseline asymmetry; urgent audiometry and stroke-oriented evaluation may still be required. Sudden hearing change should be documented even when the classic three components look peripheral." },
        { label: "What the original evidence actually showed", text: "The landmark prospective study evaluated a selected high-risk group with AVS and at least one stroke risk factor, using examiners with specialized eye-movement expertise and neuroimaging plus follow-up. In that setting, the combined central HINTS pattern was highly sensitive for stroke, and some early diffusion-weighted MRIs were initially negative. This finding established that physiology at the bedside can reveal a posterior circulation lesion before a small infarct becomes visible. It did not prove that any untrained user can outperform MRI, that HINTS applies to every dizzy patient, or that a peripheral pattern overrides a focal deficit. Population, examiner, timing, and reference standard are part of the result." },
        { label: "Training and generalizability", text: "Later studies and meta-analyses show that appropriately trained non-subspecialists can achieve strong diagnostic performance, while specificity and reliability vary with training and setting. Other reviews found that HINTS used in isolation by emergency physicians without a defined training standard was not sufficiently validated as a stand-alone stroke rule-out. The apparent conflict dissolves when training is treated as part of the intervention. Competence requires more than memorizing three labels: clinicians need supervised practice recognizing subtle saccades and nystagmus, correct syndrome selection, safe technique, knowledge of exceptions, and a system for resolving equivocal findings. A video or encyclopedia entry can support education but cannot certify competence." },
        { label: "Imaging: partner, not opponent", text: "Noncontrast CT is insensitive for many posterior fossa ischemic strokes and should not be used to declare AVS peripheral. Diffusion-weighted MRI is more sensitive, yet small brainstem or cerebellar infarcts can be missed early, particularly in the first one to two days. GRACE-3 recommends MRI/MRA when trained-clinician HINTS is central or equivocal. When no trained examiner is available, when the patient is not an appropriate HINTS candidate, or when other neurologic and vascular concerns exist, imaging and consultation decisions follow the broader stroke evaluation. A negative early MRI may require repeat imaging or continued observation if the physiology and course remain concerning." },
        { label: "Wrong-patient use: the most important failure mode", text: "HINTS is not validated for brief positional vertigo, resolved symptoms, chronic imbalance, presyncope, nonspecific lightheadedness, episodic attacks, intoxication, medication sedation, or a patient without spontaneous nystagmus under the classic framework. In BPPV, head impulse is usually normal and spontaneous nystagmus is absent between positional triggers, so applying HINTS can manufacture a falsely 'central' pattern. In a patient with obvious hemiparesis, aphasia, or another focal deficit, stroke evaluation is already required; HINTS adds no permission to downgrade it. Inability to cooperate, poor vision, ocular-motor palsy, neck restrictions, or severe vomiting may make components uninterpretable. 'Not applicable' and 'equivocal' are clinically useful conclusions." },
        { label: "False-negative pathways", text: "A stroke may be missed when a central unidirectional horizontal nystagmus is mistaken for peripheral, a small skew is overlooked, a covert saccade is misread, chronic unilateral vestibular loss creates an abnormal impulse, or an AICA-region stroke damages peripheral-appearing vestibular structures. Fixation, sedatives, fatigue, and poor lighting can hide nystagmus. Symptoms may evolve after the first examination. The most dangerous cognitive error is letting one seemingly peripheral component cancel severe gait failure, new hearing loss, headache or neck pain, focal symptoms, vascular context, or an inconsistent course. HINTS reduces uncertainty only when its complete pattern and all surrounding evidence align." },
        { label: "False-positive pathways", text: "A normal impulse can appear central when the impulse is too slow, predictable, poorly aligned, or limited by neck motion. End-point nystagmus at extreme gaze can be mistaken for pathologic direction change. Baseline strabismus or poor fixation can resemble skew. Peripheral disease may be mild, bilateral, partially compensated, or frequency-specific and therefore lack an obvious bedside impulse deficit. These false-central patterns usually lead to further evaluation rather than immediate harmful treatment, but they still cause anxiety, cost, and unnecessary testing. Careful technique, reasonable gaze angles, knowledge of baseline eye disease, repeat expert examination, and quantitative tools when appropriate improve specificity." },
        { label: "Neurologic and gait examination still matter", text: "HINTS samples selected ocular pathways; it is not a complete neurologic examination. Assess mental status, speech, cranial nerves, visual fields, limb strength and sensation, coordination, gait, and truncal stability. Severe inability to sit, stand, or walk can indicate central disease even without a classic focal deficit. Examine for Horner syndrome, facial sensory loss, dysmetria, lateropulsion, dysarthria, dysphagia, and other posterior circulation clues. Ask about new headache, neck pain, vascular risk, dissection risk, and transient symptoms. GRACE-3 specifically redirects patients without nystagmus toward gait-severity assessment rather than an invalid HINTS shortcut." },
        { label: "Nursing relevance and serial observation", text: "At triage, preserve the syndrome-defining details: last known well or exact onset, continuous versus episodic course, spontaneous versus positional trigger, vomiting, ability to sit and walk, hearing change, headache or neck pain, neurologic symptoms, trauma, anticoagulants, vascular history, and medications. Do not document only 'vertigo.' Institute fall and aspiration precautions as clinically indicated, support hydration and antiemetic care without masking neurologic change, and record serial mental status, speech, eye, limb, gait, and vital-sign findings. If a clinician performs HINTS, nursing handoff should retain each component and whether the examiner was trained, plus imaging, consultation, and reassessment plans. Worsening after a reassuring label requires re-escalation." },
        { label: "Emergency escalation and treatment implications", text: "A central or equivocal HINTS pattern in the correct AVS patient is a stroke warning and should activate urgent clinician-directed imaging and neurologic management. The examination does not establish infarct age, vessel status, hemorrhage, thrombolysis eligibility, or thrombectomy candidacy; those require the full acute stroke pathway. Do not delay time-critical stroke actions to repeat an uncertain bedside maneuver. New hearing loss, severe truncal instability, focal deficit, concerning headache or neck pain, altered consciousness, or clinical deterioration warrants escalation regardless of a recorded peripheral component. Symptom suppressants may help severe nausea or vertigo but can impair examination and, when prolonged, may slow vestibular compensation; their use follows the treating team's plan." },
        { label: "Documentation that prevents downstream error", text: "Record why the patient met AVS criteria, that spontaneous nystagmus was present, symptom timing, examiner training context, and the actual findings: head impulse side and observed corrective saccade, nystagmus direction in primary and eccentric gaze, presence or absence of vertical realignment, bedside hearing comparison, gait or truncal ability, and other neurologic signs. State 'central,' 'peripheral-compatible,' 'equivocal,' or 'not applicable' with reasoning. Avoid 'HINTS positive' because some clinicians use positive to mean stroke while others mean an abnormal head impulse suggesting peripheral loss. Document technical limitations and whether symptoms or medications changed between assessments." },
        { label: "Why HINTS must not become a home self-test", text: "The meaning of each component depends on involuntary eye movements too subtle for reliable self-observation. A person cannot create an adequately unpredictable head impulse on themselves while maintaining fixation and judging a covert saccade, and forceful movement can be unsafe with neck disease or vascular concerns. Consumer video quality, frame rate, lighting, and camera geometry are not equivalent to validated video-oculography. More importantly, the test is only one part of emergency stroke reasoning. Public-facing education should teach people to seek urgent assessment for new continuous severe dizziness, inability to walk, new hearing loss, focal neurologic symptoms, or severe headache—not to attempt HINTS and decide whether to stay home." },
        { label: "Connected topics and the durable mental model", text: "Connect HINTS to acute vestibular syndrome, timing-and-triggers history, vestibular neuritis, labyrinthitis, vestibulo-ocular reflex, head impulse testing, nystagmus, skew deviation, otolith pathways, HINTS Plus, sudden sensorineural hearing loss, posterior circulation stroke, AICA and PICA territories, cerebellar examination, gait and truncal instability, Dix-Hallpike testing, BPPV, vestibular migraine, MRI with diffusion-weighted imaging, MRA, and stroke systems of care. The durable mental model is syndrome first, trained physiology second, whole neurologic context always, and imaging or consultation when central, equivocal, inapplicable, or clinically discordant." }
      ],
      relatedTopics: ["Acute vestibular syndrome", "Vestibular neuritis", "Labyrinthitis", "Vestibulo-ocular reflex", "Head impulse test", "Video head impulse test", "Nystagmus", "Skew deviation", "HINTS Plus", "Sudden sensorineural hearing loss", "Posterior circulation stroke", "AICA stroke", "PICA stroke", "Cerebellar examination", "Gait assessment", "Dix-Hallpike test", "Benign paroxysmal positional vertigo", "Vestibular migraine", "MRI diffusion-weighted imaging", "Magnetic resonance angiography", "Stroke evaluation"],
      tags: ["HINTS", "head impulse", "nystagmus", "test of skew", "acute vestibular syndrome", "continuous vertigo", "spontaneous nystagmus", "posterior circulation stroke", "vestibular neuritis", "HINTS Plus", "trained clinician", "MRI", "patient selection"],
      sourceKeys: ["w37-saem-grace3", "w37-kattah-hints-2009", "w37-hints-meta-2023", "w37-hints-ed-review-2020", "w37-ncbi-vor"]
    })
  ];

  const expectedNames = [
    "Vestibulo-ocular reflex",
    "Sudden sensorineural hearing loss",
    "HINTS examination"
  ];
  if (entries.length !== expectedNames.length
    || entries.some((entry, index) => entry.name !== expectedNames[index])) {
    throw new Error("Wave37 neuro-otology cohort A must contain the three locked entries in order.");
  }

  const vestibuloOcularReflex = entries[0];
  const suddenSensorineuralHearingLossArticle = entries[1];
  const hintsExamination = entries[2];
  const referenceEntries = [vestibuloOcularReflex, hintsExamination];

  const sectionText = (label) => {
    const section = (suddenSensorineuralHearingLossArticle.sections || [])
      .find((candidate) => normalize(candidate && candidate.label) === normalize(label));
    if (!section) throw new Error("Missing SSNHL source section: " + label);
    return section.text;
  };
  const ssnhlSourceKeys = suddenSensorineuralHearingLossArticle.sourceKeys.slice();
  const suddenSensorineuralHearingLoss = {
    ...suddenSensorineuralHearingLossArticle,
    displayName: "Sudden sensorineural hearing loss",
    type: "condition",
    entryType: "disease",
    recordType: "pathology",
    owner: "pathology",
    contentOwner: "Otology and Neurotology",
    primaryDomain: "Otology",
    clinicalDomain: "Hearing emergencies",
    primarySystem: "Neurologic and Sensory",
    bodySystem: "Ear and Hearing",
    category: "Otology and Neurology / Hearing Emergencies / Inner Ear Disorders",
    categories: ["Diseases and Conditions", "Otology", "Hearing Emergencies", "Inner Ear Disorders"],
    definition: suddenSensorineuralHearingLossArticle.summary,
    pathology: [
      sectionText("What the term means—and what it does not"),
      sectionText("Why rapid recognition matters"),
      sectionText("Plausible mechanisms and why most cases remain idiopathic")
    ].join(" "),
    pathophysiology: [
      sectionText("Why rapid recognition matters"),
      sectionText("Plausible mechanisms and why most cases remain idiopathic"),
      "Cochlear hair cells translate mechanical vibration into neural signals through tightly regulated ion gradients. Injury that interrupts hair-cell transduction, cochlear blood supply, synaptic transmission, or auditory-nerve signaling reduces the sound information reaching the brain. Because the cochlea has high metabolic demand, delicate microcirculation, and little regenerative reserve, an abrupt insult can cause major functional loss before otoscopy shows any abnormality."
    ],
    etiology: [
      sectionText("Plausible mechanisms and why most cases remain idiopathic"),
      sectionText("Identifiable causes and modifying factors")
    ].join(" "),
    riskFactors: [
      "Recent head trauma, acoustic trauma, barotrauma, ear surgery, or exposure to an ototoxic medicine changes the cause-specific evaluation.",
      "Autoimmune or systemic inflammatory disease, cancer, infection, or vascular disease can produce secondary sensorineural loss rather than an idiopathic episode.",
      "Bilateral, recurrent, or fluctuating loss raises concern for systemic, genetic, toxic, autoimmune, or Ménière-spectrum disease.",
      "Acute continuous vertigo, spontaneous nystagmus, vascular risk, or focal neurologic symptoms raises concern for posterior-circulation or labyrinthine ischemia.",
      "Delayed recognition is a modifiable outcome risk because evidence-based treatment discussions are concentrated in the first days and weeks."
    ],
    signsSymptoms: [
      sectionText("Presentation and common language"),
      "Sudden unilateral reduction in hearing, speech clarity, sound localization, or telephone hearing may be accompanied by tinnitus, aural fullness, distortion, vertigo, imbalance, or a perceived pop.",
      "A normal-appearing ear canal and tympanic membrane do not rule out cochlear or auditory-nerve dysfunction; the absence of pain, fever, or drainage is common.",
      "Facial weakness or numbness, diplopia, dysarthria, dysphagia, limb incoordination, severe gait failure, new severe headache or neck pain, or altered consciousness suggests an emergency neurologic process rather than an isolated idiopathic ear disorder."
    ],
    diagnostics: [
      sectionText("Audiometric definition and its limitations"),
      sectionText("Initial examination: locating the problem"),
      sectionText("Tuning forks: useful triage with real limits"),
      sectionText("Audiometry and prompt specialist coordination"),
      sectionText("Retrocochlear and cause-directed evaluation"),
      sectionText("Why broad routine laboratory panels are discouraged")
    ],
    differentialDiagnosis: [
      "Cerumen impaction, foreign body, otitis externa, tympanic-membrane disease, middle-ear effusion, or ossicular disease causing conductive hearing loss",
      "Ménière disease, labyrinthitis, autoimmune inner-ear disease, ototoxicity, acoustic trauma, barotrauma, or perilymphatic fistula",
      "Vestibular schwannoma or another retrocochlear lesion affecting cranial nerve VIII",
      "Posterior-circulation or labyrinthine ischemia, demyelinating disease, or another central neurologic disorder",
      "Functional listening difficulty, baseline asymmetric hearing, auditory-processing difficulty, or a subjective change not confirmed on audiometry"
    ],
    treatment: [
      sectionText("Initial corticosteroids and shared decision-making"),
      sectionText("Intratympanic therapy, salvage, and hyperbaric oxygen"),
      sectionText("Treatments not used routinely for idiopathic SSNHL"),
      sectionText("Communication, tinnitus, and rehabilitation")
    ],
    complications: [
      "Persistent unilateral or bilateral hearing impairment can reduce speech understanding in noise, sound localization, situational awareness, education, work function, and communication safety.",
      "Tinnitus, hyperacusis, distorted sound, vertigo, imbalance, anxiety, depressed mood, sleep disruption, and social withdrawal may persist even when pure-tone thresholds partly recover.",
      "A missed posterior-circulation stroke, tumor, autoimmune process, infection, or toxic exposure can progress when abrupt hearing loss is mislabeled as congestion.",
      "Systemic corticosteroids can worsen glucose, blood pressure, mood, sleep, infection risk, and gastrointestinal disease; intratympanic treatment can cause pain, dizziness, infection, or persistent tympanic-membrane perforation.",
      "Delayed audiometry or specialist follow-up can allow the initial and salvage treatment windows to pass without an informed decision."
    ],
    nursingInterventions: [
      sectionText("Nursing care and medication safety"),
      sectionText("Communication, tinnitus, and rehabilitation"),
      "Preserve the exact onset time and functional description during triage, escalate sudden unexplained loss promptly, institute fall precautions when vertigo or gait impairment is present, and retain the referral and follow-up plan during every transition of care.",
      "Monitor patient-specific steroid risks according to the ordered plan and teach that subjective improvement does not replace follow-up audiometry."
    ],
    redFlags: [
      "Sudden hearing change with facial weakness or numbness, diplopia, dysarthria, dysphagia, limb weakness or incoordination, severe truncal ataxia, altered consciousness, or another focal neurologic deficit",
      "Acute hearing loss with continuous vertigo, spontaneous nystagmus, inability to walk safely, or a central or equivocal HINTS pattern assessed by a trained clinician",
      "New severe headache or neck pain, suspected arterial dissection, head trauma, barotrauma, meningitic illness, toxic exposure, or hemodynamic instability",
      "Rapidly progressive bilateral hearing loss, recurrent episodes, severe infection findings, or new symptoms in the opposite ear",
      "Delay in obtaining urgent audiometry or otolaryngology assessment while waiting to see whether presumed wax, allergy, or congestion resolves"
    ],
    patientEducation: [
      "Treat an abrupt unexplained hearing change as urgent even when the ear feels merely blocked and the ear canal looks normal; contact a qualified clinician promptly rather than waiting for spontaneous recovery.",
      "Do not start leftover corticosteroids, antibiotics, ear drops, supplements, or decongestants as a substitute for locating the hearing loss and discussing patient-specific risks.",
      "Audiometry identifies the type, frequencies, severity, and speech effect of hearing loss. Bedside phone checks and tuning forks can guide triage but cannot replace it.",
      "Report new weakness, numbness, double vision, speech or swallowing difficulty, severe imbalance, severe headache or neck pain, new unilateral hearing loss with continuous vertigo, or worsening symptoms immediately.",
      "Keep end-of-treatment and later hearing tests even if hearing seems better, because objective recovery, residual asymmetry, rehabilitation needs, and retrocochlear follow-up may differ from perception.",
      sectionText("Communication, tinnitus, and rehabilitation")
    ],
    prognosis: sectionText("Prognosis, uncertainty, and follow-up"),
    carePlan: [
      "Distinguish conductive from sensorineural loss promptly and document onset, laterality, baseline hearing, tinnitus, fullness, vestibular symptoms, neurologic findings, trauma, infection, and medication exposure.",
      "Arrange audiometry as soon as possible, urgent specialist routing, and emergency stroke evaluation whenever neurologic or acute-vestibular red flags are present.",
      "Use shared decision-making for time-sensitive treatment options, monitor patient-specific adverse effects, and do not substitute routine broad laboratory or CT testing for the indicated hearing and retrocochlear evaluation.",
      "Repeat audiometry at the end of treatment and within six months, discuss salvage options while applicable, and provide audiologic, tinnitus, communication, and emotional support for residual effects."
    ],
    keyLabs: [
      "There is no routine blood test that confirms idiopathic SSNHL. Laboratory studies should answer a specific infectious, autoimmune, toxic, hematologic, or metabolic question raised by history or examination.",
      "Glucose and other safety monitoring may be needed when systemic corticosteroids are used, based on comorbidities and the treating clinician's plan."
    ],
    contraindications: [
      "Do not treat a central neurologic emergency, meningitic illness, trauma, toxic exposure, or another identified secondary cause as routine idiopathic SSNHL; the cause-specific emergency pathway takes priority.",
      "Systemic corticosteroid risk may outweigh benefit or require modification in a patient with uncontrolled diabetes, serious active infection, major psychiatric vulnerability, gastrointestinal bleeding risk, or another clinician-identified contraindication. This is a shared specialist decision rather than a universal exclusion list.",
      "Intratympanic injection is a clinician-performed procedure whose suitability depends on tympanic-membrane and middle-ear status, bleeding and infection context, anatomy, tolerance, and informed consent.",
      "Hyperbaric oxygen requires specialist screening for pressure-related, pulmonary, neurologic, and confinement risks and is not used as a stand-alone substitute for the guideline-directed evaluation or steroid discussion.",
      "Routine antivirals, thrombolytics, vasodilators, or vasoactive medicines are not justified for an otherwise idiopathic episode merely because infection or vascular compromise is theoretically possible."
    ],
    nclexTraps: [
      "A full or blocked sensation does not prove conductive loss. SSNHL can feel like wax or congestion and can leave otoscopy normal.",
      "The conventional 30-dB-at-three-neighboring-frequencies definition is a study and diagnostic convention, not a threshold below which abrupt hearing change becomes safe to ignore.",
      "The guideline target to confirm hearing with audiometry within 14 days is an outer timing goal, not permission to delay first contact for two weeks.",
      "Weber and Rinne findings support localization but cannot replace formal audiometry or cancel a convincing sudden-loss history.",
      "Routine noncontrast head CT does not evaluate the cochlea, small retrocochlear lesions, or early posterior circulation ischemia well enough to rule out SSNHL causes.",
      "Corticosteroids within two weeks are an option requiring shared decision-making, not a guaranteed cure or an automatic prescription for every cause of sudden hearing loss.",
      "New unilateral hearing loss with continuous vertigo and spontaneous nystagmus can be vascular. A seemingly peripheral head impulse does not erase stroke concerns or other neurologic red flags.",
      "Subjective improvement does not replace repeat audiometry, retrocochlear evaluation when indicated, or rehabilitation for persistent hearing and tinnitus effects."
    ],
    emergencyCare: sectionText("Emergency red flags"),
    aliases: suddenSensorineuralHearingLossArticle.aliases.slice(),
    abbreviations: suddenSensorineuralHearingLossArticle.abbreviations.slice(),
    ambiguousAbbreviations: ["SSNHL", "SSHL", "ISSNHL"],
    commonMisspellings: suddenSensorineuralHearingLossArticle.commonMisspellings.slice(),
    relatedTopics: suddenSensorineuralHearingLossArticle.relatedTopics.slice(),
    tags: unique([...(suddenSensorineuralHearingLossArticle.tags || []), "disease index", "hearing emergency", "pathology owner"]),
    sourceKeys: ssnhlSourceKeys,
    sourceNote: sourceNoteFor(ssnhlSourceKeys),
    wave37NeuroPathologyOwner: true,
    wave37NeuroRevision: VERSION
  };
  suddenSensorineuralHearingLoss.treatments = suddenSensorineuralHearingLoss.treatment.slice();
  suddenSensorineuralHearingLoss.nursingPriorities = suddenSensorineuralHearingLoss.nursingInterventions.slice();
  suddenSensorineuralHearingLoss.differentialDiagnoses = suddenSensorineuralHearingLoss.differentialDiagnosis.slice();

  const ownedReferenceNames = new Set(expectedNames.map(normalize));
  database.entries = database.entries
    .filter((entry) => !ownedReferenceNames.has(normalize(entry && entry.name)))
    .concat(referenceEntries);

  const pathologyDatabase = window.ANI_PATHOLOGY_DATABASE && typeof window.ANI_PATHOLOGY_DATABASE === "object"
    ? window.ANI_PATHOLOGY_DATABASE
    : { diseases: [], sourceReferences: [] };
  if (!Array.isArray(pathologyDatabase.diseases)) pathologyDatabase.diseases = [];
  if (!Array.isArray(pathologyDatabase.sourceReferences)) pathologyDatabase.sourceReferences = [];
  const pathologySourceIndex = new Map(pathologyDatabase.sourceReferences
    .filter((reference) => reference && reference.key)
    .map((reference, index) => [String(reference.key), index]));
  localSourceReferences
    .filter((reference) => ssnhlSourceKeys.includes(reference.key))
    .forEach((reference) => {
      const existingIndex = pathologySourceIndex.get(reference.key);
      if (Number.isInteger(existingIndex)) pathologyDatabase.sourceReferences[existingIndex] = { ...reference };
      else {
        pathologySourceIndex.set(reference.key, pathologyDatabase.sourceReferences.length);
        pathologyDatabase.sourceReferences.push({ ...reference });
      }
    });
  const ssnhlKey = normalize(suddenSensorineuralHearingLoss.name);
  pathologyDatabase.diseases = pathologyDatabase.diseases
    .filter((entry) => normalize(entry && (entry.name || entry.displayName || entry.title)) !== ssnhlKey)
    .concat(suddenSensorineuralHearingLoss);

  database.cohorts = {
    ...(database.cohorts || {}),
    wave37NeuroA: referenceEntries.map((entry) => entry.name)
  };
  database.componentVersions = {
    ...(database.componentVersions || {}),
    wave37NeuroA: VERSION
  };
  pathologyDatabase.cohorts = {
    ...(pathologyDatabase.cohorts || {}),
    wave37NeuroA: [suddenSensorineuralHearingLoss.name]
  };
  pathologyDatabase.componentVersions = {
    ...(pathologyDatabase.componentVersions || {}),
    wave37NeuroA: VERSION
  };
  database.latestExtensionVersion = VERSION;
  pathologyDatabase.latestExtensionVersion = VERSION;
  window.ANI_FOUNDATIONS_DATABASE = database;
  window.ANI_PATHOLOGY_DATABASE = pathologyDatabase;
  window.ANI_FOUNDATIONS_WAVE37_NEURO_A = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    entryNames: expectedNames.slice(),
    entryCount: entries.length,
    referenceEntryNames: referenceEntries.map((entry) => entry.name),
    pathologyEntryNames: [suddenSensorineuralHearingLoss.name],
    owners: Object.freeze({
      "Vestibulo-ocular reflex": "reference",
      "Sudden sensorineural hearing loss": "pathology",
      "HINTS examination": "reference"
    }),
    sourceKeys: unique(entries.flatMap((entry) => entry.sourceKeys)),
    sourceCount: unique(entries.flatMap((entry) => entry.sourceKeys)).length
  });
}());
