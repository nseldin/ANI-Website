"use strict";

const path = require("node:path");
const updates = require("./lib/medical-updates");

const COMMANDS = new Set(["status", "check", "build", "refresh"]);

function parseArguments(argv = process.argv.slice(2)) {
  const values = Array.from(argv);
  let command = "status";
  let root = updates.ROOT;
  let useRuntimeCatalog = false;
  for (let index = 0; index < values.length; index += 1) {
    const value = String(values[index]);
    if (COMMANDS.has(value.toLowerCase())) command = value.toLowerCase();
    else if (value === "--root" && values[index + 1]) root = path.resolve(values[++index]);
    else if (value.startsWith("--root=")) root = path.resolve(value.slice("--root=".length));
    else if (value === "--with-runtime-catalog") useRuntimeCatalog = true;
    else throw new Error(`Unknown Medical Updates option: ${value}`);
  }
  return { command, root, useRuntimeCatalog };
}

function buildCatalog(root) {
  const { buildRuntimeCatalog } = require("./validator/lib/runtime-catalog");
  return buildRuntimeCatalog(root);
}

function responseForCheck(command, result) {
  const issues = result.configValidation.issues.concat(result.datasetValidation.issues);
  const staleSources = result.project.dataset
    ? result.project.dataset.sourceStatuses.filter((row) => row.status === "stale").map((row) => row.sourceId)
    : [];
  return {
    status: result.configValidation.valid && result.datasetValidation.valid && result.runtimeCurrent ? "PASS" : "FAIL",
    command,
    refreshStatus: result.project.dataset && result.project.dataset.refreshStatus || "MISSING",
    currentItems: result.project.dataset && result.project.dataset.items.length || 0,
    archivedItems: result.project.dataset && result.project.dataset.archive.length || 0,
    staleSources,
    sourceConfigSha256: result.project.configSha256,
    runtimeCurrent: result.runtimeCurrent,
    expectedRuntimeSha256: result.expectedRuntimeSha256,
    actualRuntimeSha256: result.actualRuntimeSha256,
    issues,
    aiCalls: 0
  };
}

async function main(commandValue = process.argv[2], output = console, options = {}) {
  const command = String(commandValue || "status").toLowerCase();
  const root = path.resolve(options.root || updates.ROOT);
  if (!COMMANDS.has(command)) {
    output.error(JSON.stringify({ status: "FAIL", command, error: "unknown-command", allowedCommands: Array.from(COMMANDS), aiCalls: 0 }, null, 2));
    return 1;
  }
  if (command === "refresh") {
    const project = updates.loadProject(root);
    const configValidation = updates.validateConfig(project.config);
    if (!configValidation.valid) {
      output.error(JSON.stringify({ status: "FAIL", command, issues: configValidation.issues, aiCalls: 0 }, null, 2));
      return 1;
    }
    const catalog = options.catalog || (options.useRuntimeCatalog ? buildCatalog(root) : null);
    const dataset = await updates.refreshDataset({
      config: project.config,
      configSha256: project.configSha256,
      previousDataset: project.dataset,
      fetchImpl: options.fetchImpl,
      now: options.now,
      catalog
    });
    const validation = updates.validateDataset(dataset, { config: project.config, configSha256: project.configSha256, catalog });
    if (!validation.valid) {
      output.error(JSON.stringify({ status: "FAIL", command, issues: validation.issues, aiCalls: 0 }, null, 2));
      return 1;
    }
    const written = updates.writeDataset(root, dataset);
    output.log(JSON.stringify({
      status: "PASS",
      command,
      refreshStatus: dataset.refreshStatus,
      currentItems: dataset.items.length,
      archivedItems: dataset.archive.length,
      sources: dataset.sourceStatuses,
      dataPath: path.relative(root, written.dataPath).replace(/\\/g, "/"),
      runtimePath: path.relative(root, written.runtimePath).replace(/\\/g, "/"),
      dataSha256: written.dataSha256,
      runtimeSha256: written.runtimeSha256,
      changed: written.changed,
      aiCalls: 0
    }, null, 2));
    return 0;
  }
  const catalog = options.catalog || (options.useRuntimeCatalog ? buildCatalog(root) : null);
  let checked = updates.checkProject(root, { catalog });
  if (command === "build") {
    if (!checked.configValidation.valid || !checked.datasetValidation.valid) {
      output.error(JSON.stringify(responseForCheck(command, checked), null, 2));
      return 1;
    }
    updates.atomicWrite(checked.project.runtimePath, checked.expectedRuntime);
    checked = updates.checkProject(root, { catalog });
  }
  const response = responseForCheck(command, checked);
  output.log(JSON.stringify(response, null, 2));
  return command === "status" ? 0 : response.status === "PASS" ? 0 : 1;
}

if (require.main === module) {
  let parsed;
  try {
    parsed = parseArguments();
  } catch (error) {
    console.error(error && error.message || String(error));
    process.exitCode = 1;
  }
  if (parsed) main(parsed.command, console, { root: parsed.root, useRuntimeCatalog: parsed.useRuntimeCatalog }).then((exitCode) => { process.exitCode = exitCode; }).catch((error) => {
    console.error(error && error.stack || String(error));
    process.exitCode = 1;
  });
}

module.exports = {
  COMMANDS,
  parseArguments,
  buildCatalog,
  responseForCheck,
  main
};
