/* eslint-disable */
(function () {
  const METADATA_KEY = "ANI_PATHOLOGY_CANONICAL_WAVE27";
  const VERSION = "2026-07-17-wave27-pathology-canonical-2";
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

  // The original pathology-bible importer inferred parent acronyms from any
  // contextual title containing the full form. These exact rules remove only
  // the inherited parent identity; the specific card title remains searchable.
  const identityRules = [
    {
      name: "Cardiogenic shock after MI",
      removeAliases: ["myocardial infarction"],
      removeAbbreviations: ["MI: myocardial infarction"]
    },
    {
      name: "Inferior wall MI",
      removeAliases: ["myocardial infarction"],
      removeAbbreviations: ["MI: myocardial infarction"]
    },
    {
      name: "Post-MI heart failure",
      removeAliases: ["myocardial infarction"],
      removeAbbreviations: ["MI: myocardial infarction"]
    },
    {
      name: "Silent MI",
      removeAliases: ["myocardial infarction"],
      removeAbbreviations: ["MI: myocardial infarction"]
    },
    {
      name: "Disseminated intravascular coagulation in obstetrics",
      removeAliases: ["DIC"],
      removeAbbreviations: ["DIC: disseminated intravascular coagulation"],
      addAliases: ["obstetric DIC"]
    },
    {
      name: "DKA in children",
      removeAliases: ["diabetic ketoacidosis"],
      removeAbbreviations: ["DKA: diabetic ketoacidosis"],
      addAliases: ["pediatric DKA"]
    },
    {
      name: "Catheter-associated UTI",
      removeAliases: ["urinary tract infection"],
      removeAbbreviations: ["UTI: urinary tract infection"],
      addAliases: ["CAUTI"]
    }
  ];

  const metadata = {
    schemaVersion: 2,
    version: VERSION,
    rules: rules.map((rule) => ({ ...rule })),
    removed: rules.map((rule) => ({ name: rule.name, count: 0 })),
    unexpected: [],
    identityRules: identityRules.map((rule) => ({ ...rule })),
    identityChanges: [],
    identityUnexpected: []
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

  const normalizeIdentity = (value) => normalizePrimaryTitle({ name: value });
  const uniqueIdentityValues = (values) => Array.from(new Set((values || [])
    .map((value) => String(value || "").trim())
    .filter(Boolean)));
  identityRules.forEach((rule) => {
    const expectedTitle = normalizePrimaryTitle({ name: rule.name });
    const matches = pathology.diseases.filter((entry) => normalizePrimaryTitle(entry) === expectedTitle);
    if (matches.length !== 1) {
      metadata.identityUnexpected.push({
        name: rule.name,
        expectedMatchCount: 1,
        actualMatchCount: matches.length,
        reason: matches.length === 0 ? "identity-owner-absent" : "identity-owner-ambiguous"
      });
      return;
    }

    const entry = matches[0];
    const removedAliasKeys = new Set((rule.removeAliases || []).map(normalizeIdentity));
    const removedAbbreviationKeys = new Set((rule.removeAbbreviations || []).map(normalizeIdentity));
    const aliasesBefore = uniqueIdentityValues(entry.aliases);
    const abbreviationsBefore = uniqueIdentityValues(entry.abbreviations);
    entry.aliases = uniqueIdentityValues([
      ...aliasesBefore.filter((value) => !removedAliasKeys.has(normalizeIdentity(value))),
      ...(rule.addAliases || [])
    ]);
    entry.abbreviations = abbreviationsBefore.filter(
      (value) => !removedAbbreviationKeys.has(normalizeIdentity(value))
    );
    metadata.identityChanges.push({
      name: rule.name,
      aliasesRemoved: aliasesBefore.length - entry.aliases.filter((value) => aliasesBefore.includes(value)).length,
      abbreviationsRemoved: abbreviationsBefore.length - entry.abbreviations.length,
      aliasesAdded: entry.aliases.filter((value) => !aliasesBefore.includes(value)),
      remainingAliases: [...entry.aliases],
      remainingAbbreviations: [...entry.abbreviations]
    });
  });

  window[METADATA_KEY] = metadata;
}());
