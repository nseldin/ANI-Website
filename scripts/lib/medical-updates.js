"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");
const CONFIG_SCHEMA = "ani-medical-updates-sources-v1";
const DATASET_SCHEMA = "ani-medical-updates-dataset-v1";
const RUNTIME_SCHEMA = "ani-medical-updates-runtime-v1";
const GENERATOR_VERSION = "ani-medical-updates-generator-2026-08-08.1";
const CONFIG_RELATIVE_PATH = "config/ani-medical-updates-sources.v1.json";
const DATA_RELATIVE_PATH = "data/medical-updates.json";
const RUNTIME_RELATIVE_PATH = "data/medical-updates.js";
const SOURCE_STATUS_VALUES = Object.freeze(["current", "stale", "disabled"]);
const REFRESH_STATUS_VALUES = Object.freeze(["CURRENT", "PARTIAL", "STALE", "PENDING_INITIAL_REFRESH"]);
const DESCRIPTION_ORIGINS = Object.freeze(["source-provided", "unavailable"]);
const CATEGORY_PRIORITY = Object.freeze({
  "safety-alert": 0,
  recall: 1,
  "drug-approval": 2,
  "vaccine-biologic": 3,
  "guideline-public-health": 4,
  "medical-development": 5
});

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

function stableJson(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function cleanText(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") {
    if (Object.prototype.hasOwnProperty.call(value, "#text")) return cleanText(value["#text"]);
    if (Object.prototype.hasOwnProperty.call(value, "#cdata")) return cleanText(value["#cdata"]);
    return "";
  }
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeIdentity(value) {
  return cleanText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (match, decimal) => {
      const codePoint = Number(decimal);
      return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    })
    .replace(/&#x([0-9a-f]+);/gi, (match, hexadecimal) => {
      const codePoint = Number.parseInt(hexadecimal, 16);
      return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function sourcePlainText(value) {
  const text = cleanText(value);
  if (!text) return "";
  return cleanText(decodeHtmlEntities(text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")));
}

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function validIso(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
}

function isoDate(value) {
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : "";
}

function compilePatterns(patterns) {
  return asArray(patterns).map((pattern) => new RegExp(String(pattern), "i"));
}

function patternMatch(value, patterns) {
  const text = cleanText(value);
  return compilePatterns(patterns).some((pattern) => pattern.test(text));
}

function projectPaths(root = ROOT) {
  const resolvedRoot = path.resolve(root);
  return {
    root: resolvedRoot,
    configPath: path.join(resolvedRoot, ...CONFIG_RELATIVE_PATH.split("/")),
    dataPath: path.join(resolvedRoot, ...DATA_RELATIVE_PATH.split("/")),
    runtimePath: path.join(resolvedRoot, ...RUNTIME_RELATIVE_PATH.split("/"))
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadProject(root = ROOT) {
  const paths = projectPaths(root);
  const configBytes = fs.readFileSync(paths.configPath);
  const config = JSON.parse(configBytes.toString("utf8"));
  const dataset = fs.existsSync(paths.dataPath) ? readJson(paths.dataPath) : null;
  const runtime = fs.existsSync(paths.runtimePath) ? fs.readFileSync(paths.runtimePath, "utf8") : "";
  return {
    ...paths,
    config,
    configBytes,
    configSha256: sha256(configBytes),
    dataset,
    runtime
  };
}

function validateConfig(config) {
  const issues = [];
  const add = (code, field, message, value) => issues.push({ code, field, message, value });
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    add("medical-updates-config-invalid", "config", "The source registry must be a JSON object.", config);
    return { valid: false, issues };
  }
  if (config.schemaVersion !== CONFIG_SCHEMA) add("medical-updates-config-schema-invalid", "schemaVersion", `Expected ${CONFIG_SCHEMA}.`, config.schemaVersion);
  if (!cleanText(config.datasetVersion)) add("medical-updates-dataset-version-missing", "datasetVersion", "datasetVersion is required.", config.datasetVersion);
  [
    "currentWindowDays", "archiveRetentionDays", "futureDateToleranceHours", "maxItemsPerSource",
    "maxCurrentItems", "maxArchiveItems", "maxDatasetBytes", "maxSources",
    "maxDatasetVersionCharacters", "maxGeneratorVersionCharacters", "maxItemIdCharacters",
    "maxTitleCharacters", "maxDescriptionCharacters", "maxStatusErrorCharacters",
    "maxRelatedCardsPerItem", "maxRelatedCollectionCharacters", "maxRelatedTitleCharacters",
    "maxSourceCategoriesPerItem",
    "maxSourceCategoryCharacters", "maxUrlCharacters", "maxSourceNameCharacters",
    "maxGuidCharacters", "maxFeedBytes", "requestTimeoutMs", "maxRedirects"
  ].forEach((field) => {
    if (!Number.isInteger(config[field]) || config[field] <= 0) add("medical-updates-config-limit-invalid", field, `${field} must be a positive integer.`, config[field]);
  });
  if (cleanText(config.datasetVersion).length > config.maxDatasetVersionCharacters) add("medical-updates-dataset-version-too-long", "datasetVersion", `datasetVersion must not exceed ${config.maxDatasetVersionCharacters} characters.`, config.datasetVersion);
  if (GENERATOR_VERSION.length > config.maxGeneratorVersionCharacters) add("medical-updates-generator-version-too-long", "maxGeneratorVersionCharacters", `generatorVersion must not exceed ${config.maxGeneratorVersionCharacters} characters.`, GENERATOR_VERSION);
  if (Number.isInteger(config.archiveRetentionDays) && Number.isInteger(config.currentWindowDays) && config.archiveRetentionDays <= config.currentWindowDays) {
    add("medical-updates-retention-window-invalid", "archiveRetentionDays", "archiveRetentionDays must exceed currentWindowDays.", config.archiveRetentionDays);
  }
  const categories = Array.isArray(config.categories) ? config.categories : [];
  if (!categories.length || new Set(categories).size !== categories.length) add("medical-updates-categories-invalid", "categories", "categories must be a nonempty unique array.", config.categories);
  const categorySet = new Set(categories);
  if (!Array.isArray(config.relatedCardRules)) add("medical-updates-related-rules-invalid", "relatedCardRules", "relatedCardRules must be an array.", config.relatedCardRules);
  asArray(config.relatedCardRules).forEach((rule, index) => {
    const target = rule && rule.target;
    if (!rule || !Array.isArray(rule.terms) || !rule.terms.length || rule.terms.some((term) => !cleanText(term))
      || !target || !cleanText(target.collection) || cleanText(target.collection).length > config.maxRelatedCollectionCharacters
      || !cleanText(target.canonicalTitle) || cleanText(target.canonicalTitle).length > config.maxRelatedTitleCharacters) {
      add("medical-updates-related-rule-invalid", `relatedCardRules[${index}]`, "A related-card rule requires nonblank exact terms and a collection-plus-canonical-title target.", rule);
    }
  });
  const sourceIds = new Set();
  if (!Array.isArray(config.sources) || !config.sources.length || config.sources.length > config.maxSources) add("medical-updates-sources-invalid", "sources", `Between 1 and ${config.maxSources} sources are required.`, config.sources);
  asArray(config.sources).forEach((source, index) => {
    const base = `sources[${index}]`;
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      add("medical-updates-source-invalid", base, "Each source must be an object.", source);
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(source.id || ""))) add("medical-updates-source-id-invalid", `${base}.id`, "Use a stable kebab-case source ID.", source.id);
    if (sourceIds.has(source.id)) add("medical-updates-source-id-duplicate", `${base}.id`, "Source IDs must be unique.", source.id); else sourceIds.add(source.id);
    if (!cleanText(source.name) || cleanText(source.name).length > config.maxSourceNameCharacters) add("medical-updates-source-name-missing", `${base}.name`, `An official source name of at most ${config.maxSourceNameCharacters} characters is required.`, source.name);
    let feedUrl;
    try { feedUrl = new URL(source.feedUrl); } catch (_error) { feedUrl = null; }
    if (!feedUrl || feedUrl.protocol !== "https:") add("medical-updates-source-feed-url-invalid", `${base}.feedUrl`, "The feed URL must use HTTPS.", source.feedUrl);
    if (!Array.isArray(source.feedHosts) || !source.feedHosts.length || (feedUrl && !source.feedHosts.includes(feedUrl.hostname))) add("medical-updates-source-feed-host-invalid", `${base}.feedHosts`, "feedHosts must explicitly allow the feed hostname.", source.feedHosts);
    if (!Array.isArray(source.finalItemHosts) || !source.finalItemHosts.length) add("medical-updates-source-final-hosts-invalid", `${base}.finalItemHosts`, "At least one final official item hostname is required.", source.finalItemHosts);
    if (!Array.isArray(source.intermediateItemHosts)) add("medical-updates-source-intermediate-hosts-invalid", `${base}.intermediateItemHosts`, "intermediateItemHosts must be an array.", source.intermediateItemHosts);
    if (!["source-provided", "title-only"].includes(source.descriptionPolicy)) add("medical-updates-description-policy-invalid", `${base}.descriptionPolicy`, "Use source-provided or title-only.", source.descriptionPolicy);
    if (!categorySet.has(source.defaultCategory)) add("medical-updates-default-category-invalid", `${base}.defaultCategory`, "defaultCategory must be registered.", source.defaultCategory);
    ["includeTitlePatterns", "excludeTitlePatterns", "categoryRules"].forEach((field) => {
      if (!Array.isArray(source[field])) add("medical-updates-source-array-invalid", `${base}.${field}`, `${field} must be an array.`, source[field]);
    });
    ["includeTitlePatterns", "excludeTitlePatterns"].forEach((field) => {
      try { compilePatterns(source[field]); } catch (error) { add("medical-updates-source-pattern-invalid", `${base}.${field}`, error.message, source[field]); }
    });
    asArray(source.categoryRules).forEach((rule, ruleIndex) => {
      if (!rule || !categorySet.has(rule.category) || !Array.isArray(rule.titlePatterns) || !rule.titlePatterns.length) {
        add("medical-updates-category-rule-invalid", `${base}.categoryRules[${ruleIndex}]`, "A category rule needs a registered category and titlePatterns.", rule);
      } else {
        try { compilePatterns(rule.titlePatterns); } catch (error) { add("medical-updates-category-rule-pattern-invalid", `${base}.categoryRules[${ruleIndex}]`, error.message, rule.titlePatterns); }
      }
    });
  });
  return { valid: issues.length === 0, issues };
}

function extractLink(value) {
  const candidates = asArray(value);
  const preferred = candidates.find((entry) => entry && typeof entry === "object" && (!entry["@_rel"] || entry["@_rel"] === "alternate") && entry["@_href"]);
  if (preferred) return cleanText(preferred["@_href"]);
  for (const candidate of candidates) {
    if (typeof candidate === "string") return cleanText(candidate);
    if (candidate && typeof candidate === "object") {
      const found = cleanText(candidate["@_href"] || candidate["#text"] || candidate["#cdata"]);
      if (found) return found;
    }
  }
  return "";
}

function extractCategories(value) {
  return Array.from(new Set(asArray(value).map((entry) => {
    if (entry && typeof entry === "object") return cleanText(entry["@_term"] || entry["#text"] || entry["#cdata"]);
    return cleanText(entry);
  }).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function parseOfficialFeed(xmlText) {
  let XMLParser;
  try {
    ({ XMLParser } = require("fast-xml-parser"));
  } catch (error) {
    const missing = new Error("fast-xml-parser is required for Medical Updates feed parsing. Add it through pnpm before refresh.");
    missing.cause = error;
    missing.code = "medical-updates-xml-parser-missing";
    throw missing;
  }
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    cdataPropName: "#cdata",
    trimValues: false,
    parseTagValue: false,
    processEntities: true
  });
  const parsed = parser.parse(String(xmlText || ""));
  let rows = [];
  if (parsed && parsed.rss && parsed.rss.channel) rows = asArray(parsed.rss.channel).flatMap((channel) => asArray(channel && channel.item));
  else if (parsed && parsed.feed) rows = asArray(parsed.feed.entry);
  else throw new Error("Unsupported official feed envelope; expected RSS or Atom.");
  return rows.map((row) => ({
    title: sourcePlainText(row && row.title),
    link: extractLink(row && row.link),
    description: sourcePlainText(row && (row.description || row.summary || row["content:encoded"] || row.content)),
    publishedAt: cleanText(row && (row.pubDate || row.published || row.updated || row["dc:date"])),
    guid: cleanText(row && (row.guid || row.id)) || null,
    sourceCategories: extractCategories(row && row.category)
  }));
}

function classifyItem(source, title) {
  if (asArray(source.excludeTitlePatterns).length && patternMatch(title, source.excludeTitlePatterns)) return null;
  if (asArray(source.includeTitlePatterns).length && !patternMatch(title, source.includeTitlePatterns)) return null;
  const matchingRule = asArray(source.categoryRules).find((rule) => patternMatch(title, rule.titlePatterns));
  return matchingRule ? matchingRule.category : source.defaultCategory;
}

function canonicalUrl(value, source, trackingParameters = []) {
  let parsed;
  try { parsed = new URL(cleanText(value)); } catch (_error) { return ""; }
  const allowed = new Set(asArray(source.finalItemHosts).concat(asArray(source.intermediateItemHosts)));
  if (parsed.protocol === "http:" && allowed.has(parsed.hostname)) parsed.protocol = "https:";
  if (parsed.protocol !== "https:" || !allowed.has(parsed.hostname)) return "";
  parsed.hash = "";
  asArray(trackingParameters).forEach((parameter) => parsed.searchParams.delete(parameter));
  Array.from(parsed.searchParams.keys()).forEach((parameter) => {
    if (/^utm_/i.test(parameter)) parsed.searchParams.delete(parameter);
  });
  if (parsed.pathname !== "/") parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  return parsed.toString();
}

async function fetchWithPolicy(urlValue, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") throw new Error("A Fetch API implementation is required.");
  const allowedHosts = new Set(options.allowedHosts || []);
  const timeoutMs = options.timeoutMs || 20000;
  const maxRedirects = options.maxRedirects || 6;
  const maxBytes = options.maxBytes || 2097152;
  let current = new URL(urlValue);
  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    if (current.protocol !== "https:" || !allowedHosts.has(current.hostname)) throw new Error(`URL host is not allowlisted: ${current.hostname}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetchImpl(current, {
        method: options.method || "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": options.userAgent || "ANI-Medical-Updates/1.0",
          Accept: options.accept || "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.1"
        }
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new Error(`Redirect ${response.status} did not provide a Location header.`);
        current = new URL(location, current);
        continue;
      }
      if (!response.ok) throw new Error(`Official source returned HTTP ${response.status}.`);
      if (options.resolveOnly) {
        if (response.body && typeof response.body.cancel === "function") await response.body.cancel();
        return { finalUrl: current.toString(), text: "", contentType: response.headers.get("content-type") || "", status: response.status };
      }
      const declaredBytes = Number(response.headers.get("content-length") || 0);
      if (declaredBytes > maxBytes) throw new Error(`Official feed exceeds the ${maxBytes}-byte limit.`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > maxBytes) throw new Error(`Official feed exceeds the ${maxBytes}-byte limit.`);
      return { finalUrl: current.toString(), text: bytes.toString("utf8"), contentType: response.headers.get("content-type") || "", status: response.status };
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Official source exceeded the ${maxRedirects}-redirect limit.`);
}

async function resolveOfficialItemUrl(value, source, config, fetchImpl) {
  const initial = canonicalUrl(value, source, config.trackingQueryParameters);
  if (!initial) throw new Error("Item URL is missing or outside the source allowlist.");
  if (!source.resolveItemRedirects) {
    const parsed = new URL(initial);
    if (!source.finalItemHosts.includes(parsed.hostname)) throw new Error("Item URL does not use an allowed final official hostname.");
    return initial;
  }
  const request = (method) => fetchWithPolicy(initial, {
    fetchImpl,
    method,
    resolveOnly: true,
    allowedHosts: asArray(source.intermediateItemHosts).concat(asArray(source.finalItemHosts)),
    timeoutMs: config.requestTimeoutMs,
    maxRedirects: config.maxRedirects,
    maxBytes: config.maxFeedBytes,
    userAgent: config.userAgent,
    accept: "text/html, application/xhtml+xml, */*;q=0.1"
  });
  let resolved;
  try {
    resolved = await request("HEAD");
  } catch (_headError) {
    resolved = await request("GET");
  }
  const finalUrl = canonicalUrl(resolved.finalUrl, source, config.trackingQueryParameters);
  if (!finalUrl || !source.finalItemHosts.includes(new URL(finalUrl).hostname)) throw new Error("Redirect did not resolve to an allowed final official hostname.");
  return finalUrl;
}

function topicStableIds(topic) {
  const record = topic && topic.record || {};
  return [record.id, record.cardId, record.topicId, record.directTargetId]
    .filter((value) => typeof value === "string" || typeof value === "number")
    .map((value) => cleanText(value)).filter(Boolean);
}

function resolveRelatedCard(catalog, reference) {
  if (!catalog || !Array.isArray(catalog.topics) || !reference || typeof reference !== "object") return [];
  const expectedCollection = cleanText(reference.collection);
  const expectedTitle = normalizeIdentity(reference.canonicalTitle);
  const expectedStableId = cleanText(reference.stableId);
  return catalog.topics.filter((topic) => {
    if (expectedCollection && topic.sourceCollection !== expectedCollection) return false;
    if (expectedTitle && normalizeIdentity(topic.canonicalName) !== expectedTitle) return false;
    if (expectedStableId && !topicStableIds(topic).includes(expectedStableId)) return false;
    return Boolean(expectedStableId || (expectedCollection && expectedTitle));
  });
}

function catalogRelatedCardRules(catalog) {
  if (!catalog || !Array.isArray(catalog.topics)) return [];
  return catalog.topics.flatMap((topic) => {
    const terms = asArray(topic && topic.record && topic.record.updateMatchTerms).map(cleanText).filter(Boolean);
    if (!terms.length) return [];
    return [{
      terms,
      target: {
        collection: topic.sourceCollection,
        canonicalTitle: topic.canonicalName
      }
    }];
  });
}

function relatedCardsForText(text, config, catalog) {
  const normalizedText = ` ${normalizeIdentity(text)} `;
  const rules = asArray(config.relatedCardRules)
    .map((rule) => ({ ...rule, trustedRegistryRule: true }))
    .concat(catalogRelatedCardRules(catalog));
  const found = [];
  rules.forEach((rule) => {
    if (!asArray(rule.terms).some((term) => normalizedText.includes(` ${normalizeIdentity(term)} `))) return;
    if (catalog && resolveRelatedCard(catalog, rule.target).length !== 1) return;
    if (!catalog && !rule.trustedRegistryRule) return;
    const collection = cleanText(rule.target.collection);
    const canonicalTitle = cleanText(rule.target.canonicalTitle);
    if (!collection || collection.length > config.maxRelatedCollectionCharacters
      || !canonicalTitle || canonicalTitle.length > config.maxRelatedTitleCharacters) return;
    found.push({
      collection,
      canonicalTitle,
      ...(cleanText(rule.target.stableId) ? { stableId: cleanText(rule.target.stableId) } : {})
    });
  });
  const byKey = new Map(found.map((reference) => [`${reference.collection}:${normalizeIdentity(reference.canonicalTitle)}:${reference.stableId || ""}`, reference]));
  return Array.from(byKey.values())
    .sort((left, right) => `${left.collection}:${left.canonicalTitle}`.localeCompare(`${right.collection}:${right.canonicalTitle}`))
    .slice(0, config.maxRelatedCardsPerItem);
}

function itemContentHash(item) {
  return sha256(stableJson({
    sourceId: item.sourceId,
    sourceName: item.sourceName,
    publishedAt: item.publishedAt,
    title: item.title,
    description: item.description,
    descriptionOrigin: item.descriptionOrigin,
    url: item.url,
    guid: item.guid,
    category: item.category,
    sourceCategories: item.sourceCategories,
    relatedCards: item.relatedCards
  }));
}

function feedItemEligibility(row, source, config, nowValue = Date.now()) {
  const title = sourcePlainText(row && row.title);
  const publishedAt = isoDate(row && row.publishedAt);
  const category = classifyItem(source, title);
  if (!title || !publishedAt || !category) return { eligible: false, title, publishedAt, category };
  const now = new Date(nowValue);
  const futureLimit = now.getTime() + config.futureDateToleranceHours * 60 * 60 * 1000;
  if (new Date(publishedAt).getTime() > futureLimit) return { eligible: false, title, publishedAt, category };
  return { eligible: true, title, publishedAt, category };
}

async function normalizeFeedItem(row, source, config, options = {}) {
  const now = new Date(options.now || Date.now());
  const eligibility = feedItemEligibility(row, source, config, now);
  if (!eligibility.eligible) return null;
  const { title, publishedAt, category } = eligibility;
  if (title.length > config.maxTitleCharacters) throw new Error(`Item title exceeds the ${config.maxTitleCharacters}-character browser limit.`);
  if (cleanText(row && row.link).length > config.maxUrlCharacters) throw new Error(`Item URL exceeds the ${config.maxUrlCharacters}-character browser limit.`);
  const url = await resolveOfficialItemUrl(row.link, source, config, options.fetchImpl);
  if (url.length > config.maxUrlCharacters) throw new Error(`Resolved item URL exceeds the ${config.maxUrlCharacters}-character browser limit.`);
  const sourceDescription = source.descriptionPolicy === "source-provided" ? sourcePlainText(row.description) : "";
  if (sourceDescription.length > config.maxDescriptionCharacters) throw new Error(`Source description exceeds the ${config.maxDescriptionCharacters}-character browser limit.`);
  const guid = cleanText(row.guid) || null;
  if (guid && guid.length > config.maxGuidCharacters) throw new Error(`Source GUID exceeds the ${config.maxGuidCharacters}-character generator limit.`);
  const sourceCategories = extractCategories(row.sourceCategories)
    .filter((value) => value.length <= config.maxSourceCategoryCharacters)
    .slice(0, config.maxSourceCategoriesPerItem);
  const seed = `${source.id}\n${url || guid || `${title}\n${publishedAt.slice(0, 10)}`}`;
  const item = {
    id: `medical-update:${source.id}:${sha256(seed).slice(0, 24)}`,
    sourceId: source.id,
    sourceName: source.name,
    publishedAt,
    title,
    description: sourceDescription || null,
    descriptionOrigin: sourceDescription ? "source-provided" : "unavailable",
    url,
    guid,
    category,
    sourceCategories,
    retrievedAt: now.toISOString(),
    contentHash: "",
    relatedCards: relatedCardsForText(`${title} ${sourceDescription}`, config, options.catalog)
  };
  item.contentHash = itemContentHash(item);
  return item;
}

function newestFirst(left, right) {
  return right.publishedAt.localeCompare(left.publishedAt)
    || (CATEGORY_PRIORITY[left.category] ?? 99) - (CATEGORY_PRIORITY[right.category] ?? 99)
    || left.sourceId.localeCompare(right.sourceId)
    || left.title.localeCompare(right.title)
    || left.id.localeCompare(right.id);
}

function deduplicateItems(items) {
  const ordered = asArray(items).filter(Boolean).slice().sort(newestFirst);
  const seenIds = new Set();
  const seenUrls = new Set();
  const seenGuid = new Set();
  const seenSourceTitleDate = new Set();
  return ordered.filter((item) => {
    const guidKey = item.guid ? `${item.sourceId}:${normalizeIdentity(item.guid)}` : "";
    const titleDateKey = `${item.sourceId}:${normalizeIdentity(item.title)}:${item.publishedAt.slice(0, 10)}`;
    if (seenIds.has(item.id) || seenUrls.has(item.url) || (guidKey && seenGuid.has(guidKey)) || seenSourceTitleDate.has(titleDateKey)) return false;
    seenIds.add(item.id);
    seenUrls.add(item.url);
    if (guidKey) seenGuid.add(guidKey);
    seenSourceTitleDate.add(titleDateKey);
    return true;
  });
}

function partitionItems(items, nowValue, currentWindowDays, archiveRetentionDays) {
  const now = new Date(nowValue);
  const currentCutoff = now.getTime() - currentWindowDays * 24 * 60 * 60 * 1000;
  const retentionCutoff = now.getTime() - archiveRetentionDays * 24 * 60 * 60 * 1000;
  const current = [];
  const archive = [];
  deduplicateItems(items).forEach((item) => {
    const published = new Date(item.publishedAt).getTime();
    if (!Number.isFinite(published) || published < retentionCutoff) return;
    if (published >= currentCutoff) current.push(item); else archive.push(item);
  });
  return { current: current.sort(newestFirst), archive: archive.sort(newestFirst) };
}

function previousItemsForSource(previousDataset, sourceId) {
  return asArray(previousDataset && previousDataset.items)
    .concat(asArray(previousDataset && previousDataset.archive))
    .filter((item) => item && item.sourceId === sourceId);
}

function mergeAcceptedWithPrevious(acceptedItems, previousItems) {
  const accepted = deduplicateItems(acceptedItems);
  const acceptedIds = new Set(accepted.map((item) => item.id));
  const acceptedUrls = new Set(accepted.map((item) => item.url));
  const acceptedGuids = new Set(accepted.filter((item) => item.guid).map((item) => `${item.sourceId}:${normalizeIdentity(item.guid)}`));
  const acceptedTitleDates = new Set(accepted.map((item) => `${item.sourceId}:${normalizeIdentity(item.title)}:${item.publishedAt.slice(0, 10)}`));
  const retainedCandidates = asArray(previousItems).filter((item) => {
    const guidKey = item.guid ? `${item.sourceId}:${normalizeIdentity(item.guid)}` : "";
    const titleDateKey = `${item.sourceId}:${normalizeIdentity(item.title)}:${item.publishedAt.slice(0, 10)}`;
    return !acceptedIds.has(item.id)
      && !acceptedUrls.has(item.url)
      && !(guidKey && acceptedGuids.has(guidKey))
      && !acceptedTitleDates.has(titleDateKey);
  });
  const merged = deduplicateItems(accepted.concat(retainedCandidates));
  const acceptedMergedIds = new Set(accepted.map((item) => item.id));
  return {
    accepted,
    merged,
    retainedItemCount: merged.filter((item) => !acceptedMergedIds.has(item.id)).length
  };
}

function preserveUnchangedRetrievalTimes(items, previousDataset) {
  const previousByIdentity = new Map(
    asArray(previousDataset && previousDataset.items)
      .concat(asArray(previousDataset && previousDataset.archive))
      .filter((item) => item && item.id && item.contentHash)
      .map((item) => [`${item.id}:${item.contentHash}`, item])
  );
  return asArray(items).map((item) => {
    const previous = previousByIdentity.get(`${item.id}:${item.contentHash}`);
    return previous && validIso(previous.retrievedAt) ? { ...item, retrievedAt: previous.retrievedAt } : item;
  });
}

function statusSemanticMaterial(status) {
  if (!status || typeof status !== "object") return status;
  const {
    retrievedAt: _retrievedAt,
    rawItemCount: _rawItemCount,
    rejectedItemCount: _rejectedItemCount,
    ...material
  } = status;
  return material;
}

function preserveUnchangedSourceTimes(statuses, previousDataset) {
  const previousBySource = new Map(asArray(previousDataset && previousDataset.sourceStatuses).map((status) => [status && status.sourceId, status]));
  return asArray(statuses).map((status) => {
    const previous = previousBySource.get(status && status.sourceId);
    if (!previous || stableJson(statusSemanticMaterial(previous)) !== stableJson(statusSemanticMaterial(status))) return status;
    return { ...status, retrievedAt: previous.retrievedAt };
  });
}

function datasetSemanticMaterial(dataset) {
  if (!dataset || typeof dataset !== "object") return dataset;
  const { generatedAt: _generatedAt, ...material } = dataset;
  return {
    ...material,
    sourceStatuses: asArray(material.sourceStatuses).map(statusSemanticMaterial)
  };
}

function boundedStatusError(value, config) {
  const message = cleanText(value && value.message || value);
  return message.slice(0, config.maxStatusErrorCharacters);
}

function boundDataset(candidate, config) {
  const bounded = {
    ...candidate,
    items: asArray(candidate.items).slice(0, config.maxCurrentItems),
    archive: asArray(candidate.archive).slice(0, config.maxArchiveItems)
  };
  const datasetBytes = () => Buffer.byteLength(stableJson(bounded), "utf8");
  while (datasetBytes() > config.maxDatasetBytes && bounded.archive.length) bounded.archive.pop();
  while (datasetBytes() > config.maxDatasetBytes && bounded.items.length) bounded.items.pop();
  if (datasetBytes() > config.maxDatasetBytes) {
    throw new Error(`Medical Updates envelope exceeds the ${config.maxDatasetBytes}-byte browser cache limit even without update items.`);
  }
  return bounded;
}

async function refreshDataset(options = {}) {
  const config = options.config;
  const configValidation = validateConfig(config);
  if (!configValidation.valid) throw new Error(`Medical Updates source registry is invalid: ${configValidation.issues.map((entry) => `${entry.field}: ${entry.message}`).join("; ")}`);
  const now = new Date(options.now || Date.now());
  if (!Number.isFinite(now.getTime())) throw new Error("refreshDataset requires a valid current time.");
  const sourceStatuses = [];
  const collected = [];
  for (const source of config.sources) {
    if (!source.enabled) {
      sourceStatuses.push({ sourceId: source.id, sourceName: source.name, status: "disabled", retrievedAt: null, itemCount: 0, rawItemCount: 0, rejectedItemCount: 0, retainedItemCount: 0, error: null });
      continue;
    }
    const prior = previousItemsForSource(options.previousDataset, source.id);
    const previousStatus = asArray(options.previousDataset && options.previousDataset.sourceStatuses)
      .find((status) => status && status.sourceId === source.id);
    try {
      const feed = await fetchWithPolicy(source.feedUrl, {
        fetchImpl: options.fetchImpl,
        allowedHosts: source.feedHosts,
        timeoutMs: config.requestTimeoutMs,
        maxRedirects: config.maxRedirects,
        maxBytes: config.maxFeedBytes,
        userAgent: config.userAgent
      });
      if (!/(?:rss|atom|xml|text\/plain)/i.test(feed.contentType || "") && !/^\s*<\?xml|^\s*<(?:rss|feed)\b/i.test(feed.text)) {
        throw new Error(`Official feed returned unsupported content type: ${feed.contentType || "unknown"}.`);
      }
      const rawRows = parseOfficialFeed(feed.text).slice(0, config.maxItemsPerSource);
      const normalized = [];
      let eligibleItemCount = 0;
      let failedEligibleItemCount = 0;
      for (const row of rawRows) {
        if (!feedItemEligibility(row, source, config, now).eligible) continue;
        eligibleItemCount += 1;
        try {
          const item = await normalizeFeedItem(row, source, config, { now, fetchImpl: options.fetchImpl, catalog: options.catalog });
          if (item) normalized.push(item);
        } catch (_error) {
          failedEligibleItemCount += 1;
        }
      }
      if (eligibleItemCount > 0 && failedEligibleItemCount === eligibleItemCount) {
        throw new Error(`All ${eligibleItemCount} eligible feed items failed deterministic destination or item validation.`);
      }
      const mergedResult = mergeAcceptedWithPrevious(normalized, prior);
      collected.push(...mergedResult.merged);
      const partiallyDegraded = failedEligibleItemCount > 0;
      sourceStatuses.push({
        sourceId: source.id,
        sourceName: source.name,
        status: partiallyDegraded ? "stale" : "current",
        retrievedAt: now.toISOString(),
        itemCount: mergedResult.accepted.length,
        rawItemCount: rawRows.length,
        rejectedItemCount: rawRows.length - mergedResult.accepted.length,
        retainedItemCount: mergedResult.retainedItemCount,
        error: partiallyDegraded
          ? boundedStatusError(`Partial item routing failure: ${failedEligibleItemCount} of ${eligibleItemCount} eligible feed items failed deterministic normalization; last-good source items were retained.`, config)
          : null
      });
    } catch (error) {
      collected.push(...prior);
      sourceStatuses.push({
        sourceId: source.id,
        sourceName: source.name,
        status: "stale",
        retrievedAt: previousStatus && validIso(previousStatus.retrievedAt) ? previousStatus.retrievedAt : null,
        itemCount: 0,
        rawItemCount: 0,
        rejectedItemCount: 0,
        retainedItemCount: prior.length,
        error: boundedStatusError(error, config)
      });
    }
  }
  const stableItems = preserveUnchangedRetrievalTimes(collected, options.previousDataset);
  const partitioned = partitionItems(stableItems, now, config.currentWindowDays, config.archiveRetentionDays);
  const enabledStatuses = sourceStatuses.filter((status) => status.status !== "disabled");
  const currentCount = enabledStatuses.filter((status) => status.status === "current").length;
  const refreshStatus = currentCount === enabledStatuses.length
    ? "CURRENT"
    : currentCount > 0
      ? "PARTIAL"
      : "STALE";
  const candidate = boundDataset({
    schemaVersion: DATASET_SCHEMA,
    datasetVersion: config.datasetVersion,
    generatorVersion: GENERATOR_VERSION,
    generatedAt: now.toISOString(),
    refreshStatus,
    currentWindowDays: config.currentWindowDays,
    archiveRetentionDays: config.archiveRetentionDays,
    sourceConfigSha256: options.configSha256 || sha256(stableJson(config)),
    aiCalls: 0,
    sourceStatuses,
    items: partitioned.current,
    archive: partitioned.archive
  }, config);
  if (options.previousDataset
    && stableJson(datasetSemanticMaterial(options.previousDataset)) === stableJson(datasetSemanticMaterial(candidate))) {
    return options.previousDataset;
  }
  return candidate;
}

function validateRelatedReference(reference, field, catalog, add) {
  if (!reference || typeof reference !== "object" || Array.isArray(reference)) {
    add("medical-updates-related-card-invalid", field, "Each related-card reference must be an object.", reference);
    return;
  }
  if (!cleanText(reference.collection) || !cleanText(reference.canonicalTitle)) {
    add("medical-updates-related-card-identity-missing", field, "A related card requires collection and canonicalTitle.", reference);
    return;
  }
  if (catalog) {
    const matches = resolveRelatedCard(catalog, reference);
    if (!matches.length) add("medical-updates-related-card-missing", field, "The related card does not resolve by exact canonical identity.", reference);
    else if (matches.length > 1) add("medical-updates-related-card-ambiguous", field, "The related card resolves to more than one canonical ANI card.", reference);
  }
}

function validateDataset(dataset, options = {}) {
  const issues = [];
  const add = (code, field, message, value, blocking = true) => issues.push({ code, field, message, value, blocking });
  const config = options.config;
  if (!dataset || typeof dataset !== "object" || Array.isArray(dataset)) {
    add("medical-updates-dataset-invalid", "dataset", "The generated dataset must be an object.", dataset);
    return { valid: false, issues };
  }
  if (dataset.schemaVersion !== DATASET_SCHEMA) add("medical-updates-dataset-schema-invalid", "schemaVersion", `Expected ${DATASET_SCHEMA}.`, dataset.schemaVersion);
  if (dataset.generatorVersion !== GENERATOR_VERSION) add("medical-updates-generator-version-drift", "generatorVersion", `Expected ${GENERATOR_VERSION}.`, dataset.generatorVersion);
  if (!validIso(dataset.generatedAt)) add("medical-updates-generated-at-invalid", "generatedAt", "generatedAt must be an ISO UTC timestamp.", dataset.generatedAt);
  if (!REFRESH_STATUS_VALUES.includes(dataset.refreshStatus)) add("medical-updates-refresh-status-invalid", "refreshStatus", "refreshStatus is invalid.", dataset.refreshStatus);
  if (dataset.aiCalls !== 0) add("medical-updates-ai-usage-nonzero", "aiCalls", "Medical Updates must remain zero-AI.", dataset.aiCalls);
  if (config) {
    if (!cleanText(dataset.datasetVersion) || cleanText(dataset.datasetVersion).length > config.maxDatasetVersionCharacters) add("medical-updates-dataset-version-invalid", "datasetVersion", `datasetVersion must be nonblank and at most ${config.maxDatasetVersionCharacters} characters.`, dataset.datasetVersion);
    if (!cleanText(dataset.generatorVersion) || cleanText(dataset.generatorVersion).length > config.maxGeneratorVersionCharacters) add("medical-updates-generator-version-invalid", "generatorVersion", `generatorVersion must be nonblank and at most ${config.maxGeneratorVersionCharacters} characters.`, dataset.generatorVersion);
    if (dataset.datasetVersion !== config.datasetVersion) add("medical-updates-dataset-version-drift", "datasetVersion", "datasetVersion does not match the source registry.", dataset.datasetVersion);
    if (dataset.currentWindowDays !== config.currentWindowDays || dataset.archiveRetentionDays !== config.archiveRetentionDays) add("medical-updates-retention-config-drift", "currentWindowDays/archiveRetentionDays", "Dataset retention windows do not match the source registry.", { currentWindowDays: dataset.currentWindowDays, archiveRetentionDays: dataset.archiveRetentionDays });
    if (options.configSha256 && dataset.sourceConfigSha256 !== options.configSha256) add("medical-updates-config-hash-drift", "sourceConfigSha256", "The generated dataset is not bound to the current source registry bytes.", dataset.sourceConfigSha256);
    const datasetBytes = Buffer.byteLength(stableJson(dataset), "utf8");
    if (datasetBytes > config.maxDatasetBytes) add("medical-updates-dataset-size-limit-exceeded", "dataset", `Dataset exceeds the ${config.maxDatasetBytes}-byte browser cache limit.`, datasetBytes);
  }
  const sourceById = new Map(asArray(config && config.sources).map((source) => [source.id, source]));
  const statusIds = new Set();
  if (!Array.isArray(dataset.sourceStatuses) || (config && dataset.sourceStatuses.length > config.maxSources)) add("medical-updates-source-statuses-invalid", "sourceStatuses", `sourceStatuses must be an array with at most ${config && config.maxSources || 30} rows.`, dataset.sourceStatuses);
  asArray(dataset.sourceStatuses).forEach((status, index) => {
    const field = `sourceStatuses[${index}]`;
    const configuredSource = status && sourceById.get(status.sourceId);
    if (!status || !configuredSource) add("medical-updates-source-status-unknown", field, "Source status must reference a configured source.", status);
    if (configuredSource && status.sourceName !== configuredSource.name) add("medical-updates-source-status-name-drift", `${field}.sourceName`, "Source status name must match the configured official source name.", status.sourceName);
    if (statusIds.has(status && status.sourceId)) add("medical-updates-source-status-duplicate", field, "Each configured source may have one status.", status && status.sourceId); else statusIds.add(status && status.sourceId);
    if (!SOURCE_STATUS_VALUES.includes(status && status.status)) add("medical-updates-source-status-invalid", `${field}.status`, "Source status is invalid.", status && status.status);
    if (status && status.status === "current" && !validIso(status.retrievedAt)) add("medical-updates-source-retrieved-at-invalid", `${field}.retrievedAt`, "A current source needs an ISO retrieval time.", status.retrievedAt);
    if (status && status.retrievedAt !== null && !validIso(status.retrievedAt)) add("medical-updates-source-retrieved-at-invalid", `${field}.retrievedAt`, "retrievedAt must be null or an ISO UTC timestamp.", status.retrievedAt);
    if (status && status.error !== null && typeof status.error !== "string") add("medical-updates-source-error-invalid", `${field}.error`, "Source error must be null or text.", status.error);
    if (status && typeof status.error === "string" && config && status.error.length > config.maxStatusErrorCharacters) add("medical-updates-source-error-too-long", `${field}.error`, `Source error must not exceed ${config.maxStatusErrorCharacters} characters.`, status.error.length);
    ["itemCount", "rawItemCount", "rejectedItemCount", "retainedItemCount"].forEach((countField) => {
      if (!status || !Number.isInteger(status[countField]) || status[countField] < 0) add("medical-updates-source-status-count-invalid", `${field}.${countField}`, `${countField} must be a nonnegative integer.`, status && status[countField]);
    });
  });
  if (config) config.sources.forEach((source) => {
    if (!statusIds.has(source.id)) add("medical-updates-source-status-missing", "sourceStatuses", "Every configured source requires a status row.", source.id);
  });
  const allItems = [];
  [["items", dataset.items], ["archive", dataset.archive]].forEach(([section, values]) => {
    if (!Array.isArray(values)) {
      add("medical-updates-item-array-invalid", section, `${section} must be an array.`, values);
      return;
    }
    const maximum = section === "items" ? config && config.maxCurrentItems : config && config.maxArchiveItems;
    if (maximum && values.length > maximum) add("medical-updates-item-count-limit-exceeded", section, `${section} exceeds the ${maximum}-item browser limit.`, values.length);
    values.forEach((item, index) => allItems.push({ item, field: `${section}[${index}]`, section }));
    const sorted = values.slice().sort(newestFirst).map((item) => item && item.id);
    if (JSON.stringify(values.map((item) => item && item.id)) !== JSON.stringify(sorted)) add("medical-updates-sort-order-invalid", section, `${section} must be sorted newest first.`, values.map((item) => item && item.id));
  });
  const seenIds = new Set();
  const seenUrls = new Set();
  const seenGuid = new Set();
  const seenTitleDate = new Set();
  const generatedTime = new Date(dataset.generatedAt).getTime();
  const currentCutoff = generatedTime - Number(dataset.currentWindowDays) * 86400000;
  const retentionCutoff = generatedTime - Number(dataset.archiveRetentionDays) * 86400000;
  allItems.forEach(({ item, field, section }) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      add("medical-updates-item-invalid", field, "Each update must be an object.", item);
      return;
    }
    const source = sourceById.get(item.sourceId);
    if (!source) add("medical-updates-item-source-invalid", `${field}.sourceId`, "The item source is not configured.", item.sourceId);
    if (source && item.sourceName !== source.name) add("medical-updates-item-source-name-drift", `${field}.sourceName`, "The item source name does not match the configured official name.", item.sourceName);
    if (!/^medical-update:[a-z0-9-]+:[a-f0-9]{24}$/.test(String(item.id || ""))) add("medical-updates-item-id-invalid", `${field}.id`, "Item ID must be a stable source-prefixed hash.", item.id);
    if (config && String(item.id || "").length > config.maxItemIdCharacters) add("medical-updates-item-id-too-long", `${field}.id`, `Item ID must not exceed ${config.maxItemIdCharacters} characters.`, item.id);
    if (config && cleanText(item.sourceName).length > config.maxSourceNameCharacters) add("medical-updates-item-source-name-too-long", `${field}.sourceName`, `Source name must not exceed ${config.maxSourceNameCharacters} characters.`, item.sourceName);
    if (seenIds.has(item.id)) add("medical-updates-item-id-duplicate", `${field}.id`, "Item IDs must be unique.", item.id); else seenIds.add(item.id);
    if (!validIso(item.publishedAt)) add("medical-updates-publication-date-invalid", `${field}.publishedAt`, "publishedAt must be an ISO UTC timestamp.", item.publishedAt);
    const publishedTime = new Date(item.publishedAt).getTime();
    if (source && Number.isFinite(publishedTime) && Number.isFinite(generatedTime) && publishedTime > generatedTime + Number(config.futureDateToleranceHours) * 3600000) add("medical-updates-future-date-invalid", `${field}.publishedAt`, "Publication date exceeds the configured future tolerance.", item.publishedAt);
    if (section === "items" && publishedTime < currentCutoff) add("medical-updates-current-item-too-old", field, "Current items must be inside the current window.", item.publishedAt);
    if (section === "archive" && publishedTime >= currentCutoff) add("medical-updates-archive-item-too-new", field, "Archived items must be older than the current window.", item.publishedAt);
    if (publishedTime < retentionCutoff) add("medical-updates-item-beyond-retention", field, "Items beyond archive retention must be removed.", item.publishedAt);
    if (!cleanText(item.title) || /<[^>]+>/.test(item.title)) add("medical-updates-title-invalid", `${field}.title`, "Title must be nonblank source-provided plain text.", item.title);
    if (config && typeof item.title === "string" && item.title.length > config.maxTitleCharacters) add("medical-updates-title-too-long", `${field}.title`, `Title must not exceed ${config.maxTitleCharacters} characters.`, item.title.length);
    if (!DESCRIPTION_ORIGINS.includes(item.descriptionOrigin)) add("medical-updates-description-origin-invalid", `${field}.descriptionOrigin`, "Description origin is invalid.", item.descriptionOrigin);
    if (item.descriptionOrigin === "source-provided" && (!cleanText(item.description) || /<[^>]+>/.test(item.description))) add("medical-updates-description-invalid", `${field}.description`, "Source-provided descriptions must be nonblank plain text.", item.description);
    if (config && typeof item.description === "string" && item.description.length > config.maxDescriptionCharacters) add("medical-updates-description-too-long", `${field}.description`, `Description must not exceed ${config.maxDescriptionCharacters} characters.`, item.description.length);
    if (item.descriptionOrigin === "unavailable" && item.description !== null) add("medical-updates-unavailable-description-not-null", `${field}.description`, "Unavailable descriptions must be null.", item.description);
    if (!validIso(item.retrievedAt)) add("medical-updates-item-retrieved-at-invalid", `${field}.retrievedAt`, "retrievedAt must be an ISO UTC timestamp.", item.retrievedAt);
    if (!config || !config.categories.includes(item.category)) add("medical-updates-category-invalid", `${field}.category`, "Item category is not registered.", item.category);
    if (!Array.isArray(item.sourceCategories) || item.sourceCategories.some((value) => typeof value !== "string" || !value.trim())) add("medical-updates-source-categories-invalid", `${field}.sourceCategories`, "sourceCategories must contain only nonblank text.", item.sourceCategories);
    if (config && Array.isArray(item.sourceCategories) && item.sourceCategories.length > config.maxSourceCategoriesPerItem) add("medical-updates-source-category-count-exceeded", `${field}.sourceCategories`, `sourceCategories must not exceed ${config.maxSourceCategoriesPerItem} entries.`, item.sourceCategories.length);
    if (config && Array.isArray(item.sourceCategories) && item.sourceCategories.some((value) => typeof value === "string" && value.length > config.maxSourceCategoryCharacters)) add("medical-updates-source-category-too-long", `${field}.sourceCategories`, `Each source category must not exceed ${config.maxSourceCategoryCharacters} characters.`, item.sourceCategories);
    let parsedUrl;
    try { parsedUrl = new URL(item.url); } catch (_error) { parsedUrl = null; }
    if (!parsedUrl || parsedUrl.protocol !== "https:" || !source || !source.finalItemHosts.includes(parsedUrl.hostname)) add("medical-updates-official-url-invalid", `${field}.url`, "Item URL must be a direct HTTPS destination on the configured official final host.", item.url);
    if (config && typeof item.url === "string" && item.url.length > config.maxUrlCharacters) add("medical-updates-url-too-long", `${field}.url`, `Item URL must not exceed ${config.maxUrlCharacters} characters.`, item.url.length);
    if (source && source.intermediateItemHosts.includes(parsedUrl && parsedUrl.hostname)) add("medical-updates-intermediate-url-persisted", `${field}.url`, "Intermediate downloader URLs must never be persisted.", item.url);
    if (seenUrls.has(item.url)) add("medical-updates-url-duplicate", `${field}.url`, "Direct publication URLs must be unique.", item.url); else seenUrls.add(item.url);
    const guidKey = item.guid ? `${item.sourceId}:${normalizeIdentity(item.guid)}` : "";
    if (config && typeof item.guid === "string" && item.guid.length > config.maxGuidCharacters) add("medical-updates-guid-too-long", `${field}.guid`, `Source GUID must not exceed ${config.maxGuidCharacters} characters.`, item.guid.length);
    if (guidKey && seenGuid.has(guidKey)) add("medical-updates-guid-duplicate", `${field}.guid`, "Source GUIDs must be unique within a source.", item.guid); else if (guidKey) seenGuid.add(guidKey);
    const titleDateKey = `${item.sourceId}:${normalizeIdentity(item.title)}:${String(item.publishedAt || "").slice(0, 10)}`;
    if (seenTitleDate.has(titleDateKey)) add("medical-updates-title-date-duplicate", field, "Same-source title/date duplicates must be collapsed.", titleDateKey); else seenTitleDate.add(titleDateKey);
    if (!Array.isArray(item.relatedCards)) add("medical-updates-related-cards-invalid", `${field}.relatedCards`, "relatedCards must be an array.", item.relatedCards);
    if (config && Array.isArray(item.relatedCards) && item.relatedCards.length > config.maxRelatedCardsPerItem) add("medical-updates-related-card-count-exceeded", `${field}.relatedCards`, `relatedCards must not exceed ${config.maxRelatedCardsPerItem} entries.`, item.relatedCards.length);
    if (config && Array.isArray(item.relatedCards)) item.relatedCards.forEach((reference, index) => {
      if (reference && typeof reference === "object" && !Array.isArray(reference)) {
        if (cleanText(reference.collection).length > config.maxRelatedCollectionCharacters) add("medical-updates-related-collection-too-long", `${field}.relatedCards[${index}].collection`, `Related collection must not exceed ${config.maxRelatedCollectionCharacters} characters.`, reference.collection);
        if (cleanText(reference.canonicalTitle).length > config.maxRelatedTitleCharacters) add("medical-updates-related-title-too-long", `${field}.relatedCards[${index}].canonicalTitle`, `Related title must not exceed ${config.maxRelatedTitleCharacters} characters.`, reference.canonicalTitle);
      }
    });
    asArray(item.relatedCards).forEach((reference, index) => validateRelatedReference(reference, `${field}.relatedCards[${index}]`, options.catalog, add));
    if (!/^[a-f0-9]{64}$/.test(String(item.contentHash || "")) || item.contentHash !== itemContentHash(item)) add("medical-updates-content-hash-invalid", `${field}.contentHash`, "contentHash must match the exact source-provided item fields.", item.contentHash);
  });
  return { valid: issues.length === 0, issues };
}

function runtimePayload(dataset) {
  return { ...dataset, schemaVersion: RUNTIME_SCHEMA };
}

function renderRuntime(dataset) {
  return `// Generated by scripts/ani-medical-updates.js from data/medical-updates.json. Do not hand-edit.\n(function (root) {\n  \"use strict\";\n  root.ANI_MEDICAL_UPDATES = ${JSON.stringify(runtimePayload(dataset), null, 2)};\n}(typeof window !== \"undefined\" ? window : globalThis));\n`;
}

function atomicWrite(filePath, bytes) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp-${process.pid}-${crypto.randomBytes(5).toString("hex")}`;
  fs.writeFileSync(temporaryPath, bytes);
  fs.renameSync(temporaryPath, filePath);
}

function checkProject(root = ROOT, options = {}) {
  const project = loadProject(root);
  const configValidation = validateConfig(project.config);
  const datasetValidation = project.dataset
    ? validateDataset(project.dataset, { config: project.config, configSha256: project.configSha256, catalog: options.catalog })
    : { valid: false, issues: [{ code: "medical-updates-dataset-missing", field: DATA_RELATIVE_PATH, message: "The generated dataset is missing.", blocking: true }] };
  const expectedRuntime = project.dataset ? renderRuntime(project.dataset) : "";
  return {
    project,
    configValidation,
    datasetValidation,
    runtimeCurrent: Boolean(project.dataset) && project.runtime === expectedRuntime,
    expectedRuntime,
    expectedRuntimeSha256: sha256(expectedRuntime),
    actualRuntimeSha256: sha256(project.runtime)
  };
}

function writeDataset(root, dataset) {
  const paths = projectPaths(root);
  const dataBytes = stableJson(dataset);
  const runtimeBytes = renderRuntime(JSON.parse(dataBytes));
  const dataCurrent = fs.existsSync(paths.dataPath) && fs.readFileSync(paths.dataPath, "utf8") === dataBytes;
  const runtimeCurrent = fs.existsSync(paths.runtimePath) && fs.readFileSync(paths.runtimePath, "utf8") === runtimeBytes;
  if (!dataCurrent) atomicWrite(paths.dataPath, dataBytes);
  if (!runtimeCurrent) atomicWrite(paths.runtimePath, runtimeBytes);
  return {
    dataPath: paths.dataPath,
    runtimePath: paths.runtimePath,
    dataSha256: sha256(dataBytes),
    runtimeSha256: sha256(runtimeBytes),
    changed: !dataCurrent || !runtimeCurrent,
    dataChanged: !dataCurrent,
    runtimeChanged: !runtimeCurrent
  };
}

module.exports = {
  ROOT,
  CONFIG_SCHEMA,
  DATASET_SCHEMA,
  RUNTIME_SCHEMA,
  GENERATOR_VERSION,
  CONFIG_RELATIVE_PATH,
  DATA_RELATIVE_PATH,
  RUNTIME_RELATIVE_PATH,
  SOURCE_STATUS_VALUES,
  REFRESH_STATUS_VALUES,
  DESCRIPTION_ORIGINS,
  sha256,
  stableJson,
  cleanText,
  normalizeIdentity,
  sourcePlainText,
  asArray,
  validIso,
  isoDate,
  projectPaths,
  loadProject,
  validateConfig,
  parseOfficialFeed,
  classifyItem,
  canonicalUrl,
  fetchWithPolicy,
  resolveOfficialItemUrl,
  resolveRelatedCard,
  catalogRelatedCardRules,
  relatedCardsForText,
  itemContentHash,
  normalizeFeedItem,
  newestFirst,
  deduplicateItems,
  partitionItems,
  previousItemsForSource,
  preserveUnchangedRetrievalTimes,
  preserveUnchangedSourceTimes,
  datasetSemanticMaterial,
  refreshDataset,
  validateDataset,
  runtimePayload,
  renderRuntime,
  atomicWrite,
  checkProject,
  writeDataset
};
