(function installAniMicrobiologyDomainCore(root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && !root.AniMicrobiologyDomainCore) root.AniMicrobiologyDomainCore = api;
  if (root && root.window && !root.window.AniMicrobiologyDomainCore) {
    root.window.AniMicrobiologyDomainCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createAniMicrobiologyDomainCore() {
  "use strict";

  const SCHEMA_VERSION = "ani-microbiology-catalog-v4";
  const ARCHITECTURE_VERSION = "ani-microbiology-domain-v4";
  const TAXONOMY_VERSION = "ani-microbiology-taxonomy-v4";
  const RELATIONSHIP_SCHEMA_VERSION = "ani-microbiology-relationships-v3";
  const GENERATOR_VERSION = "ani-microbiology-generator-v4";
  const FINGERPRINT_VERSION = "ani-microbiology-architecture-fingerprint-v4";
  const APPROVAL_SCHEMA_VERSION = "ani-microbiology-domain-approval-v1";

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") return value;
    const visited = seen || new Set();
    if (visited.has(value)) return value;
    visited.add(value);
    Object.keys(value).forEach((key) => deepFreeze(value[key], visited));
    return Object.freeze(value);
  }

  const ENTRY_KINDS = deepFreeze([
    "organism",
    "microbiology-concept",
    "microbiology-method",
    "culture-medium",
    "infection-prevention-concept"
  ]);

  const AGENT_CLASSES = deepFreeze([
    "bacterium",
    "virus",
    "fungus",
    "protozoan",
    "nematode",
    "cestode",
    "trematode",
    "ectoparasite",
    "prion",
    "acellular-agent"
  ]);

  const TAXONOMY_AUTHORITIES = deepFreeze([
    "ncbi-taxonomy",
    "ictv",
    "reviewed-clinical-taxonomy",
    "not-applicable"
  ]);

  const TAXONOMIC_RANKS = deepFreeze([
    "realm",
    "domain",
    "kingdom",
    "phylum",
    "class",
    "order",
    "family",
    "genus",
    "species",
    "subspecies",
    "strain",
    "serotype",
    "genotype",
    "clade",
    "unranked",
    "not-applicable"
  ]);

  const NOMENCLATURE_STATUSES = deepFreeze([
    "accepted",
    "provisional",
    "historical",
    "unranked",
    "not-applicable"
  ]);

  const TAXONOMY_REVIEW_STATUSES = deepFreeze([
    "REVIEWED_CURRENT",
    "REVIEWED_UNRANKED",
    "NOT_APPLICABLE"
  ]);

  const TAXONOMY_CONTRACT = deepFreeze({
    requiredFields: ["authority", "authorityId", "canonicalTaxonName", "rank", "lineage", "nomenclatureStatus", "reviewStatus", "reviewedAt", "reviewDueAt"],
    optionalFields: ["reviewNote"],
    lineageNodeFields: ["rank", "name", "authorityId"],
    orderedBroadToNarrow: true,
    terminalNodeMatchesCanonicalTaxon: true,
    scheduledReviewEnforced: true
  });

  const TRAIT_VALUE_REGISTRIES = deepFreeze({
    cellularity: ["cellular", "multicellular", "acellular"],
    gramReaction: ["positive", "negative", "variable", "indeterminate", "unknown", "not-applicable"],
    cellMorphology: ["coccus", "bacillus", "coccobacillus", "curved-rod", "spiral", "filamentous", "pleomorphic", "yeast", "mold", "dimorphic-fungus", "protozoal", "nematode", "cestode", "trematode", "arthropod", "variable", "unknown", "not-applicable"],
    oxygenRequirement: ["obligate-aerobe", "obligate-anaerobe", "facultative-anaerobe", "aerotolerant-anaerobe", "microaerophile", "capnophile", "variable", "unknown", "not-applicable"],
    acidFast: ["positive", "negative", "partial", "variable", "unknown", "not-applicable"],
    sporeForming: ["yes", "no", "variable", "unknown", "not-applicable"],
    motility: ["motile", "nonmotile", "variable", "unknown", "not-applicable"],
    intracellularBehavior: ["obligate-intracellular", "facultative-intracellular", "extracellular", "mixed", "variable", "unknown", "not-applicable"],
    genomeType: ["dsdna", "ssdna", "positive-sense-ssrna", "negative-sense-ssrna", "dsrna", "ssrna-reverse-transcribing", "dsdna-reverse-transcribing", "dna", "rna", "variable", "unknown", "not-applicable"],
    envelope: ["enveloped", "non-enveloped", "variable", "unknown", "not-applicable"],
    capsidSymmetry: ["icosahedral", "helical", "complex", "variable", "unknown", "not-applicable"],
    proteinOnly: ["yes"]
  });

  const AGENT_TRAIT_SCHEMAS = deepFreeze({
    bacterium: { required: ["cellularity", "gramReaction", "cellMorphology", "oxygenRequirement", "acidFast", "sporeForming", "motility", "intracellularBehavior"] },
    virus: { required: ["cellularity", "genomeType", "envelope", "capsidSymmetry", "intracellularBehavior"] },
    fungus: { required: ["cellularity", "cellMorphology", "oxygenRequirement", "motility", "intracellularBehavior"] },
    protozoan: { required: ["cellularity", "cellMorphology", "motility", "intracellularBehavior"] },
    nematode: { required: ["cellularity", "cellMorphology", "motility", "intracellularBehavior"] },
    cestode: { required: ["cellularity", "cellMorphology", "motility", "intracellularBehavior"] },
    trematode: { required: ["cellularity", "cellMorphology", "motility", "intracellularBehavior"] },
    ectoparasite: { required: ["cellularity", "cellMorphology", "motility", "intracellularBehavior"] },
    prion: { required: ["cellularity", "proteinOnly"] },
    "acellular-agent": { required: ["cellularity", "genomeType", "envelope", "intracellularBehavior"] }
  });

  const INCUBATION_STATUSES = deepFreeze([
    "known",
    "variable",
    "unknown",
    "not-applicable"
  ]);

  const INCUBATION_UNITS = deepFreeze([
    "minutes",
    "hours",
    "days",
    "weeks",
    "months",
    "years"
  ]);

  const ORGANISM_EPIDEMIOLOGY_CONTRACT = deepFreeze({
    requiredFields: ["incubation"],
    incubationFields: ["status", "minimum", "maximum", "typical", "unit", "context", "reason", "sourceKeys"],
    statuses: INCUBATION_STATUSES,
    units: INCUBATION_UNITS,
    evidenceRequired: true,
    explicitUncertaintyRequired: true
  });

  const CONCEPT_CLASSES = deepFreeze([
    "microbiota",
    "normal-human-microbiota",
    "microbiome",
    "colonization",
    "dysbiosis",
    "microbial-structure",
    "microbial-metabolism-replication",
    "microbial-genetics-gene-transfer",
    "pathogenesis",
    "host-interaction-transmission",
    "virulence-factor",
    "biofilm",
    "toxin",
    "resistance-mechanism",
    "resistance-phenotype",
    "antimicrobial-stewardship",
    "microbiology-concept"
  ]);

  const METHOD_CLASSES = deepFreeze([
    "specimen-collection-method",
    "specimen-transport-method",
    "microscopy-method",
    "staining-method",
    "culture-method",
    "biochemical-identification-method",
    "antigen-detection-method",
    "serologic-method",
    "molecular-method",
    "susceptibility-testing-method"
  ]);

  const MEDIUM_CLASSES = deepFreeze([
    "general-purpose",
    "enriched",
    "enrichment",
    "selective",
    "differential",
    "selective-differential",
    "transport",
    "anaerobic-reducing",
    "chromogenic",
    "susceptibility-testing",
    "special-purpose"
  ]);

  const IPC_CLASSES = deepFreeze([
    "standard-precaution",
    "transmission-based-precaution",
    "asepsis",
    "sterilization-method",
    "disinfection-method",
    "antisepsis",
    "environmental-control",
    "occupational-control",
    "inactivation-method"
  ]);

  const ALIAS_KINDS = deepFreeze([
    "identity-synonym",
    "former-scientific-name",
    "taxonomic-synonym",
    "common-name",
    "historical-common-name",
    "abbreviation",
    "common-misspelling"
  ]);

  const FORBIDDEN_ALIAS_KINDS = deepFreeze([
    "disease",
    "drug",
    "medication",
    "toxin",
    "medium",
    "culture-medium",
    "resistant-phenotype",
    "resistance-phenotype",
    "related-topic"
  ]);

  const TARGET_KINDS = deepFreeze([
    "organism",
    "microbiology-concept",
    "virulence-factor",
    "toxin",
    "resistance-mechanism",
    "resistance-phenotype",
    "diagnostic-method",
    "laboratory-test",
    "laboratory-finding",
    "specimen-collection-method",
    "staining-method",
    "culture-medium",
    "susceptibility-testing-method",
    "infection-prevention-concept",
    "precaution",
    "sterilization-method",
    "disinfection-method",
    "inactivation-method",
    "disease",
    "anatomic-site",
    "tissue",
    "reservoir",
    "vector",
    "transmission-mode",
    "medication",
    "medication-class",
    "therapy",
    "vaccine",
    "canonical-topic"
  ]);

  const RUNTIME_TARGET_COLLECTIONS = deepFreeze([
    "pharmDrugs",
    "pathologyDiseases",
    "labValues",
    "clinicalReferenceEntries",
    "holisticRemedies"
  ]);

  const BROWSE_BRANCHES = deepFreeze([
    { id: "infectious-agents", parentId: null, label: "Infectious agents", kind: "pillar", selectable: false },
    { id: "infectious-agents/bacteria", parentId: "infectious-agents", label: "Bacteria", kind: "agent-leaf", agentClasses: ["bacterium"] },
    { id: "infectious-agents/viruses", parentId: "infectious-agents", label: "Viruses", kind: "agent-leaf", agentClasses: ["virus"] },
    { id: "infectious-agents/fungi", parentId: "infectious-agents", label: "Fungi", kind: "agent-leaf", agentClasses: ["fungus"] },
    { id: "infectious-agents/parasites", parentId: "infectious-agents", label: "Parasites", kind: "aggregate", selectable: false },
    { id: "infectious-agents/parasites/protozoa", parentId: "infectious-agents/parasites", label: "Protozoa", kind: "agent-leaf", agentClasses: ["protozoan"] },
    { id: "infectious-agents/parasites/helminths", parentId: "infectious-agents/parasites", label: "Helminths", kind: "aggregate", selectable: false },
    { id: "infectious-agents/parasites/helminths/nematodes", parentId: "infectious-agents/parasites/helminths", label: "Nematodes", kind: "agent-leaf", agentClasses: ["nematode"] },
    { id: "infectious-agents/parasites/helminths/cestodes", parentId: "infectious-agents/parasites/helminths", label: "Cestodes", kind: "agent-leaf", agentClasses: ["cestode"] },
    { id: "infectious-agents/parasites/helminths/trematodes", parentId: "infectious-agents/parasites/helminths", label: "Trematodes", kind: "agent-leaf", agentClasses: ["trematode"] },
    { id: "infectious-agents/parasites/ectoparasites", parentId: "infectious-agents/parasites", label: "Ectoparasites", kind: "agent-leaf", agentClasses: ["ectoparasite"] },
    { id: "infectious-agents/prions-acellular-agents", parentId: "infectious-agents", label: "Prions and acellular agents", kind: "agent-leaf", agentClasses: ["prion", "acellular-agent"] },

    { id: "host-microbe-ecology", parentId: null, label: "Host-microbe ecology", kind: "pillar", selectable: false },
    { id: "host-microbe-ecology/microbiota", parentId: "host-microbe-ecology", label: "Microbiota", kind: "concept-leaf", conceptClasses: ["microbiota"] },
    { id: "host-microbe-ecology/normal-human-microbiota", parentId: "host-microbe-ecology", label: "Normal human microbiota", kind: "concept-leaf", conceptClasses: ["normal-human-microbiota"] },
    { id: "host-microbe-ecology/microbiome", parentId: "host-microbe-ecology", label: "Microbiome", kind: "concept-leaf", conceptClasses: ["microbiome"] },
    { id: "host-microbe-ecology/colonization", parentId: "host-microbe-ecology", label: "Colonization", kind: "concept-leaf", conceptClasses: ["colonization"] },
    { id: "host-microbe-ecology/dysbiosis", parentId: "host-microbe-ecology", label: "Dysbiosis", kind: "concept-leaf", conceptClasses: ["dysbiosis"] },

    { id: "biology-pathogenesis", parentId: null, label: "Microbial biology and pathogenesis", kind: "pillar", selectable: false },
    { id: "biology-pathogenesis/structure-morphology", parentId: "biology-pathogenesis", label: "Structure and morphology", kind: "concept-leaf", conceptClasses: ["microbial-structure"] },
    { id: "biology-pathogenesis/metabolism-replication", parentId: "biology-pathogenesis", label: "Metabolism and replication", kind: "concept-leaf", conceptClasses: ["microbial-metabolism-replication"] },
    { id: "biology-pathogenesis/genetics-gene-transfer", parentId: "biology-pathogenesis", label: "Microbial genetics and gene transfer", kind: "concept-leaf", conceptClasses: ["microbial-genetics-gene-transfer"] },
    { id: "biology-pathogenesis/pathogenesis", parentId: "biology-pathogenesis", label: "Pathogenesis", kind: "concept-leaf", conceptClasses: ["pathogenesis"] },
    { id: "biology-pathogenesis/host-interaction-transmission", parentId: "biology-pathogenesis", label: "Host interaction, tropism, and transmission", kind: "concept-leaf", conceptClasses: ["host-interaction-transmission"] },
    { id: "biology-pathogenesis/virulence-factors", parentId: "biology-pathogenesis", label: "Virulence factors", kind: "concept-leaf", conceptClasses: ["virulence-factor"] },
    { id: "biology-pathogenesis/biofilms", parentId: "biology-pathogenesis", label: "Biofilms", kind: "concept-leaf", conceptClasses: ["biofilm"] },
    { id: "biology-pathogenesis/toxins", parentId: "biology-pathogenesis", label: "Toxins", kind: "concept-leaf", conceptClasses: ["toxin"] },

    { id: "antimicrobial-resistance", parentId: null, label: "Antimicrobial resistance", kind: "pillar", selectable: false },
    { id: "antimicrobial-resistance/resistance-mechanisms", parentId: "antimicrobial-resistance", label: "Resistance mechanisms", kind: "concept-leaf", conceptClasses: ["resistance-mechanism"] },
    { id: "antimicrobial-resistance/resistance-phenotypes", parentId: "antimicrobial-resistance", label: "Resistance phenotypes", kind: "concept-leaf", conceptClasses: ["resistance-phenotype"] },
    { id: "antimicrobial-resistance/stewardship-concepts", parentId: "antimicrobial-resistance", label: "Stewardship concepts", kind: "concept-leaf", conceptClasses: ["antimicrobial-stewardship"] },

    { id: "diagnostic-microbiology", parentId: null, label: "Diagnostic microbiology", kind: "pillar", selectable: false },
    { id: "diagnostic-microbiology/specimen-collection", parentId: "diagnostic-microbiology", label: "Specimen collection and transport", kind: "method-leaf", methodClasses: ["specimen-collection-method", "specimen-transport-method"] },
    { id: "diagnostic-microbiology/microscopy", parentId: "diagnostic-microbiology", label: "Microscopy", kind: "method-leaf", methodClasses: ["microscopy-method"] },
    { id: "diagnostic-microbiology/staining-methods", parentId: "diagnostic-microbiology", label: "Staining methods", kind: "method-leaf", methodClasses: ["staining-method"] },
    { id: "diagnostic-microbiology/culture-methods", parentId: "diagnostic-microbiology", label: "Culture methods", kind: "method-leaf", methodClasses: ["culture-method"] },
    { id: "diagnostic-microbiology/culture-media", parentId: "diagnostic-microbiology", label: "Culture media", kind: "medium-leaf", entryKinds: ["culture-medium"], mediumClasses: MEDIUM_CLASSES },
    { id: "diagnostic-microbiology/biochemical-identification", parentId: "diagnostic-microbiology", label: "Biochemical identification", kind: "method-leaf", methodClasses: ["biochemical-identification-method"] },
    { id: "diagnostic-microbiology/antigen-serologic-methods", parentId: "diagnostic-microbiology", label: "Antigen and serologic methods", kind: "method-leaf", methodClasses: ["antigen-detection-method", "serologic-method"] },
    { id: "diagnostic-microbiology/molecular-methods", parentId: "diagnostic-microbiology", label: "Molecular methods", kind: "method-leaf", methodClasses: ["molecular-method"] },
    { id: "diagnostic-microbiology/susceptibility-testing", parentId: "diagnostic-microbiology", label: "Susceptibility testing", kind: "method-leaf", methodClasses: ["susceptibility-testing-method"] },

    { id: "infection-prevention-control", parentId: null, label: "Infection prevention and control", kind: "pillar", selectable: false },
    { id: "infection-prevention-control/standard-precautions", parentId: "infection-prevention-control", label: "Standard precautions", kind: "ipc-leaf", ipcClasses: ["standard-precaution"] },
    { id: "infection-prevention-control/transmission-based-precautions", parentId: "infection-prevention-control", label: "Transmission-based precautions", kind: "ipc-leaf", ipcClasses: ["transmission-based-precaution"] },
    { id: "infection-prevention-control/asepsis", parentId: "infection-prevention-control", label: "Asepsis", kind: "ipc-leaf", ipcClasses: ["asepsis"] },
    { id: "infection-prevention-control/sterilization", parentId: "infection-prevention-control", label: "Sterilization", kind: "ipc-leaf", ipcClasses: ["sterilization-method"] },
    { id: "infection-prevention-control/disinfection", parentId: "infection-prevention-control", label: "Disinfection", kind: "ipc-leaf", ipcClasses: ["disinfection-method"] },
    { id: "infection-prevention-control/antisepsis", parentId: "infection-prevention-control", label: "Antisepsis", kind: "ipc-leaf", ipcClasses: ["antisepsis"] },
    { id: "infection-prevention-control/environmental-controls", parentId: "infection-prevention-control", label: "Environmental controls", kind: "ipc-leaf", ipcClasses: ["environmental-control", "inactivation-method"] },
    { id: "infection-prevention-control/occupational-controls", parentId: "infection-prevention-control", label: "Occupational controls", kind: "ipc-leaf", ipcClasses: ["occupational-control"] },

    { id: "disease-gateway", parentId: null, label: "Related diseases", kind: "federated-gateway", selectable: true, targetKinds: ["disease"] },
    { id: "therapy-vaccine-gateway", parentId: null, label: "Therapies and vaccines", kind: "federated-gateway", selectable: true, targetKinds: ["medication", "medication-class", "therapy", "vaccine"] }
  ]);

  const CANONICAL_TERMINOLOGY = deepFreeze({
    microbiota: {
      canonicalTerm: "Microbiota",
      conceptClass: "microbiota",
      prohibitedCanonicalMerges: ["microbiome", "normal-human-microbiota"]
    },
    normalHumanMicrobiota: {
      canonicalTerm: "Normal human microbiota",
      conceptClass: "normal-human-microbiota",
      identityAliases: [{ value: "Normal flora", kind: "historical-common-name", identity: true }],
      prohibitedCanonicalMerges: ["microbiota", "microbiome"]
    },
    microbiome: {
      canonicalTerm: "Microbiome",
      conceptClass: "microbiome",
      prohibitedCanonicalMerges: ["microbiota", "normal-human-microbiota"]
    },
    susceptibilityTesting: {
      canonicalBranchId: "diagnostic-microbiology/susceptibility-testing",
      duplicateBranchIds: []
    }
  });

  const OWNERSHIP_RULES = deepFreeze({
    organism: { authoring: "microbiology-owned", ownerDomain: "Microbiology", runtimeCollection: "clinicalReferenceEntries" },
    "microbiology-concept": { authoring: "microbiology-owned", ownerDomain: "Microbiology", runtimeCollection: "clinicalReferenceEntries" },
    "microbiology-method": { authoring: "microbiology-owned-when-not-already-canonical", ownerDomain: "Microbiology", runtimeCollection: "clinicalReferenceEntries" },
    "culture-medium": { authoring: "microbiology-owned-when-not-already-canonical", ownerDomain: "Microbiology", runtimeCollection: "clinicalReferenceEntries" },
    "infection-prevention-concept": { authoring: "microbiology-owned-when-not-already-canonical", ownerDomain: "Microbiology", runtimeCollection: "clinicalReferenceEntries" },
    disease: { authoring: "federated-only", ownerDomain: "Pathology", runtimeCollection: "pathologyDiseases", gateway: "disease-gateway" },
    medication: { authoring: "federated-only", ownerDomain: "Pharmacology", runtimeCollection: "pharmDrugs", gateway: "therapy-vaccine-gateway" },
    "medication-class": { authoring: "federated-only", ownerDomain: "Pharmacology", runtimeCollection: "pharmDrugs", gateway: "therapy-vaccine-gateway" },
    therapy: { authoring: "federated-only", ownerDomain: "canonical-existing-owner", runtimeCollection: null, runtimeCollections: ["pharmDrugs", "clinicalReferenceEntries"], gateway: "therapy-vaccine-gateway" },
    vaccine: { authoring: "federated-only", ownerDomain: "canonical-existing-owner", runtimeCollection: null, runtimeCollections: ["pharmDrugs", "clinicalReferenceEntries"], gateway: "therapy-vaccine-gateway" }
  });

  const REQUIRED_CONTENT_GROUPS = deepFreeze({
    organism: [
      { id: "definition", title: "Definition", required: true },
      { id: "identity-classification", title: "Identity and classification", required: true },
      { id: "structure-traits", title: "Structure and traits", required: true },
      { id: "ecology-transmission", title: "Ecology and transmission", required: true },
      { id: "pathogenesis", title: "Pathogenesis", required: true },
      { id: "clinical-significance", title: "Clinical significance", required: true },
      { id: "diagnostic-identification", title: "Diagnostic identification", required: true },
      { id: "prevention-safety", title: "Prevention and safety", required: true },
      { id: "sources", title: "Sources", required: true }
    ],
    "microbiology-concept": [
      { id: "definition", title: "Definition", required: true },
      { id: "mechanism", title: "Mechanism", required: true },
      { id: "examples", title: "Examples", required: false },
      { id: "clinical-significance", title: "Clinical significance", required: true },
      { id: "limitations", title: "Limitations", required: true },
      { id: "sources", title: "Sources", required: true }
    ],
    "microbiology-method": [
      { id: "principle", title: "Principle", required: true },
      { id: "purpose", title: "Purpose", required: true },
      { id: "specimen-preparation", title: "Specimen and preparation", required: true },
      { id: "procedure", title: "Method", required: true },
      { id: "interpretation", title: "Interpretation", required: true },
      { id: "limitations", title: "Limitations", required: true },
      { id: "safety", title: "Safety", required: true },
      { id: "sources", title: "Sources", required: true }
    ],
    "culture-medium": [
      { id: "definition-composition", title: "Definition and composition", required: true },
      { id: "purpose-selective-differential-basis", title: "Purpose and selective or differential basis", required: true },
      { id: "preparation-use", title: "Preparation and use", required: true },
      { id: "expected-growth-appearance", title: "Expected growth and appearance", required: true },
      { id: "interpretation", title: "Interpretation", required: true },
      { id: "limitations", title: "Limitations", required: true },
      { id: "safety-storage", title: "Safety and storage", required: true },
      { id: "sources", title: "Sources", required: true }
    ],
    "infection-prevention-concept": [
      { id: "scope", title: "Scope", required: true },
      { id: "indications", title: "Indications", required: true },
      { id: "mechanism", title: "Mechanism", required: true },
      { id: "procedure", title: "Procedure", required: true },
      { id: "limitations", title: "Limitations", required: true },
      { id: "precautions", title: "Precautions", required: true },
      { id: "sources", title: "Sources", required: true }
    ]
  });

  const RELATIONSHIP_RULES = deepFreeze([
    { id: "causes-disease", domain: ["organism"], range: ["disease"], inverseIndex: "caused-by-organism" },
    { id: "associated-with-disease", domain: ["organism", "microbiology-topic"], range: ["disease"], inverseIndex: "has-microbiology-association" },
    { id: "colonizes-anatomic-site", domain: ["organism"], range: ["anatomic-site"], inverseIndex: "colonized-by-organism" },
    { id: "infects-anatomic-site", domain: ["organism"], range: ["anatomic-site"], inverseIndex: "infected-by-organism" },
    { id: "has-reservoir", domain: ["organism"], range: ["reservoir"], inverseIndex: "reservoir-for-organism" },
    { id: "has-vector", domain: ["organism"], range: ["vector"], inverseIndex: "vector-for-organism" },
    { id: "transmitted-by", domain: ["organism"], range: ["transmission-mode", "vector"], inverseIndex: "transmits-organism" },
    { id: "targets-tissue", domain: ["organism", "toxin", "virulence-factor"], range: ["tissue", "anatomic-site"], inverseIndex: "targeted-by-microbiology-entity" },
    { id: "uses-virulence-factor", domain: ["organism"], range: ["virulence-factor"], inverseIndex: "used-by-organism" },
    { id: "produces-toxin", domain: ["organism"], range: ["toxin"], inverseIndex: "produced-by-organism" },
    { id: "detected-by", domain: ["organism"], range: ["diagnostic-method", "laboratory-test"], inverseIndex: "detects-organism" },
    { id: "associated-laboratory-finding", domain: ["organism"], range: ["laboratory-finding"], inverseIndex: "associated-with-organism" },
    { id: "sampled-by", domain: ["organism"], range: ["specimen-collection-method"], inverseIndex: "samples-organism" },
    { id: "stained-by", domain: ["organism"], range: ["staining-method"], inverseIndex: "stains-organism" },
    { id: "grows-on-medium", domain: ["organism"], range: ["culture-medium"], inverseIndex: "supports-growth-of" },
    { id: "susceptibility-tested-by", domain: ["organism"], range: ["susceptibility-testing-method"], inverseIndex: "tests-susceptibility-of" },
    { id: "carries-resistance-mechanism", domain: ["organism", "resistance-phenotype"], range: ["resistance-mechanism"], inverseIndex: "carried-by" },
    { id: "has-resistance-phenotype", domain: ["organism"], range: ["resistance-phenotype"], inverseIndex: "phenotype-of-organism" },
    { id: "confers-resistance-to", domain: ["resistance-mechanism", "resistance-phenotype"], range: ["medication", "medication-class"], inverseIndex: "resisted-through" },
    {
      id: "resistant-to",
      domain: ["organism", "resistance-phenotype"],
      range: ["medication", "medication-class"],
      inverseIndex: "ineffective-against-reviewed-organism-context",
      contextRequired: ["resistanceBasis", "susceptibilityContext"],
      contextIssueCode: "microbiology-context-free-antimicrobial-resistance",
      contextMessage: "Organism resistance relationships require the reviewed resistance basis and susceptibility context; they must not present an antimicrobial as universally ineffective."
    },
    { id: "prevented-by-vaccine", domain: ["organism"], range: ["vaccine"], inverseIndex: "prevents-organism" },
    { id: "requires-precaution", domain: ["organism"], range: ["precaution"], inverseIndex: "required-for-organism" },
    { id: "controlled-by-sterilization-method", domain: ["organism"], range: ["sterilization-method"], inverseIndex: "controls-organism" },
    { id: "controlled-by-disinfection-method", domain: ["organism"], range: ["disinfection-method"], inverseIndex: "controls-organism" },
    { id: "inactivated-by", domain: ["organism"], range: ["inactivation-method", "sterilization-method", "disinfection-method"], inverseIndex: "inactivates-organism" },
    { id: "differential-with", domain: ["organism"], range: ["organism"], inverseIndex: "differential-with" },
    { id: "related-organism", domain: ["organism"], range: ["organism"], inverseIndex: "related-organism" },
    { id: "nclex-associated-topic", domain: ["organism"], range: ["canonical-topic"], inverseIndex: "nclex-association-for-organism" },
    { id: "exam-associated-topic", domain: ["organism"], range: ["canonical-topic"], inverseIndex: "exam-association-for-organism" },
    { id: "related-topic", domain: ["microbiology-topic"], range: ["canonical-topic"], inverseIndex: "related-from-microbiology" },
    {
      id: "treated-by",
      domain: ["organism"],
      range: ["medication", "medication-class", "therapy"],
      inverseIndex: "treats-organism-in-context",
      contextRequired: ["syndromeOrSite", "hostContext", "susceptibilityContext"],
      contextIssueCode: "microbiology-context-free-organism-treatment",
      contextMessage: "Organism treatment relationships require syndrome/site, host, and susceptibility context; an organism name alone is not a treatment indication."
    }
  ]);

  const ORGANISM_RELATIONSHIP_GROUPS = deepFreeze([
    { id: "disease-associations", required: true, anyOf: ["causes-disease", "associated-with-disease"] },
    { id: "ecology-transmission", required: true, anyOf: ["colonizes-anatomic-site", "infects-anatomic-site", "has-reservoir", "has-vector", "transmitted-by"] },
    { id: "pathogenesis", required: true, anyOf: ["targets-tissue", "uses-virulence-factor", "produces-toxin"] },
    { id: "diagnostics-laboratory", required: true, anyOf: ["detected-by", "associated-laboratory-finding", "sampled-by", "stained-by", "grows-on-medium", "susceptibility-tested-by"] },
    { id: "therapy-resistance", required: true, anyOf: ["treated-by", "carries-resistance-mechanism", "has-resistance-phenotype", "confers-resistance-to", "resistant-to"] },
    { id: "prevention-isolation", required: true, anyOf: ["prevented-by-vaccine", "requires-precaution", "controlled-by-sterilization-method", "controlled-by-disinfection-method", "inactivated-by"] },
    { id: "related-organisms", required: true, anyOf: ["differential-with", "related-organism"] },
    { id: "education-exam", required: true, anyOf: ["nclex-associated-topic", "exam-associated-topic", "related-topic"] }
  ]);

  const ARCHITECTURE_STATUSES = deepFreeze(["AWAITING_APPROVAL", "APPROVED", "REJECTED"]);
  const AGGREGATE_BRANCH_IDS = deepFreeze(BROWSE_BRANCHES
    .filter((branch) => branch.kind === "aggregate")
    .map((branch) => branch.id));
  const GATEWAY_BRANCH_IDS = deepFreeze(BROWSE_BRANCHES
    .filter((branch) => branch.kind === "federated-gateway")
    .map((branch) => branch.id));

  function ordinalCompare(left, right) {
    const a = String(left);
    const b = String(right);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function normalizeWhitespace(value) {
    return String(value == null ? "" : value).normalize("NFKC").replace(/\s+/g, " ").trim();
  }

  function normalizeIdentity(value) {
    return normalizeWhitespace(value)
      .toLocaleLowerCase("en-US")
      .replace(/[\u2010-\u2015]/g, "-")
      .replace(/\s*([:/])\s*/g, "$1");
  }

  function slugify(value) {
    return normalizeIdentity(value)
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  function stableStringify(value) {
    const ancestors = new Set();
    function serialize(current, inArray) {
      if (current && typeof current === "object" && typeof current.toJSON === "function") current = current.toJSON();
      if (current === null) return "null";
      const type = typeof current;
      if (type === "string" || type === "boolean") return JSON.stringify(current);
      if (type === "number") return Number.isFinite(current) ? JSON.stringify(current) : "null";
      if (type === "bigint") throw new TypeError("stableStringify cannot serialize BigInt values");
      if (type === "undefined" || type === "function" || type === "symbol") return inArray ? "null" : undefined;
      if (current instanceof Number || current instanceof String || current instanceof Boolean) {
        return serialize(current.valueOf(), inArray);
      }
      if (ancestors.has(current)) throw new TypeError("stableStringify cannot serialize circular structures");
      ancestors.add(current);
      let output;
      if (Array.isArray(current)) {
        output = `[${current.map((item) => {
          const serialized = serialize(item, true);
          return serialized === undefined ? "null" : serialized;
        }).join(",")}]`;
      } else {
        const fields = Object.keys(current).sort(ordinalCompare).flatMap((key) => {
          const serialized = serialize(current[key], false);
          return serialized === undefined ? [] : [`${JSON.stringify(key)}:${serialized}`];
        });
        output = `{${fields.join(",")}}`;
      }
      ancestors.delete(current);
      return output;
    }
    return serialize(value, false);
  }

  function utf8Bytes(value) {
    const text = String(value);
    if (typeof TextEncoder !== "undefined") return Array.from(new TextEncoder().encode(text));
    const encoded = unescape(encodeURIComponent(text));
    const bytes = [];
    for (let index = 0; index < encoded.length; index += 1) bytes.push(encoded.charCodeAt(index));
    return bytes;
  }

  function sha256(value) {
    const bytes = utf8Bytes(value);
    const bitLength = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    const high = Math.floor(bitLength / 0x100000000);
    const low = bitLength >>> 0;
    for (let shift = 24; shift >= 0; shift -= 8) bytes.push((high >>> shift) & 0xff);
    for (let shift = 24; shift >= 0; shift -= 8) bytes.push((low >>> shift) & 0xff);

    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const rotateRight = (word, bits) => (word >>> bits) | (word << (32 - bits));
    for (let offset = 0; offset < bytes.length; offset += 64) {
      const w = new Array(64);
      for (let index = 0; index < 16; index += 1) {
        const cursor = offset + (index * 4);
        w[index] = ((bytes[cursor] << 24) | (bytes[cursor + 1] << 16) | (bytes[cursor + 2] << 8) | bytes[cursor + 3]) >>> 0;
      }
      for (let index = 16; index < 64; index += 1) {
        const s0 = rotateRight(w[index - 15], 7) ^ rotateRight(w[index - 15], 18) ^ (w[index - 15] >>> 3);
        const s1 = rotateRight(w[index - 2], 17) ^ rotateRight(w[index - 2], 19) ^ (w[index - 2] >>> 10);
        w[index] = (w[index - 16] + s0 + w[index - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let index = 0; index < 64; index += 1) {
        const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
        const choose = (e & f) ^ (~e & g);
        const temp1 = (hh + sigma1 + choose + k[index] + w[index]) >>> 0;
        const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
        const majority = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (sigma0 + majority) >>> 0;
        hh = g; g = f; f = e; e = (d + temp1) >>> 0; d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
      h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
    }
    return h.map((word) => word.toString(16).padStart(8, "0")).join("");
  }

  function architectureDefinition() {
    return {
      schemaVersion: SCHEMA_VERSION,
      approvalSchemaVersion: APPROVAL_SCHEMA_VERSION,
      architectureVersion: ARCHITECTURE_VERSION,
      taxonomyVersion: TAXONOMY_VERSION,
      relationshipSchemaVersion: RELATIONSHIP_SCHEMA_VERSION,
      generatorVersion: GENERATOR_VERSION,
      entryKinds: ENTRY_KINDS,
      agentClasses: AGENT_CLASSES,
      taxonomyAuthorities: TAXONOMY_AUTHORITIES,
      taxonomicRanks: TAXONOMIC_RANKS,
      nomenclatureStatuses: NOMENCLATURE_STATUSES,
      taxonomyReviewStatuses: TAXONOMY_REVIEW_STATUSES,
      taxonomyContract: TAXONOMY_CONTRACT,
      traitValueRegistries: TRAIT_VALUE_REGISTRIES,
      agentTraitSchemas: AGENT_TRAIT_SCHEMAS,
      incubationStatuses: INCUBATION_STATUSES,
      incubationUnits: INCUBATION_UNITS,
      organismEpidemiologyContract: ORGANISM_EPIDEMIOLOGY_CONTRACT,
      conceptClasses: CONCEPT_CLASSES,
      methodClasses: METHOD_CLASSES,
      mediumClasses: MEDIUM_CLASSES,
      ipcClasses: IPC_CLASSES,
      aliasKinds: ALIAS_KINDS,
      forbiddenAliasKinds: FORBIDDEN_ALIAS_KINDS,
      targetKinds: TARGET_KINDS,
      runtimeTargetCollections: RUNTIME_TARGET_COLLECTIONS,
      architectureStatuses: ARCHITECTURE_STATUSES,
      browseBranches: BROWSE_BRANCHES,
      canonicalTerminology: CANONICAL_TERMINOLOGY,
      ownershipRules: OWNERSHIP_RULES,
      requiredContentGroups: REQUIRED_CONTENT_GROUPS,
      relationshipRules: RELATIONSHIP_RULES,
      organismRelationshipGroups: ORGANISM_RELATIONSHIP_GROUPS
    };
  }

  function architectureFingerprintMaterial() {
    return `${FINGERPRINT_VERSION}\n${stableStringify(architectureDefinition())}\n`;
  }

  function architectureSha256() {
    return sha256(architectureFingerprintMaterial());
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    if (Object.prototype.toString.call(value) !== "[object Object]") return false;
    const prototype = Object.getPrototypeOf(value);
    // Runtime inventory records originate in a Node VM realm, whose
    // Object.prototype is not reference-equal to this module's prototype.
    // A plain object's direct prototype is nevertheless either null or an
    // Object prototype whose own prototype is null; class instances fail this
    // structural check without relying on realm identity.
    return prototype === null || Object.getPrototypeOf(prototype) === null;
  }

  function cloneJson(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function nonEmptyText(value) {
    return typeof value === "string" && Boolean(normalizeWhitespace(value));
  }

  function uniqueSorted(values, normalizer) {
    const seen = new Set();
    const output = [];
    (Array.isArray(values) ? values : []).forEach((value) => {
      const key = normalizer ? normalizer(value) : String(value);
      if (!key || seen.has(key)) return;
      seen.add(key);
      output.push(value);
    });
    return output.sort((left, right) => ordinalCompare(
      normalizer ? normalizer(left) : left,
      normalizer ? normalizer(right) : right
    ));
  }

  function makeIssue(code, path, message, options) {
    const extra = options && typeof options === "object" ? options : {};
    return {
      code,
      path: path || "",
      message,
      severity: extra.severity || "error",
      blocking: extra.blocking !== undefined ? Boolean(extra.blocking) : extra.severity !== "warning" && extra.severity !== "informational",
      ...(extra.entryId ? { entryId: extra.entryId } : {}),
      ...(extra.value !== undefined ? { value: extra.value } : {}),
      ...(extra.evidence !== undefined ? { evidence: extra.evidence } : {}),
      ...(extra.suggestedAction ? { suggestedAction: extra.suggestedAction } : {}),
      ...(extra.requiresMedicalReview !== undefined ? { requiresMedicalReview: Boolean(extra.requiresMedicalReview) } : {}),
      ...(extra.systemic !== undefined ? { systemic: Boolean(extra.systemic) } : {})
    };
  }

  function validationResult(issues) {
    const list = Array.isArray(issues) ? issues : [];
    const errors = list.filter((issue) => issue.blocking !== false && issue.severity !== "warning" && issue.severity !== "informational");
    const warnings = list.filter((issue) => issue.severity === "warning" || issue.severity === "informational" || issue.blocking === false);
    return { valid: errors.length === 0, issues: list, errors, warnings };
  }

  function sourceSpecForEntry(entry) {
    if (!isPlainObject(entry)) return entry;
    const metadata = isPlainObject(entry.microbiology) ? entry.microbiology : {};
    if (isPlainObject(metadata.sourceSpec)) return metadata.sourceSpec;
    if (isPlainObject(entry.microbiologySpec)) return entry.microbiologySpec;
    if (isPlainObject(entry.contentGroups)) return entry;
    if (normalizeWhitespace(metadata.entryKind || entry.microbiologyKind) && Array.isArray(entry.sections)) {
      const contentGroups = {};
      entry.sections.forEach((section) => {
        if (!isPlainObject(section) || !normalizeWhitespace(section.id)) return;
        contentGroups[normalizeWhitespace(section.id)] = cloneJson(section.content);
      });
      return {
        id: normalizeWhitespace(entry.id || entry.directTargetId),
        name: normalizeWhitespace(entry.canonicalName || entry.name),
        ...(entry.displayName ? { displayName: normalizeWhitespace(entry.displayName) } : {}),
        entryKind: normalizeWhitespace(metadata.entryKind || entry.microbiologyKind),
        classification: cloneJson(isPlainObject(metadata.classification) ? metadata.classification : {}),
        browsePath: normalizeWhitespace(metadata.browsePath || entry.browse && entry.browse.branchId),
        aliases: cloneJson(Array.isArray(entry.typedAliases) ? entry.typedAliases : []),
        searchTerms: cloneJson(Array.isArray(entry.searchTerms) ? entry.searchTerms : []),
        contentGroups,
        ...(entry.taxonomy !== undefined ? { taxonomy: cloneJson(entry.taxonomy) } : {}),
        ...(entry.traits !== undefined ? { traits: cloneJson(entry.traits) } : {}),
        ...(entry.epidemiology !== undefined ? { epidemiology: cloneJson(entry.epidemiology) } : {}),
        ...(entry.relationshipNotApplicable !== undefined ? { relationshipNotApplicable: cloneJson(entry.relationshipNotApplicable) } : {}),
        relationships: cloneJson(Array.isArray(entry.microbiologyRelationships)
          ? entry.microbiologyRelationships
          : Array.isArray(entry.relationships) ? entry.relationships : []),
        sourceKeys: cloneJson(Array.isArray(metadata.sourceKeys) ? metadata.sourceKeys : []),
        reviewStatus: normalizeWhitespace(metadata.reviewStatus),
        ...(metadata.reviewedAt ? { reviewedAt: normalizeWhitespace(metadata.reviewedAt) } : {})
      };
    }
    return entry;
  }

  function classificationForEntry(entry) {
    const source = sourceSpecForEntry(entry) || {};
    const nested = isPlainObject(source.classification) ? source.classification : {};
    const metadata = isPlainObject(source.microbiology) && isPlainObject(source.microbiology.classification)
      ? source.microbiology.classification
      : {};
    return {
      agentClass: normalizeWhitespace(source.agentClass || nested.agentClass || metadata.agentClass),
      conceptClass: normalizeWhitespace(source.conceptClass || nested.conceptClass || metadata.conceptClass),
      methodClass: normalizeWhitespace(source.methodClass || nested.methodClass || metadata.methodClass),
      mediumClass: normalizeWhitespace(source.mediumClass || nested.mediumClass || metadata.mediumClass),
      ipcClass: normalizeWhitespace(source.ipcClass || nested.ipcClass || metadata.ipcClass)
    };
  }

  function entryKindForRecord(entry) {
    const source = sourceSpecForEntry(entry) || {};
    const metadata = isPlainObject(source.microbiology) ? source.microbiology : {};
    return normalizeWhitespace(source.entryKind || metadata.entryKind || source.microbiologyKind);
  }

  function entityKindForEntry(entry) {
    const kind = entryKindForRecord(entry);
    const classification = classificationForEntry(entry);
    if (kind === "organism") return "organism";
    if (kind === "microbiology-concept") return classification.conceptClass || "microbiology-concept";
    if (kind === "microbiology-method") return classification.methodClass || "microbiology-method";
    if (kind === "culture-medium") return "culture-medium";
    if (kind === "infection-prevention-concept") return classification.ipcClass || "infection-prevention-concept";
    return kind;
  }

  function entityKindLineage(value) {
    const entry = isPlainObject(value) ? value : null;
    const primary = entry ? entityKindForEntry(entry) : normalizeWhitespace(value);
    const kind = entry ? entryKindForRecord(entry) : "";
    const classification = entry ? classificationForEntry(entry) : {};
    const lineage = new Set([primary]);
    if (entry) {
      lineage.add(kind);
      lineage.add("microbiology-topic");
      if (kind === "organism") {
        lineage.add("organism");
        if (classification.agentClass) lineage.add(classification.agentClass);
      }
      if (kind === "microbiology-concept" && classification.conceptClass) lineage.add(classification.conceptClass);
      if (kind === "microbiology-concept" && classification.conceptClass === "host-interaction-transmission") {
        // The approved taxonomy owns concrete transmission-route concepts under
        // host interaction and transmission. Expose that semantic role to the
        // relationship engine so `transmitted-by` can bind to an authored,
        // exact Microbiology destination instead of an untyped prose label.
        lineage.add("transmission-mode");
      }
      if (kind === "microbiology-method") {
        lineage.add("diagnostic-method");
        if (classification.methodClass) lineage.add(classification.methodClass);
      }
      if (kind === "culture-medium") {
        lineage.add("culture-medium");
        if (classification.mediumClass) lineage.add(classification.mediumClass);
      }
      if (kind === "infection-prevention-concept") {
        if (classification.ipcClass) lineage.add(classification.ipcClass);
        if (["standard-precaution", "transmission-based-precaution"].includes(classification.ipcClass)) lineage.add("precaution");
      }
    } else {
      if (AGENT_CLASSES.includes(primary)) lineage.add("organism");
      if (CONCEPT_CLASSES.includes(primary)) {
        lineage.add("microbiology-concept");
        lineage.add("microbiology-topic");
      }
      if (METHOD_CLASSES.includes(primary)) {
        lineage.add("microbiology-method");
        lineage.add("microbiology-topic");
        lineage.add("diagnostic-method");
      }
      if (primary === "culture-medium" || MEDIUM_CLASSES.includes(primary)) {
        lineage.add("culture-medium");
        lineage.add("microbiology-topic");
      }
      if (IPC_CLASSES.includes(primary)) {
        lineage.add("infection-prevention-concept");
        lineage.add("microbiology-topic");
        if (["standard-precaution", "transmission-based-precaution"].includes(primary)) lineage.add("precaution");
      }
      if (["organism", "microbiology-concept", "microbiology-method", "culture-medium", "infection-prevention-concept"].includes(primary)) {
        lineage.add("microbiology-topic");
      }
    }
    lineage.delete("");
    return Array.from(lineage).sort(ordinalCompare);
  }

  function normalizeTargetReference(reference) {
    if (!isPlainObject(reference)) return null;
    const targetId = normalizeWhitespace(reference.targetId || reference.directTargetId || reference.destinationId || reference.cardId);
    const targetCollection = normalizeWhitespace(reference.targetCollection || reference.declaredCollection || reference.collection || reference.ownerCollection);
    const canonicalTitle = normalizeWhitespace(reference.canonicalTitle || reference.targetName || reference.name || reference.title || reference.label);
    const targetName = normalizeWhitespace(reference.targetName || canonicalTitle);
    const targetKind = normalizeWhitespace(reference.targetKind || reference.kind || reference.semanticType);
    const normalized = {};
    if (targetId) normalized.targetId = targetId;
    if (targetCollection) normalized.targetCollection = targetCollection;
    if (canonicalTitle) normalized.canonicalTitle = canonicalTitle;
    if (targetName) normalized.targetName = targetName;
    if (targetKind) normalized.targetKind = targetKind;
    return normalized;
  }

  function targetReferenceKey(reference) {
    const target = normalizeTargetReference(reference);
    if (!target) return "";
    if (target.targetId) return `id:${target.targetId}`;
    if (target.targetCollection && target.canonicalTitle) {
      return `collection:${target.targetCollection}::title:${normalizeIdentity(target.canonicalTitle)}`;
    }
    return "";
  }

  function candidateRecords(candidates) {
    const output = [];
    const add = (item, collection) => {
      if (!item || typeof item !== "object") return;
      const metadata = isPlainObject(item.microbiology) ? item.microbiology : {};
      const id = normalizeWhitespace(item.directTargetId || item.id || item.cardId || item.topicId || metadata.stableId || metadata.id);
      const title = normalizeWhitespace(item.name || item.title || item.displayName || item.officialName || item.canonicalName);
      output.push({
        id,
        title,
        collection: normalizeWhitespace(collection || item.targetCollection || item.sourceCollection || item.runtimeCollection || metadata.runtimeCollection),
        item
      });
    };
    if (Array.isArray(candidates)) {
      candidates.forEach((candidate) => {
        if (candidate && candidate.item) add(candidate.item, candidate.collection || candidate.targetCollection);
        else add(candidate, candidate && (candidate.collection || candidate.targetCollection));
      });
    } else if (isPlainObject(candidates)) {
      Object.keys(candidates).sort(ordinalCompare).forEach((collection) => {
        const values = Array.isArray(candidates[collection]) ? candidates[collection] : [];
        values.forEach((item) => add(item, collection));
      });
    }
    return output;
  }

  function resolveTargetReference(reference, candidates) {
    const target = normalizeTargetReference(reference);
    const invalid = (reason) => ({ status: "invalid", resolutionStrategy: "none", target: null, candidates: [], reason });
    if (!target) return invalid("Target reference must be an object.");
    const records = candidateRecords(candidates);
    let matches = [];
    let strategy = "none";
    if (target.targetId) {
      strategy = "stable-id";
      matches = records.filter((candidate) => candidate.id === target.targetId);
    } else if (target.targetCollection && target.canonicalTitle) {
      strategy = "exact-collection-title";
      const titleKey = normalizeIdentity(target.canonicalTitle);
      matches = records.filter((candidate) => candidate.collection === target.targetCollection && normalizeIdentity(candidate.title) === titleKey);
    } else {
      return invalid("A target requires a stable ID or an exact collection plus canonical title.");
    }
    if (!matches.length) return { status: "unresolved", resolutionStrategy: strategy, target: null, candidates: [], reason: "No exact canonical destination exists." };
    if (matches.length > 1) return { status: "ambiguous", resolutionStrategy: strategy, target: null, candidates: matches, reason: "More than one exact canonical destination exists." };
    const match = matches[0];
    if (target.targetCollection && match.collection && target.targetCollection !== match.collection) {
      return { status: "invalid", resolutionStrategy: strategy, target: null, candidates: matches, reason: "The stable ID resolves outside the declared collection." };
    }
    if (target.canonicalTitle && match.title && normalizeIdentity(target.canonicalTitle) !== normalizeIdentity(match.title)) {
      return { status: "invalid", resolutionStrategy: strategy, target: null, candidates: matches, reason: "The stable ID and canonical title identify different destinations." };
    }
    return { status: "resolved", resolutionStrategy: strategy, target: match, candidates: matches, reason: "Resolved by exact canonical identity." };
  }

  function validateApproval(config, options) {
    const issues = [];
    const approval = isPlainObject(config) ? config : {};
    const hasContent = Boolean(options && options.hasContent);
    if (!isPlainObject(config)) issues.push(makeIssue("microbiology-approval-config-invalid", "approval", "The Microbiology approval configuration must be an object.", { systemic: true }));
    if (approval.schemaVersion !== APPROVAL_SCHEMA_VERSION) issues.push(makeIssue("microbiology-approval-schema-version", "approval.schemaVersion", `Expected ${APPROVAL_SCHEMA_VERSION}.`, { value: approval.schemaVersion, systemic: true }));
    if (approval.architectureVersion !== ARCHITECTURE_VERSION) issues.push(makeIssue("microbiology-architecture-version-drift", "approval.architectureVersion", `Expected ${ARCHITECTURE_VERSION}.`, { value: approval.architectureVersion, systemic: true }));
    if (!ARCHITECTURE_STATUSES.includes(approval.architectureStatus)) issues.push(makeIssue("microbiology-invalid-architecture-status", "approval.architectureStatus", "Architecture status must be AWAITING_APPROVAL, APPROVED, or REJECTED.", { value: approval.architectureStatus }));
    if (typeof approval.massExpansionEnabled !== "boolean") issues.push(makeIssue("microbiology-invalid-expansion-gate", "approval.massExpansionEnabled", "massExpansionEnabled must be a boolean.", { value: approval.massExpansionEnabled }));
    if (typeof approval.approvedArchitectureSha256 !== "string") issues.push(makeIssue("microbiology-invalid-approval-hash", "approval.approvedArchitectureSha256", "approvedArchitectureSha256 must be a string.", { value: approval.approvedArchitectureSha256 }));
    const expectedHash = architectureSha256();
    const actualHash = normalizeWhitespace(approval.approvedArchitectureSha256).toLowerCase();
    if (approval.architectureStatus === "APPROVED" && actualHash !== expectedHash) {
      issues.push(makeIssue("microbiology-architecture-approval-mismatch", "approval.approvedArchitectureSha256", "The approved architecture hash does not match the current canonical architecture.", { value: { expected: expectedHash, actual: actualHash }, systemic: true }));
    }
    if (approval.architectureStatus !== "APPROVED" && approval.massExpansionEnabled === true) {
      issues.push(makeIssue("microbiology-expansion-not-approved", "approval.massExpansionEnabled", "Mass expansion cannot be enabled until the exact architecture is approved.", { systemic: true }));
    }
    if (hasContent && !(approval.architectureStatus === "APPROVED" && approval.massExpansionEnabled === true && actualHash === expectedHash)) {
      issues.push(makeIssue("microbiology-expansion-not-approved", "approval", "Microbiology entries and gateway memberships are blocked until exact architecture approval enables expansion.", { value: { architectureStatus: approval.architectureStatus, massExpansionEnabled: approval.massExpansionEnabled, approvedArchitectureSha256: actualHash, expectedArchitectureSha256: expectedHash }, systemic: true }));
    }
    return validationResult(issues);
  }

  function expectedIdPrefix(entryKind) {
    return {
      organism: "microbiology:organism:",
      "microbiology-concept": "microbiology:concept:",
      "microbiology-method": "microbiology:method:",
      "culture-medium": "microbiology:medium:",
      "infection-prevention-concept": "microbiology:infection-prevention:"
    }[entryKind] || "";
  }

  function contentValueIsComplete(value) {
    if (typeof value === "string") return Boolean(normalizeWhitespace(value));
    if (Array.isArray(value)) return value.length > 0 && value.some(contentValueIsComplete);
    if (!isPlainObject(value)) return false;
    if (value.notApplicable === true) return nonEmptyText(value.reason);
    if (nonEmptyText(value.content) || nonEmptyText(value.text) || nonEmptyText(value.summary)) return true;
    return Object.values(value).some(contentValueIsComplete);
  }

  function branchForId(branchId) {
    return BROWSE_BRANCHES.find((branch) => branch.id === branchId) || null;
  }

  function relationshipRule(type) {
    return RELATIONSHIP_RULES.find((rule) => rule.id === type) || null;
  }

  function relationshipGroupForType(type) {
    return ORGANISM_RELATIONSHIP_GROUPS.find((group) => group.anyOf.includes(normalizeWhitespace(type))) || null;
  }

  function validateTargetReference(reference, path, issues, entryId) {
    const target = normalizeTargetReference(reference);
    if (!target) {
      issues.push(makeIssue("microbiology-invalid-target-reference", path, "A relationship target must be an object.", { entryId, value: reference }));
      return null;
    }
    if (!target.targetId && !(target.targetCollection && target.canonicalTitle)) {
      issues.push(makeIssue("microbiology-incomplete-target-reference", path, "A target requires a stable targetId or both targetCollection and canonicalTitle.", { entryId, value: reference }));
    }
    if (target.targetCollection && !RUNTIME_TARGET_COLLECTIONS.includes(target.targetCollection)) {
      issues.push(makeIssue("microbiology-invalid-target-collection", `${path}.targetCollection`, "The target collection is not one of ANI's canonical runtime collections.", { entryId, value: target.targetCollection }));
    }
    if (!target.targetKind || !TARGET_KINDS.includes(target.targetKind)) {
      issues.push(makeIssue("microbiology-invalid-target-kind", `${path}.targetKind`, "The relationship targetKind is missing or not registered.", { entryId, value: target.targetKind }));
    }
    return target;
  }

  function taxonomyForEntry(entry) {
    const source = sourceSpecForEntry(entry) || {};
    const metadata = isPlainObject(source.microbiology) ? source.microbiology : {};
    return source.taxonomy !== undefined ? source.taxonomy : metadata.taxonomy;
  }

  function validateOrganismTaxonomy(taxonomyInput, agentClass, issues, entryId, canonicalEntryName) {
    const path = "taxonomy";
    if (!isPlainObject(taxonomyInput)) {
      issues.push(makeIssue("microbiology-missing-organism-taxonomy", path, "Every organism entry requires a structured, reviewed taxonomy object.", { entryId, value: taxonomyInput, requiresMedicalReview: true }));
      return;
    }
    const taxonomy = taxonomyInput;
    const allowedKeys = new Set([...(TAXONOMY_CONTRACT.requiredFields || []), ...(TAXONOMY_CONTRACT.optionalFields || [])]);
    Object.keys(taxonomy).forEach((key) => {
      if (!allowedKeys.has(key)) issues.push(makeIssue("microbiology-unknown-taxonomy-field", `${path}.${key}`, "Organism taxonomy contains an unregistered field.", { entryId, value: taxonomy[key], requiresMedicalReview: true }));
    });
    const authority = normalizeWhitespace(taxonomy.authority);
    const authorityId = normalizeWhitespace(taxonomy.authorityId);
    const canonicalTaxonName = normalizeWhitespace(taxonomy.canonicalTaxonName);
    const rank = normalizeWhitespace(taxonomy.rank);
    const nomenclatureStatus = normalizeWhitespace(taxonomy.nomenclatureStatus);
    const reviewStatus = normalizeWhitespace(taxonomy.reviewStatus);
    if (!TAXONOMY_AUTHORITIES.includes(authority)) issues.push(makeIssue("microbiology-invalid-taxonomy-authority", `${path}.authority`, "Taxonomy authority must use the controlled authority registry.", { entryId, value: authority, requiresMedicalReview: true }));
    if (!TAXONOMIC_RANKS.includes(rank)) issues.push(makeIssue("microbiology-invalid-taxonomic-rank", `${path}.rank`, "Taxonomic rank must use the controlled rank registry.", { entryId, value: rank, requiresMedicalReview: true }));
    if (!canonicalTaxonName) issues.push(makeIssue("microbiology-missing-canonical-taxon-name", `${path}.canonicalTaxonName`, "Taxonomy requires the reviewed canonical taxon name.", { entryId, value: taxonomy.canonicalTaxonName, requiresMedicalReview: true }));
    if (canonicalTaxonName && canonicalEntryName && normalizeIdentity(canonicalTaxonName) !== normalizeIdentity(canonicalEntryName)) {
      issues.push(makeIssue("microbiology-taxonomy-entry-identity-mismatch", `${path}.canonicalTaxonName`, "The reviewed canonical taxon name must match the entry's canonical name; a common display label belongs in displayName or typed aliases.", { entryId, value: { entryName: canonicalEntryName, canonicalTaxonName }, requiresMedicalReview: true }));
    }
    if (!NOMENCLATURE_STATUSES.includes(nomenclatureStatus)) issues.push(makeIssue("microbiology-invalid-nomenclature-status", `${path}.nomenclatureStatus`, "Nomenclature status must use the controlled registry.", { entryId, value: nomenclatureStatus, requiresMedicalReview: true }));
    if (!TAXONOMY_REVIEW_STATUSES.includes(reviewStatus)) issues.push(makeIssue("microbiology-invalid-taxonomy-review-status", `${path}.reviewStatus`, "Taxonomy review status must use the controlled registry.", { entryId, value: reviewStatus, requiresMedicalReview: true }));
    if (!/^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(String(taxonomy.reviewedAt || ""))) issues.push(makeIssue("microbiology-invalid-taxonomy-reviewed-at", `${path}.reviewedAt`, "Taxonomy reviewedAt must be an ISO date or UTC timestamp.", { entryId, value: taxonomy.reviewedAt }));
    if (!/^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(String(taxonomy.reviewDueAt || ""))) issues.push(makeIssue("microbiology-invalid-taxonomy-review-due-at", `${path}.reviewDueAt`, "Taxonomy reviewDueAt must be an ISO date or UTC timestamp.", { entryId, value: taxonomy.reviewDueAt }));
    const reviewDueDate = String(taxonomy.reviewDueAt || "").slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(reviewDueDate) && reviewDueDate < today) issues.push(makeIssue("microbiology-taxonomy-review-overdue", `${path}.reviewDueAt`, "The reviewed taxonomy has reached its scheduled re-verification date.", { entryId, value: taxonomy.reviewDueAt, severity: "warning", blocking: false, requiresMedicalReview: true }));
    if (["ncbi-taxonomy", "ictv"].includes(authority) && !authorityId) issues.push(makeIssue("microbiology-missing-taxonomy-authority-id", `${path}.authorityId`, "NCBI and ICTV taxonomy records require a stable authority identifier.", { entryId, value: taxonomy.authorityId, requiresMedicalReview: true }));
    const allowedAuthorities = agentClass === "prion"
      ? ["reviewed-clinical-taxonomy", "not-applicable"]
      : agentClass === "virus"
        ? ["ictv", "ncbi-taxonomy", "reviewed-clinical-taxonomy"]
        : agentClass === "acellular-agent"
          ? TAXONOMY_AUTHORITIES
          : ["ncbi-taxonomy", "reviewed-clinical-taxonomy"];
    if (authority && !allowedAuthorities.includes(authority)) issues.push(makeIssue("microbiology-taxonomy-authority-agent-mismatch", `${path}.authority`, "The taxonomy authority is incompatible with this infectious-agent class.", { entryId, value: { agentClass, authority }, requiresMedicalReview: true }));
    if (authority === "not-applicable") {
      if (rank !== "not-applicable" || nomenclatureStatus !== "not-applicable" || reviewStatus !== "NOT_APPLICABLE" || authorityId) {
        issues.push(makeIssue("microbiology-invalid-not-applicable-taxonomy", path, "A not-applicable taxonomy must use the matching rank, nomenclature, and review states and must not invent an authority ID.", { entryId, value: taxonomy, requiresMedicalReview: true }));
      }
      if (Array.isArray(taxonomy.lineage) && taxonomy.lineage.length) issues.push(makeIssue("microbiology-not-applicable-taxonomy-lineage", `${path}.lineage`, "A not-applicable taxonomy cannot contain a biological lineage.", { entryId, value: taxonomy.lineage, requiresMedicalReview: true }));
      return;
    }
    if (rank === "unranked" && (!nonEmptyText(taxonomy.reviewNote) || reviewStatus !== "REVIEWED_UNRANKED")) issues.push(makeIssue("microbiology-unranked-taxonomy-review-required", path, "Unranked taxonomy requires REVIEWED_UNRANKED and an explanatory reviewNote.", { entryId, value: { reviewStatus, reviewNote: taxonomy.reviewNote }, requiresMedicalReview: true }));
    if (rank !== "unranked" && reviewStatus === "REVIEWED_UNRANKED") issues.push(makeIssue("microbiology-taxonomy-review-rank-mismatch", `${path}.reviewStatus`, "REVIEWED_UNRANKED is reserved for an explicitly unranked taxon.", { entryId, value: { rank, reviewStatus }, requiresMedicalReview: true }));
    if (!Array.isArray(taxonomy.lineage) || !taxonomy.lineage.length) {
      issues.push(makeIssue("microbiology-missing-taxonomic-lineage", `${path}.lineage`, "Reviewed organism taxonomy requires an ordered lineage.", { entryId, value: taxonomy.lineage, requiresMedicalReview: true }));
      return;
    }
    let previousRankIndex = -1;
    taxonomy.lineage.forEach((node, index) => {
      const nodePath = `${path}.lineage[${index}]`;
      if (!isPlainObject(node)) {
        issues.push(makeIssue("microbiology-invalid-taxonomy-lineage-node", nodePath, "Each lineage node must be an object with controlled rank and name.", { entryId, value: node, requiresMedicalReview: true }));
        return;
      }
      const unknownKeys = Object.keys(node).filter((key) => !TAXONOMY_CONTRACT.lineageNodeFields.includes(key));
      unknownKeys.forEach((key) => issues.push(makeIssue("microbiology-unknown-taxonomy-lineage-field", `${nodePath}.${key}`, "A lineage node contains an unregistered field.", { entryId, value: node[key], requiresMedicalReview: true })));
      const nodeRank = normalizeWhitespace(node.rank);
      const nodeName = normalizeWhitespace(node.name);
      const rankIndex = TAXONOMIC_RANKS.indexOf(nodeRank);
      if (rankIndex < 0 || nodeRank === "not-applicable") issues.push(makeIssue("microbiology-invalid-taxonomic-rank", `${nodePath}.rank`, "Lineage nodes require a registered biological rank.", { entryId, value: node.rank, requiresMedicalReview: true }));
      if (!nodeName) issues.push(makeIssue("microbiology-missing-taxonomy-lineage-name", `${nodePath}.name`, "Lineage nodes require a canonical taxon name.", { entryId, value: node.name, requiresMedicalReview: true }));
      if (rankIndex >= 0 && rankIndex < previousRankIndex) issues.push(makeIssue("microbiology-taxonomy-lineage-order", nodePath, "Taxonomic lineage must be ordered from broader to narrower ranks.", { entryId, value: taxonomy.lineage, requiresMedicalReview: true }));
      if (rankIndex >= 0) previousRankIndex = rankIndex;
    });
    if (rank === "strain") {
      const parentLineage = taxonomy.lineage.slice(0, -1);
      const hasSpeciesParent = parentLineage.some((node) => isPlainObject(node) && ["species", "subspecies"].includes(normalizeWhitespace(node.rank)));
      if (!hasSpeciesParent) issues.push(makeIssue("microbiology-strain-without-species-parent", `${path}.lineage`, "A strain must be nested beneath a reviewed species or subspecies identity.", { entryId, value: taxonomy.lineage, requiresMedicalReview: true }));
    }
    const terminal = taxonomy.lineage[taxonomy.lineage.length - 1];
    if (isPlainObject(terminal) && (normalizeWhitespace(terminal.rank) !== rank || normalizeIdentity(terminal.name) !== normalizeIdentity(canonicalTaxonName))) {
      issues.push(makeIssue("microbiology-taxonomy-terminal-mismatch", `${path}.lineage`, "The terminal lineage node must match the declared canonical taxon name and rank.", { entryId, value: { rank, canonicalTaxonName, terminal }, requiresMedicalReview: true }));
    }
    if (isPlainObject(terminal) && normalizeWhitespace(terminal.authorityId) !== authorityId) {
      issues.push(makeIssue("microbiology-taxonomy-authority-id-mismatch", `${path}.lineage`, "The terminal lineage authorityId must match the entry-level taxonomy authorityId so the card is bound to one reviewed taxon identity.", { entryId, value: { authorityId, terminalAuthorityId: terminal.authorityId }, requiresMedicalReview: true }));
    }
  }

  function controlledTraitDescriptor(value) {
    if (isPlainObject(value)) return { value: normalizeWhitespace(value.value).toLowerCase(), reason: normalizeWhitespace(value.reason), wrapped: true };
    return { value: normalizeWhitespace(value).toLowerCase(), reason: "", wrapped: false };
  }

  function validateOrganismTraits(traitsInput, agentClass, issues, entryId) {
    if (!isPlainObject(traitsInput)) {
      issues.push(makeIssue("microbiology-invalid-traits", "traits", "Organism traits must be a controlled object.", { entryId, value: traitsInput, requiresMedicalReview: true }));
      return;
    }
    const schema = AGENT_TRAIT_SCHEMAS[agentClass];
    if (!schema) return;
    const allowed = new Set(schema.required || []);
    Object.keys(traitsInput).forEach((field) => {
      if (allowed.has(field)) return;
      const code = agentClass === "virus" && ["gramReaction", "acidFast", "sporeForming", "oxygenRequirement", "cellWall", "cellMorphology"].includes(field)
        ? "microbiology-virus-cellular-trait"
        : agentClass === "prion"
          ? "microbiology-prion-incompatible-trait"
          : "microbiology-unregistered-organism-trait";
      issues.push(makeIssue(code, `traits.${field}`, "This trait is not registered for the organism's agent class; named media, toxins, vectors, virulence factors, and resistance mechanisms belong in typed relationships.", { entryId, value: traitsInput[field], requiresMedicalReview: true }));
    });
    (schema.required || []).forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(traitsInput, field)) {
        issues.push(makeIssue("microbiology-missing-required-organism-trait", `traits.${field}`, "The controlled trait profile requires this field.", { entryId, value: agentClass, requiresMedicalReview: true }));
        return;
      }
      const descriptor = controlledTraitDescriptor(traitsInput[field]);
      const registry = TRAIT_VALUE_REGISTRIES[field] || [];
      if (!registry.includes(descriptor.value)) issues.push(makeIssue("microbiology-invalid-organism-trait-value", `traits.${field}`, "The trait value is outside the controlled registry.", { entryId, value: traitsInput[field], requiresMedicalReview: true }));
      if (["unknown", "variable", "not-applicable"].includes(descriptor.value) && (!descriptor.wrapped || !descriptor.reason)) issues.push(makeIssue("microbiology-trait-reason-required", `traits.${field}`, "Unknown, variable, and not-applicable trait values require an explicit reason object.", { entryId, value: traitsInput[field], requiresMedicalReview: true }));
    });
    const traitValue = (field) => controlledTraitDescriptor(traitsInput[field]).value;
    if (["virus", "prion", "acellular-agent"].includes(agentClass) && traitValue("cellularity") !== "acellular") issues.push(makeIssue("microbiology-acellular-trait-required", "traits.cellularity", "Viruses, prions, and acellular agents must declare cellularity: acellular.", { entryId, value: traitsInput.cellularity, requiresMedicalReview: true }));
    if (["nematode", "cestode", "trematode", "ectoparasite"].includes(agentClass) && traitValue("cellularity") !== "multicellular") issues.push(makeIssue("microbiology-multicellular-trait-required", "traits.cellularity", "Helminths and ectoparasites must declare cellularity: multicellular.", { entryId, value: traitsInput.cellularity, requiresMedicalReview: true }));
    if (["bacterium", "protozoan"].includes(agentClass) && traitValue("cellularity") !== "cellular") issues.push(makeIssue("microbiology-cellular-trait-required", "traits.cellularity", "This agent class must declare cellularity: cellular.", { entryId, value: traitsInput.cellularity, requiresMedicalReview: true }));
    if (agentClass === "virus" && traitValue("intracellularBehavior") !== "obligate-intracellular") issues.push(makeIssue("microbiology-virus-intracellular-trait", "traits.intracellularBehavior", "Viruses require host cells for replication and must be classified as obligate intracellular agents.", { entryId, value: traitsInput.intracellularBehavior, requiresMedicalReview: true }));
  }

  function finiteNonnegativeNumber(value) {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
  }

  function validateOrganismEpidemiology(epidemiologyInput, issues, entryId) {
    if (!isPlainObject(epidemiologyInput)) {
      issues.push(makeIssue("microbiology-missing-organism-epidemiology", "epidemiology", "Every organism requires a structured epidemiology profile with an explicit incubation state.", { entryId, value: epidemiologyInput, requiresMedicalReview: true }));
      return;
    }
    const allowedEpidemiologyFields = new Set(ORGANISM_EPIDEMIOLOGY_CONTRACT.requiredFields);
    Object.keys(epidemiologyInput).forEach((field) => {
      if (!allowedEpidemiologyFields.has(field)) issues.push(makeIssue("microbiology-unknown-epidemiology-field", `epidemiology.${field}`, "The organism epidemiology profile contains an unregistered field.", { entryId, value: epidemiologyInput[field], requiresMedicalReview: true }));
    });
    const incubation = epidemiologyInput.incubation;
    if (!isPlainObject(incubation)) {
      issues.push(makeIssue("microbiology-missing-incubation-profile", "epidemiology.incubation", "Incubation must be a structured object; use an explicit unknown or not-applicable state when a reviewed interval cannot be supplied.", { entryId, value: incubation, requiresMedicalReview: true }));
      return;
    }
    const allowedIncubationFields = new Set(ORGANISM_EPIDEMIOLOGY_CONTRACT.incubationFields);
    Object.keys(incubation).forEach((field) => {
      if (!allowedIncubationFields.has(field)) issues.push(makeIssue("microbiology-unknown-incubation-field", `epidemiology.incubation.${field}`, "The incubation profile contains an unregistered field.", { entryId, value: incubation[field], requiresMedicalReview: true }));
    });
    const status = normalizeWhitespace(incubation.status).toLowerCase();
    const unit = normalizeWhitespace(incubation.unit).toLowerCase();
    if (!INCUBATION_STATUSES.includes(status)) issues.push(makeIssue("microbiology-invalid-incubation-status", "epidemiology.incubation.status", "Incubation status must use the controlled registry.", { entryId, value: incubation.status, requiresMedicalReview: true }));
    const numericFields = ["minimum", "maximum", "typical"];
    numericFields.forEach((field) => {
      if (incubation[field] !== undefined && !finiteNonnegativeNumber(incubation[field])) issues.push(makeIssue("microbiology-invalid-incubation-value", `epidemiology.incubation.${field}`, "Incubation duration values must be finite nonnegative numbers.", { entryId, value: incubation[field], requiresMedicalReview: true }));
    });
    const hasDuration = numericFields.some((field) => finiteNonnegativeNumber(incubation[field]));
    if (hasDuration && !INCUBATION_UNITS.includes(unit)) issues.push(makeIssue("microbiology-invalid-incubation-unit", "epidemiology.incubation.unit", "A numeric incubation duration requires a controlled unit.", { entryId, value: incubation.unit, requiresMedicalReview: true }));
    if (!hasDuration && unit) issues.push(makeIssue("microbiology-incubation-unit-without-duration", "epidemiology.incubation.unit", "An incubation unit cannot be supplied without a numeric duration.", { entryId, value: incubation.unit, requiresMedicalReview: true }));
    if (finiteNonnegativeNumber(incubation.minimum) && finiteNonnegativeNumber(incubation.maximum) && incubation.minimum > incubation.maximum) {
      issues.push(makeIssue("microbiology-incubation-range-order", "epidemiology.incubation", "Incubation minimum cannot exceed the maximum.", { entryId, value: { minimum: incubation.minimum, maximum: incubation.maximum }, requiresMedicalReview: true }));
    }
    if (status === "known" && !hasDuration) issues.push(makeIssue("microbiology-known-incubation-without-duration", "epidemiology.incubation", "A known incubation state requires a reviewed numeric range or typical duration.", { entryId, value: incubation, requiresMedicalReview: true }));
    if (["variable", "unknown", "not-applicable"].includes(status) && !nonEmptyText(incubation.reason)) {
      issues.push(makeIssue("microbiology-incubation-reason-required", "epidemiology.incubation.reason", "Variable, unknown, and not-applicable incubation states require an explicit reviewed reason.", { entryId, value: incubation.reason, requiresMedicalReview: true }));
    }
    if (!Array.isArray(incubation.sourceKeys) || !incubation.sourceKeys.length || incubation.sourceKeys.some((key) => !nonEmptyText(key))) {
      issues.push(makeIssue("microbiology-missing-incubation-sources", "epidemiology.incubation.sourceKeys", "The incubation profile requires reviewed source keys.", { entryId, value: incubation.sourceKeys, requiresMedicalReview: true }));
    }
  }

  function validateRelationshipCoverage(source, issues, entryId, catalogEntries) {
    const relationships = Array.isArray(source.relationships) ? source.relationships : [];
    const representedTypes = new Set(relationships.map((relationship) => normalizeWhitespace(relationship && relationship.type)).filter(Boolean));
    (Array.isArray(catalogEntries) ? catalogEntries : []).forEach((candidate) => {
      const candidateSource = sourceSpecForEntry(candidate) || {};
      if (normalizeWhitespace(candidateSource.id || candidate.id || candidate.directTargetId) === entryId) return;
      (Array.isArray(candidateSource.relationships) ? candidateSource.relationships : []).forEach((relationship) => {
        const type = normalizeWhitespace(relationship && relationship.type);
        const rule = relationshipRule(type);
        const target = normalizeTargetReference(relationship && relationship.target);
        if (!rule || rule.inverseIndex !== rule.id || !target || target.targetId !== entryId) return;
        representedTypes.add(type);
      });
    });
    const exemptions = source.relationshipNotApplicable;
    if (!Array.isArray(exemptions)) {
      issues.push(makeIssue("microbiology-invalid-relationship-not-applicable", "relationshipNotApplicable", "Organism relationship completeness requires an array of explicit group exemptions.", { entryId, value: exemptions, requiresMedicalReview: true }));
    }
    const exemptionGroups = new Set();
    (Array.isArray(exemptions) ? exemptions : []).forEach((exemption, index) => {
      const path = `relationshipNotApplicable[${index}]`;
      if (!isPlainObject(exemption)) {
        issues.push(makeIssue("microbiology-invalid-relationship-exemption", path, "A relationship-group exemption must be an object.", { entryId, value: exemption, requiresMedicalReview: true }));
        return;
      }
      const groupId = normalizeWhitespace(exemption.groupId);
      const group = ORGANISM_RELATIONSHIP_GROUPS.find((candidate) => candidate.id === groupId);
      if (!group) issues.push(makeIssue("microbiology-unknown-relationship-group", `${path}.groupId`, "The exemption names an unregistered organism relationship group.", { entryId, value: exemption.groupId, requiresMedicalReview: true }));
      if (exemptionGroups.has(groupId)) issues.push(makeIssue("microbiology-duplicate-relationship-exemption", path, "The relationship group is exempted more than once.", { entryId, value: groupId }));
      exemptionGroups.add(groupId);
      if (!nonEmptyText(exemption.reason)) issues.push(makeIssue("microbiology-relationship-exemption-reason-required", `${path}.reason`, "An explicit relationship-group exemption requires a reviewed reason.", { entryId, value: exemption.reason, requiresMedicalReview: true }));
      if (!Array.isArray(exemption.sourceKeys) || !exemption.sourceKeys.length || exemption.sourceKeys.some((key) => !nonEmptyText(key))) {
        issues.push(makeIssue("microbiology-missing-relationship-exemption-sources", `${path}.sourceKeys`, "An explicit relationship-group exemption requires reviewed source keys.", { entryId, value: exemption.sourceKeys, requiresMedicalReview: true }));
      }
      if (group && group.anyOf.some((type) => representedTypes.has(type))) {
        issues.push(makeIssue("microbiology-relationship-exemption-conflicts-with-edge", path, "A relationship group cannot be both represented and declared not applicable.", { entryId, value: { groupId, representedTypes: group.anyOf.filter((type) => representedTypes.has(type)) }, requiresMedicalReview: true }));
      }
    });
    ORGANISM_RELATIONSHIP_GROUPS.filter((group) => group.required).forEach((group) => {
      if (!group.anyOf.some((type) => representedTypes.has(type)) && !exemptionGroups.has(group.id)) {
        issues.push(makeIssue("microbiology-missing-organism-relationship-group", "relationships", "The organism lacks a required relationship group and has no reviewed not-applicable declaration.", { entryId, value: { groupId: group.id, acceptedRelationshipTypes: group.anyOf }, requiresMedicalReview: true }));
      }
    });
  }

  function validateEntry(entry, options) {
    const issues = [];
    const source = sourceSpecForEntry(entry);
    if (!isPlainObject(source)) return validationResult([makeIssue("microbiology-invalid-entry", "entry", "A Microbiology entry must be an object.", { value: entry })]);
    const entryId = normalizeWhitespace(source.id || source.directTargetId || source.cardId);
    const name = normalizeWhitespace(source.name || source.title || source.displayName);
    const kind = entryKindForRecord(source);
    const classification = classificationForEntry(source);
    if (!entryId) issues.push(makeIssue("microbiology-missing-entry-id", "id", "The entry requires a stable canonical ID."));
    if (!name) issues.push(makeIssue("microbiology-missing-entry-name", "name", "The entry requires a canonical name.", { entryId }));
    if (!ENTRY_KINDS.includes(kind)) issues.push(makeIssue("microbiology-invalid-entry-kind", "entryKind", "The entryKind is not registered in the canonical architecture.", { entryId, value: kind }));
    const prefix = expectedIdPrefix(kind);
    if (entryId && (!prefix || !entryId.startsWith(prefix) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entryId.slice(prefix.length)))) {
      issues.push(makeIssue("microbiology-malformed-entry-id", "id", "The entry ID must use its canonical kind prefix followed by a lowercase slug.", { entryId, value: entryId }));
    }

    const classRules = {
      organism: ["agentClass", AGENT_CLASSES],
      "microbiology-concept": ["conceptClass", CONCEPT_CLASSES],
      "microbiology-method": ["methodClass", METHOD_CLASSES],
      "culture-medium": ["mediumClass", MEDIUM_CLASSES],
      "infection-prevention-concept": ["ipcClass", IPC_CLASSES]
    };
    if (classRules[kind]) {
      const [field, registry] = classRules[kind];
      if (!classification[field] || !registry.includes(classification[field])) {
        issues.push(makeIssue("microbiology-invalid-classification", field, `The ${field} is missing or not registered for ${kind}.`, { entryId, value: classification[field] }));
      }
    }
    if (["parasite", "helminth"].includes(classification.agentClass)) {
      issues.push(makeIssue("microbiology-parasite-aggregate-leaf", "agentClass", "Parasite and helminth are browse aggregates; organism entries must use protozoan, nematode, cestode, trematode, or ectoparasite.", { entryId, value: classification.agentClass, requiresMedicalReview: true }));
    }

    const browsePath = normalizeWhitespace(source.browsePath || (source.microbiology && source.microbiology.browsePath));
    const branch = branchForId(browsePath);
    if (!branch) issues.push(makeIssue("microbiology-invalid-browse-path", "browsePath", "The entry browsePath is not registered.", { entryId, value: browsePath }));
    else if (branch.selectable === false || ["pillar", "aggregate", "federated-gateway"].includes(branch.kind)) {
      issues.push(makeIssue("microbiology-invalid-browse-leaf", "browsePath", "Authored Microbiology entries must belong to a selectable owned leaf, not a pillar, aggregate, or gateway.", { entryId, value: browsePath }));
    } else {
      const compatible = (kind === "organism" && Array.isArray(branch.agentClasses) && branch.agentClasses.includes(classification.agentClass))
        || (kind === "microbiology-concept" && Array.isArray(branch.conceptClasses) && branch.conceptClasses.includes(classification.conceptClass))
        || (kind === "microbiology-method" && Array.isArray(branch.methodClasses) && branch.methodClasses.includes(classification.methodClass))
        || (kind === "culture-medium" && Array.isArray(branch.entryKinds) && branch.entryKinds.includes(kind) && Array.isArray(branch.mediumClasses) && branch.mediumClasses.includes(classification.mediumClass))
        || (kind === "infection-prevention-concept" && Array.isArray(branch.ipcClasses) && branch.ipcClasses.includes(classification.ipcClass));
      if (!compatible) issues.push(makeIssue("microbiology-browse-classification-mismatch", "browsePath", "The browse leaf does not accept this entry's canonical classification.", { entryId, value: { browsePath, classification }, requiresMedicalReview: true }));
    }

    if (!Array.isArray(source.aliases)) issues.push(makeIssue("microbiology-invalid-alias-array", "aliases", "aliases must be an array of typed identity aliases.", { entryId, value: source.aliases }));
    const aliasKeys = new Set();
    (Array.isArray(source.aliases) ? source.aliases : []).forEach((alias, index) => {
      const aliasPath = `aliases[${index}]`;
      if (!isPlainObject(alias) || !nonEmptyText(alias.value) || !nonEmptyText(alias.kind)) {
        issues.push(makeIssue("microbiology-invalid-alias", aliasPath, "Each alias requires value, kind, and identity metadata.", { entryId, value: alias }));
        return;
      }
      if (!ALIAS_KINDS.includes(alias.kind)) {
        const code = FORBIDDEN_ALIAS_KINDS.includes(alias.kind) ? "microbiology-alias-is-related-concept" : "microbiology-invalid-alias-kind";
        issues.push(makeIssue(code, `${aliasPath}.kind`, "Aliases are identity-only; diseases, drugs, toxins, media, phenotypes, and related topics must use typed relationships.", { entryId, value: alias.kind, requiresMedicalReview: true }));
      }
      if (alias.identity !== true) issues.push(makeIssue("microbiology-alias-not-identity", `${aliasPath}.identity`, "Every alias must explicitly declare identity: true.", { entryId, value: alias.identity }));
      const key = normalizeIdentity(alias.value);
      if (aliasKeys.has(key)) issues.push(makeIssue("microbiology-duplicate-alias", aliasPath, "The entry repeats an equivalent alias.", { entryId, value: alias.value }));
      aliasKeys.add(key);
      if (key && key === normalizeIdentity(name)) issues.push(makeIssue("microbiology-alias-duplicates-canonical-name", aliasPath, "An alias must not duplicate the canonical name.", { entryId, value: alias.value }));
      if (key === "normal flora" && classification.conceptClass !== "normal-human-microbiota") {
        issues.push(makeIssue("microbiology-normal-flora-ownership", aliasPath, "Normal flora is an identity alias only for Normal human microbiota, never for microbiome or another topic.", { entryId, value: alias.value, requiresMedicalReview: true }));
      }
    });
    const reservedConceptIdentities = new Map([
      ["microbiota", "microbiota"],
      ["microbiome", "microbiome"],
      ["normal human microbiota", "normal-human-microbiota"]
    ]);
    reservedConceptIdentities.forEach((ownerClass, identity) => {
      if (aliasKeys.has(identity) && classification.conceptClass !== ownerClass) {
        issues.push(makeIssue("microbiology-concept-identity-merge", "aliases", "Microbiota, microbiome, and normal human microbiota are distinct canonical concepts and cannot be identity aliases of one another.", { entryId, value: { identity, ownerClass, actualClass: classification.conceptClass }, requiresMedicalReview: true }));
      }
    });
    const canonicalConceptOwner = reservedConceptIdentities.get(normalizeIdentity(name));
    if (canonicalConceptOwner && classification.conceptClass !== canonicalConceptOwner) issues.push(makeIssue("microbiology-concept-canonical-ownership", "name", "This reserved concept name is assigned to the wrong canonical concept class.", { entryId, value: { name, expectedClass: canonicalConceptOwner, actualClass: classification.conceptClass }, requiresMedicalReview: true }));
    if (normalizeIdentity(name) === "normal flora") issues.push(makeIssue("microbiology-normal-flora-canonical-name", "name", "Normal flora is a historical alias; the canonical concept is Normal human microbiota.", { entryId, value: name, requiresMedicalReview: true }));
    if (classification.conceptClass === "microbiome" && aliasKeys.has("normal flora")) issues.push(makeIssue("microbiology-normal-flora-microbiome-merge", "aliases", "Normal flora must not be merged with microbiome.", { entryId, requiresMedicalReview: true }));
    if (classification.conceptClass === "normal-human-microbiota" && !aliasKeys.has("normal flora")) {
      issues.push(makeIssue("microbiology-normal-flora-alias-required", "aliases", "Normal human microbiota must preserve Normal flora as its reviewed historical/common identity alias.", { entryId, requiresMedicalReview: true }));
    }

    if (source.searchTerms !== undefined && !Array.isArray(source.searchTerms)) issues.push(makeIssue("microbiology-invalid-search-terms", "searchTerms", "searchTerms must be an array.", { entryId, value: source.searchTerms }));
    const groups = isPlainObject(source.contentGroups) ? source.contentGroups : {};
    if (!isPlainObject(source.contentGroups)) issues.push(makeIssue("microbiology-invalid-content-groups", "contentGroups", "contentGroups must be an object keyed by the canonical content-group IDs.", { entryId, value: source.contentGroups }));
    (REQUIRED_CONTENT_GROUPS[kind] || []).filter((group) => group.required).forEach((group) => {
      if (!contentValueIsComplete(groups[group.id])) issues.push(makeIssue("microbiology-missing-required-content", `contentGroups.${group.id}`, `The required ${group.title} content group is missing or incomplete.`, { entryId, requiresMedicalReview: true }));
    });

    if (!Array.isArray(source.sourceKeys) || !source.sourceKeys.length || source.sourceKeys.some((key) => !nonEmptyText(key))) {
      issues.push(makeIssue("microbiology-missing-source-keys", "sourceKeys", "Every authored entry requires one or more reviewed source keys.", { entryId, value: source.sourceKeys, requiresMedicalReview: true }));
    }
    if (source.reviewStatus !== "REVIEWED") issues.push(makeIssue("microbiology-entry-not-reviewed", "reviewStatus", "Production Microbiology entries must be explicitly REVIEWED.", { entryId, value: source.reviewStatus, requiresMedicalReview: true }));
    if (!nonEmptyText(source.reviewedAt)) issues.push(makeIssue("microbiology-missing-reviewed-at", "reviewedAt", "Every reviewed production entry requires an explicit review date.", { entryId, value: source.reviewedAt, requiresMedicalReview: true }));
    else if (!/^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(String(source.reviewedAt))) issues.push(makeIssue("microbiology-invalid-reviewed-at", "reviewedAt", "reviewedAt must be an ISO date or UTC timestamp.", { entryId, value: source.reviewedAt }));

    if (kind === "organism") {
      validateOrganismTaxonomy(taxonomyForEntry(source), classification.agentClass, issues, entryId, name);
      validateOrganismTraits(source.traits, classification.agentClass, issues, entryId);
      validateOrganismEpidemiology(source.epidemiology, issues, entryId);
    } else {
      if (source.taxonomy !== undefined) issues.push(makeIssue("microbiology-taxonomy-on-nonorganism", "taxonomy", "Biological organism taxonomy is reserved for organism entries.", { entryId, value: source.taxonomy, requiresMedicalReview: true }));
      if (source.traits !== undefined) issues.push(makeIssue("microbiology-traits-on-nonorganism", "traits", "Controlled organism traits are reserved for organism entries; other facts belong in profile content or typed relationships.", { entryId, value: source.traits, requiresMedicalReview: true }));
      if (source.epidemiology !== undefined) issues.push(makeIssue("microbiology-epidemiology-on-nonorganism", "epidemiology", "Structured organism epidemiology is reserved for organism entries.", { entryId, value: source.epidemiology, requiresMedicalReview: true }));
      if (source.relationshipNotApplicable !== undefined) issues.push(makeIssue("microbiology-relationship-exemptions-on-nonorganism", "relationshipNotApplicable", "Organism relationship-group exemptions are reserved for organism entries.", { entryId, value: source.relationshipNotApplicable, requiresMedicalReview: true }));
    }

    const catalogEntries = Array.isArray(options && options.catalogEntries) ? options.catalogEntries : [];
    const entryById = new Map(catalogEntries.map((candidate) => {
      const spec = sourceSpecForEntry(candidate) || {};
      return [normalizeWhitespace(spec.id || candidate.id || candidate.directTargetId), candidate];
    }).filter(([id]) => id));
    if (!Array.isArray(source.relationships)) issues.push(makeIssue("microbiology-invalid-relationships", "relationships", "relationships must be an array of typed edges.", { entryId, value: source.relationships }));
    const relationKeys = new Set();
    (Array.isArray(source.relationships) ? source.relationships : []).forEach((relationship, index) => {
      const relationPath = `relationships[${index}]`;
      if (!isPlainObject(relationship)) {
        issues.push(makeIssue("microbiology-invalid-relationship", relationPath, "Each relationship must be an object.", { entryId, value: relationship }));
        return;
      }
      const rule = relationshipRule(normalizeWhitespace(relationship.type));
      if (!rule) {
        issues.push(makeIssue("microbiology-unknown-relationship-type", `${relationPath}.type`, "The relationship type is not registered.", { entryId, value: relationship.type, requiresMedicalReview: true }));
        return;
      }
      const target = validateTargetReference(relationship.target, `${relationPath}.target`, issues, entryId);
      if (!target) return;
      const sourceLineage = entityKindLineage(source);
      let targetLineage = entityKindLineage(target.targetKind);
      if (target.targetId && entryById.has(target.targetId)) {
        const internal = entryById.get(target.targetId);
        targetLineage = entityKindLineage(internal);
        if (!targetLineage.includes(target.targetKind)) issues.push(makeIssue("microbiology-invalid-relationship-domain-range", `${relationPath}.target.targetKind`, "The targetKind does not match the internal Microbiology destination.", { entryId, value: { declared: target.targetKind, actual: targetLineage }, requiresMedicalReview: true }));
      } else if (target.targetId && target.targetId.startsWith("microbiology:")) {
        issues.push(makeIssue("microbiology-broken-internal-target", `${relationPath}.target.targetId`, "The internal Microbiology target ID does not exist in the source catalog.", { entryId, value: target.targetId }));
      }
      const sourceAllowed = rule.domain.some((domainKind) => sourceLineage.includes(domainKind));
      const targetAllowed = rule.range.some((rangeKind) => targetLineage.includes(rangeKind));
      if (!sourceAllowed || !targetAllowed) issues.push(makeIssue("microbiology-invalid-relationship-domain-range", relationPath, "The relationship source or target is outside the registered domain/range contract.", { entryId, value: { type: rule.id, sourceLineage, targetLineage, allowedDomain: rule.domain, allowedRange: rule.range }, requiresMedicalReview: true }));
      if (Array.isArray(rule.contextRequired)) {
        const context = isPlainObject(relationship.context) ? relationship.context : {};
        const missing = rule.contextRequired.filter((field) => !nonEmptyText(context[field]));
        if (missing.length) issues.push(makeIssue(rule.contextIssueCode || "microbiology-missing-relationship-context", `${relationPath}.context`, rule.contextMessage || "The relationship is missing required reviewed context.", { entryId, value: { missing }, requiresMedicalReview: true }));
      }
      if (!Array.isArray(relationship.sourceKeys) || !relationship.sourceKeys.length || relationship.sourceKeys.some((key) => !nonEmptyText(key))) {
        issues.push(makeIssue("microbiology-missing-relationship-sources", `${relationPath}.sourceKeys`, "Every authored relationship requires one or more reviewed source keys specific to that edge.", { entryId, value: relationship.sourceKeys, requiresMedicalReview: true }));
      }
      const relationKey = `${rule.id}::${targetReferenceKey(target)}::${stableStringify(relationship.context || {})}`;
      if (relationKeys.has(relationKey)) issues.push(makeIssue("microbiology-duplicate-relationship", relationPath, "The entry repeats the same typed relationship and context.", { entryId, value: relationKey }));
      relationKeys.add(relationKey);
    });
    if (kind === "organism") validateRelationshipCoverage(source, issues, entryId, catalogEntries);
    return validationResult(issues);
  }

  function validateMembership(membership, options) {
    const issues = [];
    const record = isPlainObject(membership) ? membership : {};
    const path = options && options.path || "membership";
    if (!isPlainObject(membership)) return validationResult([makeIssue("microbiology-invalid-membership", path, "A gateway membership must be an object.", { value: membership })]);
    if (!/^microbiology:membership:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizeWhitespace(record.id))) issues.push(makeIssue("microbiology-malformed-membership-id", `${path}.id`, "Membership IDs must use microbiology:membership:<slug>.", { value: record.id }));
    if (!GATEWAY_BRANCH_IDS.includes(record.gateway)) issues.push(makeIssue("microbiology-invalid-gateway", `${path}.gateway`, "The membership gateway is not registered.", { value: record.gateway }));
    const target = validateTargetReference(record.target, `${path}.target`, issues, record.id);
    const branch = branchForId(record.gateway);
    if (target && branch && Array.isArray(branch.targetKinds) && !branch.targetKinds.includes(target.targetKind)) issues.push(makeIssue("microbiology-invalid-gateway-target", `${path}.target.targetKind`, "The target kind does not belong in this federated gateway.", { value: { gateway: record.gateway, targetKind: target.targetKind }, requiresMedicalReview: true }));
    if (!Array.isArray(record.sourceKeys) || !record.sourceKeys.length || record.sourceKeys.some((key) => !nonEmptyText(key))) issues.push(makeIssue("microbiology-missing-membership-sources", `${path}.sourceKeys`, "Gateway memberships require reviewed source keys.", { value: record.sourceKeys, requiresMedicalReview: true }));
    return validationResult(issues);
  }

  function validateCatalog(catalogInput, options) {
    const issues = [];
    const envelope = Array.isArray(catalogInput) ? null : catalogInput;
    if (!Array.isArray(catalogInput) && !isPlainObject(catalogInput)) {
      return validationResult([makeIssue("microbiology-invalid-catalog-envelope", "catalog", "The Microbiology catalog must be an object or an entry array.", { value: catalogInput, systemic: true })]);
    }
    const entries = Array.isArray(catalogInput) ? catalogInput : catalogInput.entries;
    const memberships = Array.isArray(catalogInput) ? [] : catalogInput.memberships;
    const sourceReferences = Array.isArray(catalogInput) ? [] : catalogInput.sourceReferences;
    if (envelope) {
      const expectedVersions = {
        schemaVersion: SCHEMA_VERSION,
        architectureVersion: ARCHITECTURE_VERSION,
        taxonomyVersion: TAXONOMY_VERSION,
        relationshipSchemaVersion: RELATIONSHIP_SCHEMA_VERSION,
        generatorVersion: GENERATOR_VERSION
      };
      Object.keys(expectedVersions).forEach((field) => {
        if (envelope[field] !== expectedVersions[field]) issues.push(makeIssue("microbiology-invalid-catalog-version", field, `Expected ${expectedVersions[field]}.`, { value: envelope[field], systemic: true }));
      });
      if (envelope.architectureSha256 !== architectureSha256()) issues.push(makeIssue("microbiology-architecture-source-drift", "architectureSha256", "The source catalog is not pinned to the current canonical architecture fingerprint.", { value: { expected: architectureSha256(), actual: envelope.architectureSha256 }, systemic: true }));
      if (!nonEmptyText(envelope.catalogVersion)) issues.push(makeIssue("microbiology-missing-catalog-version", "catalogVersion", "The source catalog requires a catalogVersion.", { value: envelope.catalogVersion, systemic: true }));
    }
    if (!Array.isArray(entries)) issues.push(makeIssue("microbiology-invalid-catalog-entries", "entries", "entries must be an array.", { value: entries, systemic: true }));
    if (!Array.isArray(memberships)) issues.push(makeIssue("microbiology-invalid-catalog-memberships", "memberships", "memberships must be an array.", { value: memberships, systemic: true }));
    if (!Array.isArray(sourceReferences)) issues.push(makeIssue("microbiology-invalid-source-references", "sourceReferences", "sourceReferences must be an array.", { value: sourceReferences, systemic: true }));
    const safeEntries = Array.isArray(entries) ? entries : [];
    const safeMemberships = Array.isArray(memberships) ? memberships : [];
    const safeSources = Array.isArray(sourceReferences) ? sourceReferences : [];
    const approval = options && options.approval ? options.approval : {};
    issues.push(...validateApproval(approval, { hasContent: safeEntries.length > 0 || safeMemberships.length > 0 }).issues);

    const sourceKeySet = new Set();
    safeSources.forEach((source, index) => {
      const sourcePath = `sourceReferences[${index}]`;
      if (!isPlainObject(source) || !nonEmptyText(source.key) || !nonEmptyText(source.title)) {
        issues.push(makeIssue("microbiology-invalid-source-reference", sourcePath, "Each source reference requires a stable key and title.", { value: source, requiresMedicalReview: true }));
        return;
      }
      const key = normalizeWhitespace(source.key);
      if (sourceKeySet.has(key)) issues.push(makeIssue("microbiology-duplicate-source-key", `${sourcePath}.key`, "The source key is duplicated.", { value: key }));
      sourceKeySet.add(key);
      if (source.url !== undefined && !/^https:\/\//i.test(normalizeWhitespace(source.url))) issues.push(makeIssue("microbiology-invalid-source-url", `${sourcePath}.url`, "Source URLs must use HTTPS.", { value: source.url }));
    });

    const idMap = new Map();
    const nameMap = new Map();
    const aliasMap = new Map();
    const taxonIdentityMap = new Map();
    safeEntries.forEach((entry, index) => {
      const source = sourceSpecForEntry(entry) || {};
      const id = normalizeWhitespace(source.id || entry.id || entry.directTargetId);
      const name = normalizeWhitespace(source.name || source.title || entry.name || entry.title);
      const result = validateEntry(entry, { catalogEntries: safeEntries });
      result.issues.forEach((issue) => issues.push({ ...issue, entryId: issue.entryId || id, path: issue.path ? `entries[${index}].${issue.path}` : `entries[${index}]` }));
      if (id) {
        if (idMap.has(id)) issues.push(makeIssue("microbiology-duplicate-entry-id", `entries[${index}].id`, "Two Microbiology entries share the same stable ID.", { entryId: id, value: { firstIndex: idMap.get(id), duplicateIndex: index } }));
        else idMap.set(id, index);
      }
      const nameKey = normalizeIdentity(name);
      if (nameKey) {
        if (nameMap.has(nameKey)) issues.push(makeIssue("microbiology-duplicate-canonical-name", `entries[${index}].name`, "Two Microbiology entries share an equivalent canonical name.", { entryId: id, value: name }));
        else nameMap.set(nameKey, id || String(index));
      }
      (Array.isArray(source.aliases) ? source.aliases : []).forEach((alias) => {
        const key = normalizeIdentity(alias && alias.value);
        if (!key) return;
        if (!aliasMap.has(key)) aliasMap.set(key, []);
        aliasMap.get(key).push(id || String(index));
      });
      (Array.isArray(source.sourceKeys) ? source.sourceKeys : []).forEach((key) => {
        if (!sourceKeySet.has(normalizeWhitespace(key))) issues.push(makeIssue("microbiology-unresolved-source-key", `entries[${index}].sourceKeys`, "The entry references a source key that is absent from sourceReferences.", { entryId: id, value: key, requiresMedicalReview: true }));
      });
      (Array.isArray(source.relationships) ? source.relationships : []).forEach((relationship, relationIndex) => {
        (Array.isArray(relationship && relationship.sourceKeys) ? relationship.sourceKeys : []).forEach((key) => {
          if (!sourceKeySet.has(normalizeWhitespace(key))) issues.push(makeIssue("microbiology-unresolved-source-key", `entries[${index}].relationships[${relationIndex}].sourceKeys`, "The relationship references a source key that is absent from sourceReferences.", { entryId: id, value: key, requiresMedicalReview: true }));
        });
      });
      const incubation = isPlainObject(source.epidemiology) && isPlainObject(source.epidemiology.incubation)
        ? source.epidemiology.incubation
        : null;
      (Array.isArray(incubation && incubation.sourceKeys) ? incubation.sourceKeys : []).forEach((key) => {
        if (!sourceKeySet.has(normalizeWhitespace(key))) issues.push(makeIssue("microbiology-unresolved-source-key", `entries[${index}].epidemiology.incubation.sourceKeys`, "The incubation profile references a source key that is absent from sourceReferences.", { entryId: id, value: key, requiresMedicalReview: true }));
      });
      (Array.isArray(source.relationshipNotApplicable) ? source.relationshipNotApplicable : []).forEach((exemption, exemptionIndex) => {
        (Array.isArray(exemption && exemption.sourceKeys) ? exemption.sourceKeys : []).forEach((key) => {
          if (!sourceKeySet.has(normalizeWhitespace(key))) issues.push(makeIssue("microbiology-unresolved-source-key", `entries[${index}].relationshipNotApplicable[${exemptionIndex}].sourceKeys`, "The relationship-group exemption references a source key that is absent from sourceReferences.", { entryId: id, value: key, requiresMedicalReview: true }));
        });
      });
      const taxonomy = taxonomyForEntry(source);
      if (entryKindForRecord(source) === "organism" && isPlainObject(taxonomy) && normalizeWhitespace(taxonomy.authority) !== "not-applicable") {
        const authority = normalizeIdentity(taxonomy.authority);
        const authorityId = normalizeIdentity(taxonomy.authorityId);
        const identityKey = authorityId
          ? `${authority}::id:${authorityId}`
          : `${authority}::rank:${normalizeIdentity(taxonomy.rank)}::name:${normalizeIdentity(taxonomy.canonicalTaxonName)}`;
        if (taxonIdentityMap.has(identityKey)) {
          const first = taxonIdentityMap.get(identityKey);
          const strainIdentity = normalizeWhitespace(taxonomy.rank) === "strain" || first.rank === "strain";
          issues.push(makeIssue(strainIdentity ? "microbiology-duplicate-strain-identity" : "microbiology-duplicate-organism-taxonomy-identity", `entries[${index}].taxonomy`, "Two organism cards bind to the same canonical taxonomy identity.", { entryId: id, value: { identityKey, firstEntryId: first.entryId, duplicateEntryId: id }, requiresMedicalReview: true, systemic: true }));
        } else {
          taxonIdentityMap.set(identityKey, { entryId: id, rank: normalizeWhitespace(taxonomy.rank) });
        }
      }
    });
    aliasMap.forEach((ids, aliasKey) => {
      const uniqueIds = Array.from(new Set(ids));
      if (uniqueIds.length > 1) issues.push(makeIssue("microbiology-ambiguous-alias", "entries.aliases", "One identity alias belongs to multiple canonical Microbiology entries.", { value: { alias: aliasKey, entryIds: uniqueIds }, requiresMedicalReview: true, systemic: true }));
      if (nameMap.has(aliasKey) && !uniqueIds.includes(nameMap.get(aliasKey))) issues.push(makeIssue("microbiology-alias-canonical-collision", "entries.aliases", "An identity alias collides with a different canonical entry name.", { value: { alias: aliasKey, aliasEntryIds: uniqueIds, canonicalEntryId: nameMap.get(aliasKey) }, requiresMedicalReview: true }));
    });

    const membershipIds = new Set();
    const membershipTargets = new Set();
    safeMemberships.forEach((membership, index) => {
      const result = validateMembership(membership, { path: `memberships[${index}]` });
      issues.push(...result.issues);
      const id = normalizeWhitespace(membership && membership.id);
      if (id && membershipIds.has(id)) issues.push(makeIssue("microbiology-duplicate-membership-id", `memberships[${index}].id`, "The gateway membership ID is duplicated.", { value: id }));
      membershipIds.add(id);
      const targetKey = targetReferenceKey(membership && membership.target);
      const membershipKey = `${membership && membership.gateway}::${targetKey}`;
      if (targetKey && membershipTargets.has(membershipKey)) issues.push(makeIssue("microbiology-duplicate-gateway-membership", `memberships[${index}]`, "The same canonical destination is repeated in one gateway.", { value: membershipKey }));
      membershipTargets.add(membershipKey);
      (Array.isArray(membership && membership.sourceKeys) ? membership.sourceKeys : []).forEach((key) => {
        if (!sourceKeySet.has(normalizeWhitespace(key))) issues.push(makeIssue("microbiology-unresolved-source-key", `memberships[${index}].sourceKeys`, "The gateway membership references a missing source key.", { value: key, requiresMedicalReview: true }));
      });
    });
    return validationResult(issues);
  }

  function assertValidCatalog(catalog, options) {
    const result = validateCatalog(catalog, options);
    if (!result.valid) {
      const error = new Error(`ANI Microbiology validation failed with ${result.errors.length} blocking issue(s).`);
      error.code = "ani_microbiology_validation_failed";
      error.issues = result.issues;
      throw error;
    }
    return result;
  }

  function normalizeRelationship(relationship) {
    const output = {
      type: normalizeWhitespace(relationship.type),
      target: normalizeTargetReference(relationship.target)
    };
    if (isPlainObject(relationship.context) && Object.keys(relationship.context).length) output.context = cloneJson(relationship.context);
    if (Array.isArray(relationship.sourceKeys) && relationship.sourceKeys.length) output.sourceKeys = uniqueSorted(relationship.sourceKeys.map(normalizeWhitespace).filter(Boolean), normalizeIdentity);
    return output;
  }

  function relationshipIdentityMaterial(relationship) {
    const normalized = normalizeRelationship(isPlainObject(relationship) ? relationship : {});
    return stableStringify({
      type: normalized.type,
      target: normalized.target,
      context: isPlainObject(normalized.context) ? normalized.context : {}
    });
  }

  function relationshipIdentitySha256(relationship) {
    return sha256(relationshipIdentityMaterial(relationship));
  }

  function contentSectionValue(value) {
    if (isPlainObject(value) && Object.prototype.hasOwnProperty.call(value, "content")) return cloneJson(value.content);
    return cloneJson(value);
  }

  function buildEntry(entry, options) {
    const source = cloneJson(sourceSpecForEntry(entry));
    const validation = validateEntry(source, options && options.validationOptions);
    if (!validation.valid) {
      const error = new Error(`Cannot build invalid Microbiology entry: ${validation.errors.map((issue) => issue.code).join(", ")}`);
      error.code = "ani_microbiology_validation_failed";
      error.issues = validation.issues;
      throw error;
    }
    const classification = classificationForEntry(source);
    const kind = entryKindForRecord(source);
    const branch = branchForId(source.browsePath) || { id: source.browsePath, label: source.browsePath };
    const typedAliases = (Array.isArray(source.aliases) ? source.aliases : []).map((alias) => ({
      value: normalizeWhitespace(alias.value),
      kind: normalizeWhitespace(alias.kind),
      identity: alias.identity === true
    })).sort((left, right) => ordinalCompare(`${normalizeIdentity(left.value)}::${left.kind}`, `${normalizeIdentity(right.value)}::${right.kind}`));
    const relationships = (Array.isArray(source.relationships) ? source.relationships : []).map(normalizeRelationship)
      .sort((left, right) => ordinalCompare(`${left.type}::${targetReferenceKey(left.target)}::${stableStringify(left.context || {})}`, `${right.type}::${targetReferenceKey(right.target)}::${stableStringify(right.context || {})}`));
    const relationshipNotApplicable = (Array.isArray(source.relationshipNotApplicable) ? source.relationshipNotApplicable : [])
      .map((item) => ({
        groupId: normalizeWhitespace(item.groupId),
        reason: normalizeWhitespace(item.reason),
        sourceKeys: uniqueSorted(item.sourceKeys || [], normalizeIdentity)
      }))
      .sort((left, right) => ordinalCompare(left.groupId, right.groupId));
    const configuredGroups = REQUIRED_CONTENT_GROUPS[kind] || [];
    const groupById = new Map(configuredGroups.map((group) => [group.id, group]));
    const orderedGroupIds = configuredGroups.map((group) => group.id).concat(
      Object.keys(source.contentGroups || {}).filter((id) => !groupById.has(id)).sort(ordinalCompare)
    );
    const sections = orderedGroupIds.filter((id) => Object.prototype.hasOwnProperty.call(source.contentGroups || {}, id)).map((id) => ({
      id,
      title: groupById.has(id) ? groupById.get(id).title : normalizeWhitespace(id.replace(/-/g, " ")).replace(/\b\w/g, (letter) => letter.toUpperCase()),
      content: contentSectionValue(source.contentGroups[id])
    }));
    const aliasValues = typedAliases.map((alias) => alias.value);
    const searchTerms = uniqueSorted([
      source.name,
      source.displayName,
      ...aliasValues,
      ...(Array.isArray(source.searchTerms) ? source.searchTerms : [])
    ].map(normalizeWhitespace).filter(Boolean), normalizeIdentity);
    const classificationOutput = Object.fromEntries(Object.entries(classification).filter(([, value]) => value));
    const definition = normalizeWhitespace(
      contentSectionValue(source.contentGroups && source.contentGroups.definition)
      || (sections[0] && sections[0].content)
    );
    return {
      id: source.id,
      directTargetId: source.id,
      name: normalizeWhitespace(source.displayName || source.name),
      canonicalName: normalizeWhitespace(source.name),
      ...(source.displayName ? { displayName: normalizeWhitespace(source.displayName) } : {}),
      type: "microbiology",
      category: `Microbiology / ${normalizeWhitespace(branch.label || source.browsePath)}`,
      summary: definition,
      definition,
      microbiologyKind: kind,
      encyclopediaSection: "microbiology",
      encyclopediaDomains: ["microbiology"],
      primaryDomain: "Microbiology",
      aliases: aliasValues,
      typedAliases,
      abbreviations: typedAliases.filter((alias) => alias.kind === "abbreviation").map((alias) => alias.value),
      commonMisspellings: typedAliases.filter((alias) => alias.kind === "common-misspelling").map((alias) => alias.value),
      searchTerms,
      sections,
      ...(kind === "organism" ? {
        taxonomy: cloneJson(source.taxonomy),
        traits: cloneJson(source.traits),
        epidemiology: cloneJson(source.epidemiology),
        relationshipNotApplicable
      } : {}),
      microbiologyRelationships: relationships,
      browse: {
        branchId: source.browsePath,
        path: String(source.browsePath || "").split("/").filter(Boolean),
        pillarId: String(source.browsePath || "").split("/")[0] || "",
        label: branch.label || source.browsePath
      },
      studentFacing: true,
      hidden: false,
      microbiology: {
        schemaVersion: SCHEMA_VERSION,
        architectureVersion: ARCHITECTURE_VERSION,
        taxonomyVersion: TAXONOMY_VERSION,
        relationshipSchemaVersion: RELATIONSHIP_SCHEMA_VERSION,
        generatorVersion: GENERATOR_VERSION,
        entryKind: kind,
        browsePath: source.browsePath,
        canonicalOwner: "Microbiology",
        runtimeCollection: "clinicalReferenceEntries",
        classification: classificationOutput,
        reviewStatus: source.reviewStatus,
        ...(source.reviewedAt ? { reviewedAt: source.reviewedAt } : {}),
        sourceKeys: uniqueSorted(source.sourceKeys || [], normalizeIdentity),
        sourceEntrySha256: sha256(stableStringify(source))
      }
    };
  }

  function safeResolutionSummary(resolution) {
    const result = resolution && typeof resolution === "object" ? resolution : {};
    return {
      status: result.status || "unresolved",
      resolutionStrategy: result.resolutionStrategy || "none",
      reason: normalizeWhitespace(result.reason)
    };
  }

  function buildCrossLinkRecords(entries, options) {
    const records = Array.isArray(entries) ? entries : [];
    const candidates = options && options.candidates ? options.candidates : records;
    const customResolver = options && typeof options.resolveTarget === "function" ? options.resolveTarget : null;
    const links = [];
    records.slice().sort((left, right) => ordinalCompare(
      normalizeWhitespace(left && (left.id || left.directTargetId)),
      normalizeWhitespace(right && (right.id || right.directTargetId))
    )).forEach((entry) => {
      const sourceId = normalizeWhitespace(entry && (entry.id || entry.directTargetId));
      const sourceKind = entityKindForEntry(entry);
      const relationships = Array.isArray(entry && entry.microbiologyRelationships)
        ? entry.microbiologyRelationships
        : Array.isArray(entry && entry.relationships) ? entry.relationships : [];
      relationships.forEach((relationship) => {
        const targetRef = normalizeTargetReference(relationship.target || relationship);
        const targetKey = targetReferenceKey(targetRef);
        const relationshipIdentity = relationshipIdentitySha256(relationship);
        const rule = relationshipRule(relationship.type) || {};
        let resolution;
        try {
          resolution = customResolver ? customResolver(targetRef, { source: entry, relationship, candidates }) : resolveTargetReference(targetRef, candidates);
        } catch (error) {
          resolution = { status: "invalid", resolutionStrategy: "none", reason: error && error.message || String(error) };
        }
        links.push({
          id: `${sourceId}::${relationship.type}::${relationshipIdentity}`,
          sourceId,
          sourceKind,
          relationshipType: relationship.type,
          relationshipIdentitySha256: relationshipIdentity,
          targetKey,
          targetId: targetRef && targetRef.targetId || "",
          targetName: targetRef && (targetRef.targetName || targetRef.canonicalTitle) || "",
          targetCollection: targetRef && targetRef.targetCollection || "",
          targetKind: targetRef && targetRef.targetKind || "",
          inverseIndex: rule.inverseIndex || "",
          relationshipGroup: relationshipGroupForType(relationship.type) && relationshipGroupForType(relationship.type).id || "",
          resolution: safeResolutionSummary(resolution)
        });
      });
    });
    return links.sort((left, right) => ordinalCompare(left.id, right.id));
  }

  function appendIndex(index, key, value) {
    if (!key) return;
    if (!index[key]) index[key] = [];
    if (!index[key].includes(value)) index[key].push(value);
  }

  function sortIndex(index) {
    const output = {};
    Object.keys(index).sort(ordinalCompare).forEach((key) => {
      output[key] = index[key].slice().sort(ordinalCompare);
    });
    return output;
  }

  function buildDomainIndexes(entries, crossLinkRecords) {
    const byId = {};
    const canonicalNameToIds = {};
    const aliasToIds = {};
    const byBranch = {};
    const byEntryKind = {};
    const outboundBySourceId = {};
    const inboundByTargetKey = {};
    const byRelationshipType = {};
    const byRelationshipGroup = {};
    (Array.isArray(entries) ? entries : []).slice().sort((left, right) => ordinalCompare(left.id, right.id)).forEach((entry) => {
      const id = normalizeWhitespace(entry.id || entry.directTargetId);
      if (!id) return;
      byId[id] = id;
      appendIndex(canonicalNameToIds, normalizeIdentity(entry.canonicalName || entry.name), id);
      const typedAliases = Array.isArray(entry.typedAliases) ? entry.typedAliases : [];
      typedAliases.forEach((alias) => appendIndex(aliasToIds, normalizeIdentity(alias.value), id));
      const metadata = isPlainObject(entry.microbiology) ? entry.microbiology : {};
      appendIndex(byBranch, normalizeWhitespace(metadata.browsePath || entry.browse && entry.browse.branchId), id);
      appendIndex(byEntryKind, normalizeWhitespace(metadata.entryKind || entry.microbiologyKind), id);
    });
    (Array.isArray(crossLinkRecords) ? crossLinkRecords : []).forEach((record) => {
      appendIndex(outboundBySourceId, record.sourceId, record.id);
      appendIndex(inboundByTargetKey, record.targetKey, record.id);
      appendIndex(byRelationshipType, record.relationshipType, record.id);
      appendIndex(byRelationshipGroup, record.relationshipGroup, record.id);
    });
    return {
      byId: Object.fromEntries(Object.keys(byId).sort(ordinalCompare).map((id) => [id, byId[id]])),
      canonicalNameToIds: sortIndex(canonicalNameToIds),
      aliasToIds: sortIndex(aliasToIds),
      byBranch: sortIndex(byBranch),
      byEntryKind: sortIndex(byEntryKind),
      outboundBySourceId: sortIndex(outboundBySourceId),
      inboundByTargetKey: sortIndex(inboundByTargetKey),
      byRelationshipType: sortIndex(byRelationshipType),
      byRelationshipGroup: sortIndex(byRelationshipGroup)
    };
  }

  return deepFreeze({
    SCHEMA_VERSION,
    ARCHITECTURE_VERSION,
    TAXONOMY_VERSION,
    RELATIONSHIP_SCHEMA_VERSION,
    GENERATOR_VERSION,
    FINGERPRINT_VERSION,
    APPROVAL_SCHEMA_VERSION,
    ENTRY_KINDS,
    AGENT_CLASSES,
    TAXONOMY_AUTHORITIES,
    TAXONOMIC_RANKS,
    NOMENCLATURE_STATUSES,
    TAXONOMY_REVIEW_STATUSES,
    TAXONOMY_CONTRACT,
    TRAIT_VALUE_REGISTRIES,
    AGENT_TRAIT_SCHEMAS,
    INCUBATION_STATUSES,
    INCUBATION_UNITS,
    ORGANISM_EPIDEMIOLOGY_CONTRACT,
    CONCEPT_CLASSES,
    METHOD_CLASSES,
    MEDIUM_CLASSES,
    IPC_CLASSES,
    ALIAS_KINDS,
    FORBIDDEN_ALIAS_KINDS,
    TARGET_KINDS,
    RUNTIME_TARGET_COLLECTIONS,
    BROWSE_BRANCHES,
    CANONICAL_TERMINOLOGY,
    OWNERSHIP_RULES,
    REQUIRED_CONTENT_GROUPS,
    RELATIONSHIP_RULES,
    ORGANISM_RELATIONSHIP_GROUPS,
    ARCHITECTURE_STATUSES,
    AGGREGATE_BRANCH_IDS,
    GATEWAY_BRANCH_IDS,
    ordinalCompare,
    normalizeWhitespace,
    normalizeIdentity,
    slugify,
    stableStringify,
    sha256,
    sourceSpecForEntry,
    relationshipIdentityMaterial,
    relationshipIdentitySha256,
    architectureDefinition,
    architectureFingerprintMaterial,
    architectureSha256,
    makeIssue,
    relationshipRule,
    relationshipGroupForType,
    validateApproval,
    validateEntry,
    validateMembership,
    validateCatalog,
    assertValidCatalog,
    entityKindForEntry,
    entityKindLineage,
    normalizeTargetReference,
    targetReferenceKey,
    resolveTargetReference,
    buildEntry,
    buildCrossLinkRecords,
    buildDomainIndexes
  });
});
