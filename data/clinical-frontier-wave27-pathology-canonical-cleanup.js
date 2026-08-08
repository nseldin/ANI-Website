/* eslint-disable */
(function () {
  const METADATA_KEY = "ANI_PATHOLOGY_CANONICAL_WAVE27";
  const VERSION = "2026-07-17-wave27-pathology-canonical-1";
  const rules = [
    {
      name: "Hypoxia",
      expectedScaffoldTag: "first-sentence-power-line-2026-07-11",
      canonicalOwner: "main.js medicalTerminologySupplements",
      expectedCategory: "Medical terminology / oxygenation"
    },
    {
      name: "Pulmonary compliance",
      expectedScaffoldTag: "first-sentence-crash-course-2026-07-11",
      canonicalOwner: "main.js medicalTerminologySupplements",
      expectedCategory: "Medical terminology / ventilation"
    },
    {
      name: "Steatohepatitis",
      expectedScaffoldTag: "first-sentence-crash-course-2026-07-11",
      canonicalOwner: "main.js curatedPathologySupplements",
      expectedCategory: "GI/Liver / fatty liver inflammation"
    }
  ];

  const metadata = {
    schemaVersion: 1,
    version: VERSION,
    rules: rules.map((rule) => ({ ...rule })),
    removed: rules.map((rule) => ({ name: rule.name, count: 0 })),
    unexpected: []
  };

  const normalizePrimaryTitle = (entry) => String(
    entry && (entry.name || entry.title || entry.displayName) || ""
  )
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const hasExactTag = (entry, expectedTag) => Array.isArray(entry && entry.tags)
    && entry.tags.some((tag) => tag === expectedTag);

  const pathology = window.ANI_PATHOLOGY_DATABASE;
  const diseases = pathology && Array.isArray(pathology.diseases)
    ? pathology.diseases
    : null;

  if (!diseases) {
    rules.forEach((rule) => metadata.unexpected.push({
      name: rule.name,
      expectedScaffoldTag: rule.expectedScaffoldTag,
      expectedMatchCount: 1,
      actualMatchCount: 0,
      reason: "pathology-database-unavailable"
    }));
    window[METADATA_KEY] = metadata;
    return;
  }

  const removals = new Set();
  rules.forEach((rule, ruleIndex) => {
    const expectedTitle = normalizePrimaryTitle({ name: rule.name });
    const matches = diseases.filter((entry) => (
      normalizePrimaryTitle(entry) === expectedTitle
      && hasExactTag(entry, rule.expectedScaffoldTag)
    ));

    if (matches.length !== 1) {
      metadata.unexpected.push({
        name: rule.name,
        expectedScaffoldTag: rule.expectedScaffoldTag,
        expectedMatchCount: 1,
        actualMatchCount: matches.length,
        reason: matches.length === 0
          ? "expected-scaffold-absent"
          : "expected-scaffold-ambiguous"
      });
      return;
    }

    removals.add(matches[0]);
    metadata.removed[ruleIndex].count = 1;
  });

  if (removals.size) {
    pathology.diseases = diseases.filter((entry) => !removals.has(entry));
  }

  window[METADATA_KEY] = metadata;
}());
