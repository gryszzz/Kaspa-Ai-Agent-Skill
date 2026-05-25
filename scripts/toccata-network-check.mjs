#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = process.cwd();
const DEFAULT_FIXTURE = path.join(ROOT_DIR, "fixtures", "toccata", "network-endpoint-check-basic.json");
const DEFAULT_STALE_THRESHOLD_DAA_SCORE = 1000;

function readArgValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function parseEndpointEnv(envName, group, expectedNetworkName, fallbackUrl) {
  const value = process.env[envName] || fallbackUrl;
  return value
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url, index) => ({
      group,
      label: `${group.toLowerCase()}-${index + 1}`,
      url,
      expectedNetworkName,
    }));
}

async function fetchWithTimeout(url, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "gryszzz-kaspa-toccata-network-check",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function readLiveEndpoint(endpoint) {
  try {
    const response = await fetchWithTimeout(endpoint.url);
    const data = await response.json();
    return {
      ...endpoint,
      ok: response.ok,
      status: response.status,
      networkName: data.networkName ?? null,
      virtualDaaScore: Number(data.virtualDaaScore ?? 0),
      blockCount: Number(data.blockCount ?? 0),
      headerCount: Number(data.headerCount ?? 0),
    };
  } catch (error) {
    return {
      ...endpoint,
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

function readFixtureEndpoint(endpoint) {
  const response = endpoint.response || {};
  return {
    group: endpoint.group,
    label: endpoint.label,
    url: endpoint.url,
    expectedNetworkName: endpoint.expectedNetworkName,
    ok: Boolean(response.ok),
    status: response.status ?? 0,
    error: response.error || null,
    networkName: response.networkName ?? null,
    virtualDaaScore: Number(response.virtualDaaScore ?? 0),
    blockCount: Number(response.blockCount ?? 0),
    headerCount: Number(response.headerCount ?? 0),
  };
}

function issue(level, code, endpoint, message) {
  return {
    level,
    code,
    group: endpoint.group,
    label: endpoint.label,
    url: endpoint.url,
    message,
  };
}

function assess(endpoints, staleThresholdDaaScore) {
  const issues = [];
  const groups = new Map();

  for (const endpoint of endpoints) {
    if (!groups.has(endpoint.group)) {
      groups.set(endpoint.group, []);
    }
    groups.get(endpoint.group).push(endpoint);

    if (!endpoint.ok) {
      issues.push(issue("error", "endpoint_unavailable", endpoint, endpoint.error || `HTTP ${endpoint.status}`));
      continue;
    }

    if (endpoint.networkName !== endpoint.expectedNetworkName) {
      issues.push(
        issue(
          "error",
          "network_name_mismatch",
          endpoint,
          `expected ${endpoint.expectedNetworkName}, got ${endpoint.networkName || "missing"}`,
        ),
      );
    }
  }

  for (const [group, groupEndpoints] of groups.entries()) {
    const healthy = groupEndpoints.filter((endpoint) => endpoint.ok);
    if (healthy.length < 2) {
      issues.push(
        issue(
          "warning",
          "single_endpoint_group",
          groupEndpoints[0],
          `${group} has ${healthy.length} healthy endpoint(s), so freshness cannot be cross-checked`,
        ),
      );
      continue;
    }

    const maxDaaScore = Math.max(...healthy.map((endpoint) => endpoint.virtualDaaScore));
    for (const endpoint of healthy) {
      const lag = maxDaaScore - endpoint.virtualDaaScore;
      if (lag > staleThresholdDaaScore) {
        issues.push(
          issue(
            "warning",
            "stale_endpoint",
            endpoint,
            `virtualDaaScore lags group max by ${lag}, above threshold ${staleThresholdDaaScore}`,
          ),
        );
      }
    }
  }

  return {
    endpoints,
    issues,
    summary: {
      endpointCount: endpoints.length,
      hardIssueCount: issues.filter((entry) => entry.level === "error").length,
      warningIssueCount: issues.filter((entry) => entry.level === "warning").length,
      staleEndpointCount: issues.filter((entry) => entry.code === "stale_endpoint").length,
      networkMismatchCount: issues.filter((entry) => entry.code === "network_name_mismatch").length,
    },
  };
}

function assertExpected(report, expected) {
  const errors = [];
  if (!expected) {
    return errors;
  }

  for (const [field, expectedValue] of Object.entries(expected)) {
    const actualValue = report.summary[field];
    if (actualValue !== expectedValue) {
      errors.push(`expected ${field} ${expectedValue}, got ${actualValue}`);
    }
  }

  return errors;
}

async function main() {
  const check = process.argv.includes("--check");
  const live = process.argv.includes("--live");

  let fixture = null;
  let endpoints = [];
  let staleThresholdDaaScore = DEFAULT_STALE_THRESHOLD_DAA_SCORE;

  if (live) {
    const configured = [
      ...parseEndpointEnv("TOCCATA_TN10_ENDPOINTS", "TN10", "kaspa-testnet-10", "https://api-tn10.kaspa.org/info/blockdag"),
      ...parseEndpointEnv("TOCCATA_TN12_ENDPOINTS", "TN12", "kaspa-testnet-12", "https://api-tn12.kaspa.org/info/blockdag"),
    ];
    endpoints = await Promise.all(configured.map(readLiveEndpoint));
  } else {
    const fixturePath = readArgValue("--fixture") || DEFAULT_FIXTURE;
    fixture = JSON.parse(await readFile(fixturePath, "utf8"));
    staleThresholdDaaScore = Number(fixture.staleThresholdDaaScore ?? DEFAULT_STALE_THRESHOLD_DAA_SCORE);
    endpoints = (fixture.endpoints || []).map(readFixtureEndpoint);
  }

  const report = assess(endpoints, staleThresholdDaaScore);

  if (check) {
    const errors = assertExpected(report, fixture?.expected);
    if (errors.length) {
      for (const error of errors) {
        console.error(`check failed: ${error}`);
      }
      process.exitCode = 1;
      return;
    }
    console.log(
      `network endpoint check passed: ${report.summary.endpointCount} endpoint(s), ${report.summary.hardIssueCount} hard issue(s), ${report.summary.warningIssueCount} warning(s).`,
    );
    return;
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
