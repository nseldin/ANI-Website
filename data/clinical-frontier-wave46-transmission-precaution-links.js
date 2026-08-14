/* eslint-disable */
/* Wave 46: reviewed disease-to-isolation links for transmission-precaution companion cards. */
(function installAniWave46TransmissionPrecautionLinks(root) {
  "use strict";

  const VERSION = "2026-08-13-wave46-transmission-precautions-2";
  const GLOBAL_NAME = "ANI_CLINICAL_FRONTIER_WAVE46_TRANSMISSION_PRECAUTIONS";
  if (root[GLOBAL_NAME] && root[GLOBAL_NAME].version === VERSION) return;

  const database = root.ANI_PATHOLOGY_DATABASE;
  if (!database || !Array.isArray(database.diseases)) {
    throw new Error("Wave 46 requires ANI_PATHOLOGY_DATABASE before transmission-precaution links are installed.");
  }
  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const uniqueText = (values) => Array.from(new Map((values || [])
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .map((value) => [normalize(value), value])).values());
  const uniqueRecords = (values) => Array.from(new Map((values || [])
    .filter((value) => value && typeof value === "object")
    .map((value) => [[value.targetId || "", value.targetCollection || "", value.canonicalTitle || "", value.context || ""].join("|"), value])).values());

  const localSources = [
    {
      key: "w46-cdc-isolation-appendix-a",
      label: "CDC Appendix A: Type and Duration of Precautions Recommended for Selected Infections and Conditions",
      url: "https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html",
      note: "Supports the condition-specific Airborne, Droplet, Contact, and combined-precaution assignments and their important syndrome, site, immune-status, and duration qualifiers."
    },
    {
      key: "w46-cdc-isolation-precautions",
      label: "CDC Transmission-Based Precautions",
      url: "https://www.cdc.gov/infection-control/hcp/isolation-precautions/precautions.html",
      note: "Supports adding transmission-based measures to Standard Precautions, patient placement, source control, PPE, transport, and setting-specific implementation."
    },
    {
      key: "w46-cdc-tb-infection-control",
      label: "CDC Tuberculosis Infection Control in Healthcare Settings",
      url: "https://www.cdc.gov/tb-healthcare-settings/hcp/infection-control/index.html",
      note: "Supports prompt airborne infection isolation for presumed or confirmed infectious TB and the distinction between pulmonary or laryngeal disease and other TB presentations."
    },
    {
      key: "w46-cdc-meningococcal-infection-control",
      label: "CDC Meningococcal Disease Infection Control",
      url: "https://www.cdc.gov/infection-control/hcp/healthcare-personnel-epidemiology-control/meningococcal-disease.html",
      note: "Supports Droplet Precautions for suspected or confirmed invasive meningococcal disease and exposure assessment for unprotected respiratory-secretions contact."
    },
    {
      key: "w46-cdc-cdiff-prevention",
      label: "CDC Clinical Guidance for C. difficile Infection Prevention",
      url: "https://www.cdc.gov/c-diff/hcp/clinical-guidance/index.html",
      note: "Supports Contact Precautions, environmental controls, and organism-specific hand-hygiene practice for symptomatic C. difficile infection."
    },
    {
      key: "w46-cdc-mrsa-infection-control",
      label: "CDC Infection Control Guidance for MRSA in Healthcare Facilities",
      url: "https://www.cdc.gov/mrsa/hcp/infection-control/index.html",
      note: "Supports CDC's current recommendation for Contact Precautions for MRSA-colonized or infected patients, including in inpatient acute care settings."
    }
  ];
  const sourceIndex = new Map(database.sourceReferences
    .map((source, index) => [normalize(source && source.key), index])
    .filter(([key]) => key));
  localSources.forEach((source) => {
    const key = normalize(source.key);
    if (sourceIndex.has(key)) database.sourceReferences[sourceIndex.get(key)] = { ...database.sourceReferences[sourceIndex.get(key)], ...source };
    else {
      sourceIndex.set(key, database.sourceReferences.length);
      database.sourceReferences.push(source);
    }
  });

  const precaution = (kind, context, sourceKeys = ["w46-cdc-isolation-appendix-a"], labelOverride = "") => {
    const definitions = {
      airborne: {
        label: "Airborne precautions",
        targetId: "microbiology:infection-prevention:airborne-precautions",
        canonicalTitle: "Airborne precautions"
      },
      droplet: {
        label: "Droplet precautions",
        targetId: "microbiology:infection-prevention:droplet-precautions",
        canonicalTitle: "Droplet precautions"
      },
      contact: {
        label: "Contact precautions",
        targetId: "microbiology:infection-prevention:contact-precautions",
        canonicalTitle: "Contact precautions"
      }
    };
    const definition = definitions[kind];
    if (!definition) throw new Error(`Wave 46 received an unknown precaution kind: ${kind}`);
    return Object.freeze({
      ...definition,
      ...(labelOverride ? { label: labelOverride } : {}),
      targetCollection: "clinicalReferenceEntries",
      targetKind: "precaution",
      context,
      sourceKeys: sourceKeys.slice()
    });
  };

  const patches = Object.freeze({
    "Measles": {
      isolationPrecautions: [precaution("airborne", "Initiate immediately for suspected or confirmed measles; use current CDC and facility criteria for duration and exposed susceptible people.")],
      relatedTopics: ["Airborne precautions", "Airborne Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-isolation-precautions"]
    },
    "Varicella": {
      isolationPrecautions: [
        precaution("airborne", "Varicella requires Airborne plus Contact Precautions until lesions are dry and crusted, with current guidance for exposed susceptible people."),
        precaution("contact", "Varicella requires Contact together with Airborne Precautions; lesion, equipment, and environmental controls remain necessary.")
      ],
      relatedTopics: ["Airborne precautions", "Contact precautions", "Airborne + Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-isolation-precautions"]
    },
    "Tuberculosis": {
      isolationPrecautions: [
        precaution("airborne", "Use for suspected or confirmed infectious pulmonary or laryngeal TB. Latent TB infection without active disease does not require Airborne Precautions.", ["w46-cdc-isolation-appendix-a", "w46-cdc-tb-infection-control"]),
        precaution("contact", "A draining extrapulmonary TB lesion requires the combined Airborne plus Contact plan until current discontinuation criteria are met; evaluate for concurrent pulmonary disease.", ["w46-cdc-isolation-appendix-a", "w46-cdc-tb-infection-control"])
      ],
      relatedTopics: ["Airborne precautions", "Contact precautions", "Airborne Precaution Diseases", "Airborne + Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-tb-infection-control"]
    },
    "Shingles": {
      isolationPrecautions: [
        precaution("airborne", "Use with Contact Precautions for disseminated zoster in any patient or localized zoster in an immunocompromised patient until dissemination is excluded."),
        precaution("contact", "Use with Airborne Precautions for disseminated disease or localized disease in an immunocompromised patient until dissemination is excluded. Covered localized lesions in an immunocompetent patient are managed differently.")
      ],
      relatedTopics: ["Airborne precautions", "Contact precautions", "Airborne + Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "Smallpox": {
      isolationPrecautions: [
        precaution("airborne", "Smallpox requires Airborne plus Contact Precautions and immediate infection-prevention and public-health coordination."),
        precaution("contact", "Smallpox requires Contact together with Airborne Precautions; use the complete disease-specific plan.")
      ],
      relatedTopics: ["Airborne precautions", "Contact precautions", "Airborne + Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "Influenza": {
      isolationPrecautions: [precaution("droplet", "Use current seasonal-influenza healthcare guidance for suspected or confirmed influenza, including source control, placement, transport, and duration.")],
      relatedTopics: ["Droplet precautions", "Droplet Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-isolation-precautions"]
    },
    "Pertussis": {
      isolationPrecautions: [precaution("droplet", "Use for suspected or confirmed pertussis through the condition-specific interval; CDC Appendix A lists 5 days after effective antibiotic therapy begins.")],
      relatedTopics: ["Droplet precautions", "Droplet Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "Meningococcemia": {
      isolationPrecautions: [precaution("droplet", "Initiate for suspected or confirmed invasive meningococcal disease; CDC guidance uses the first 24 hours of effective therapy and requires exposure assessment for unprotected respiratory-secretions contact.", ["w46-cdc-isolation-appendix-a", "w46-cdc-meningococcal-infection-control"])],
      relatedTopics: ["Droplet precautions", "Droplet Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-meningococcal-infection-control"]
    },
    "Meningitis": {
      isolationPrecautions: [precaution("droplet", "Use for suspected or confirmed meningitis caused by Neisseria meningitidis or Haemophilus influenzae type b through 24 hours after effective therapy begins. Meningitis from every cause does not share one isolation plan; pneumococcal and other diagnosed etiologies can use different precautions, so follow the suspected organism and current protocol.", ["w46-cdc-isolation-appendix-a", "w46-cdc-meningococcal-infection-control"])],
      relatedTopics: ["Droplet precautions", "Droplet Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-meningococcal-infection-control"]
    },
    "Mumps": {
      isolationPrecautions: [precaution("droplet", "Use for mumps through 5 days after parotid or other salivary-gland swelling begins under current CDC guidance.")],
      relatedTopics: ["Droplet precautions", "Droplet Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "Rubella": {
      isolationPrecautions: [
        precaution("droplet", "Use for postnatal rubella through the condition-specific interval; protect susceptible and nonimmune pregnant personnel according to occupational-health guidance."),
        precaution("contact", "Congenital rubella uses Contact Precautions; duration depends on age and virologic criteria under current guidance.")
      ],
      relatedTopics: ["Droplet precautions", "Contact precautions", "Droplet Precaution Diseases", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "Diphtheria": {
      isolationPrecautions: [
        precaution("droplet", "Pharyngeal diphtheria requires Droplet Precautions until antimicrobial therapy and culture-based discontinuation criteria are met."),
        precaution("contact", "Cutaneous diphtheria requires Contact Precautions until antimicrobial therapy and culture-based discontinuation criteria are met.")
      ],
      relatedTopics: ["Droplet precautions", "Contact precautions", "Droplet Precaution Diseases", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "Epiglottitis": {
      isolationPrecautions: [precaution("droplet", "Use for Haemophilus influenzae type b epiglottitis through 24 hours after effective therapy begins. Epiglottitis from every cause does not automatically require one isolation plan; airway stabilization and the suspected organism guide immediate care.")],
      relatedTopics: ["Droplet precautions", "Droplet Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "C. difficile infection": {
      isolationPrecautions: [precaution("contact", "Use for suspected or confirmed symptomatic C. difficile infection with organism-specific hand hygiene, environmental cleaning, and facility duration criteria.", ["w46-cdc-isolation-appendix-a", "w46-cdc-cdiff-prevention"])],
      relatedTopics: ["Contact precautions", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-cdiff-prevention"]
    },
    "Scabies": {
      isolationPrecautions: [precaution("contact", "Use through the indicated treatment interval; CDC Appendix A lists 24 hours after effective therapy begins.")],
      relatedTopics: ["Contact precautions", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "RSV infection": {
      isolationPrecautions: [precaution("contact", "CDC Appendix A lists Contact plus Standard Precautions for RSV infection in infants, young children, and immunocompromised adults; prolonged shedding can extend duration.")],
      relatedTopics: ["Contact precautions", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "Impetigo": {
      isolationPrecautions: [precaution("contact", "Use through the condition-specific interval; CDC Appendix A lists 24 hours after effective therapy begins.")],
      relatedTopics: ["Contact precautions", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a"]
    },
    "MRSA": {
      isolationPrecautions: [precaution("contact", "CDC recommends Contact Precautions for patients colonized or infected with MRSA, including in inpatient acute care settings. Apply current facility and setting-specific implementation and discontinuation policy, and escalate outbreaks to infection prevention.", ["w46-cdc-mrsa-infection-control", "w46-cdc-isolation-precautions"])],
      relatedTopics: ["Contact precautions", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-mrsa-infection-control", "w46-cdc-isolation-precautions"]
    },
    "Vancomycin-resistant Enterococcus": {
      isolationPrecautions: [precaution("contact", "Use when current MDRO guidance and facility policy indicate it, considering care setting, infection or colonization, drainage, outbreak status, and local epidemiology.")],
      relatedTopics: ["Contact precautions", "Contact Precaution Diseases"],
      sourceKeys: ["w46-cdc-isolation-appendix-a", "w46-cdc-isolation-precautions"]
    }
  });

  const diseaseIndex = new Map(database.diseases.map((disease, index) => [normalize(disease && disease.name), index]));
  const applied = [];
  Object.entries(patches).forEach(([name, patch]) => {
    const index = diseaseIndex.get(normalize(name));
    if (!Number.isInteger(index)) throw new Error(`Wave 46 could not resolve the canonical pathology card: ${name}`);
    const existing = database.diseases[index];
    database.diseases[index] = {
      ...existing,
      isolationPrecautions: uniqueRecords([...(Array.isArray(existing.isolationPrecautions) ? existing.isolationPrecautions : []), ...patch.isolationPrecautions]),
      relatedTopics: uniqueText([...(Array.isArray(existing.relatedTopics) ? existing.relatedTopics : []), ...patch.relatedTopics]),
      sourceKeys: uniqueText([...(Array.isArray(existing.sourceKeys) ? existing.sourceKeys : []), ...patch.sourceKeys]),
      wave46TransmissionPrecautionRevision: VERSION
    };
    applied.push(name);
  });

  database.componentVersions = { ...(database.componentVersions || {}), wave46TransmissionPrecautions: VERSION };
  database.latestExtensionVersion = VERSION;
  database.diseaseCount = database.diseases.length;
  root.ANI_PATHOLOGY_DATABASE = database;
  root[GLOBAL_NAME] = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    diseaseCount: applied.length,
    diseaseNames: Object.freeze(applied.slice()),
    sourceKeys: Object.freeze(localSources.map((source) => source.key))
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
