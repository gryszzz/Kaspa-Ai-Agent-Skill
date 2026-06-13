#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(scriptDir, "..");

function parseArgs(argv) {
  const options = {
    repoRoot: defaultRepoRoot,
    checkRemote: false,
  };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        break;
      case "--check-remote":
        options.checkRemote = true;
        break;
      case "--repo-root":
        options.repoRoot = path.resolve(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  return options;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function requireCondition(condition, message, failures) {
  if (!condition) failures.push(message);
}

function validateLocal(repoRoot) {
  const failures = [];
  const skillRoot = path.join(repoRoot, "skills", "public", "kaspa-sovereign-architect-engine");
  const manifest = readJson(path.join(skillRoot, "manifest.json"));
  const releaseMetadata = readJson(path.join(repoRoot, "release-metadata.json"));
  const readme = readFileSync(path.join(repoRoot, "README.md"), "utf8");
  const version = manifest.version;
  const versionTag = `v${version}`;

  requireCondition(/^\d+\.\d+\.\d+$/.test(version), `manifest version is not semver: ${version}`, failures);
  requireCondition(
    releaseMetadata.repositoryVersion === version,
    `release metadata repositoryVersion ${releaseMetadata.repositoryVersion} != manifest ${version}`,
    failures,
  );
  requireCondition(
    releaseMetadata.repositoryReleaseStatus === "unpublished",
    "repository release status must remain unpublished before tagging",
    failures,
  );
  requireCondition(
    releaseMetadata.publishedRelease !== versionTag,
    "published release must be tracked separately from the unpublished repository version",
    failures,
  );

  const notesPath = path.join(repoRoot, releaseMetadata.nextReleaseNotes);
  const notes = readFileSync(notesPath, "utf8");
  requireCondition(
    releaseMetadata.nextReleaseNotes === `release-notes/${versionTag}.md`,
    `next release notes path does not match ${versionTag}`,
    failures,
  );
  requireCondition(notes.includes(versionTag), `release notes heading missing ${versionTag}`, failures);
  requireCondition(/has not been\s+published|not yet published/i.test(notes), "release notes must say the repository version is unpublished", failures);
  requireCondition(notes.includes(releaseMetadata.publishedRelease), "release notes missing current published release", failures);

  requireCondition(
    readme.includes(`**Published release:** \`${releaseMetadata.publishedRelease}\``),
    "README published release declaration is stale",
    failures,
  );
  requireCondition(
    readme.includes(`**Repository skill version:** \`${versionTag}\``),
    "README repository version declaration is stale",
    failures,
  );
  requireCondition(
    readme.includes(`Latest published release notes: [\`${releaseMetadata.publishedRelease}\`]`),
    "README latest published release notes link is stale",
    failures,
  );
  requireCondition(
    readme.includes(`Next repository release notes: [\`${versionTag}\`]`),
    "README next release notes link is stale",
    failures,
  );

  const adapterDir = path.join(skillRoot, "agents");
  for (const fileName of readdirSync(adapterDir).sort()) {
    const content = readFileSync(path.join(adapterDir, fileName), "utf8");
    const staleVersion = content.match(/\bv1\.\d+\.\d+\b/);
    requireCondition(
      !staleVersion,
      `adapter ${fileName} embeds package version ${staleVersion?.[0]}`,
      failures,
    );
  }

  const packageScript = readFileSync(path.join(skillRoot, "scripts", "package-release.sh"), "utf8");
  requireCondition(
    packageScript.includes('VERSION="$(node -e'),
    "package script must derive its version from manifest.json",
    failures,
  );

  return {
    failures,
    manifestVersion: version,
    publishedRelease: releaseMetadata.publishedRelease,
    repositoryStatus: releaseMetadata.repositoryReleaseStatus,
  };
}

async function validateRemote(publishedRelease) {
  const response = await fetch("https://api.github.com/repos/gryszzz/Kaspa-Ai-Agent-Skill/releases/latest", {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "kaspa-skill-release-validator",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub release lookup failed: HTTP ${response.status}`);
  }
  const latest = await response.json();
  return {
    expected: publishedRelease,
    actual: latest.tag_name,
    publishedAt: latest.published_at,
    url: latest.html_url,
    matches: latest.tag_name === publishedRelease,
  };
}

async function main() {
  try {
    const options = parseArgs(process.argv);
    const local = validateLocal(options.repoRoot);
    const report = {
      schemaVersion: 1,
      passed: local.failures.length === 0,
      ...local,
      remote: null,
    };

    if (options.checkRemote) {
      report.remote = await validateRemote(local.publishedRelease);
      if (!report.remote.matches) {
        report.failures.push(
          `published release metadata ${report.remote.expected} != GitHub latest ${report.remote.actual}`,
        );
        report.passed = false;
      }
    }

    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(report.passed ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

await main();
