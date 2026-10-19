#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export function updateSnapshotPr({ repo, branch, title, bodyFile }, run = execFileSync) {
  for (const [key, value] of Object.entries({ repo, branch, title, bodyFile })) {
    if (typeof value !== "string" || !value.trim()) throw new Error(`missing ${key}`);
  }
  const invoke = (args) => run("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const prs = JSON.parse(invoke([
    "pr", "list", "--repo", repo, "--base", "main", "--head", branch,
    "--state", "open", "--limit", "2", "--json", "number,state",
  ]));
  if (!Array.isArray(prs) || prs.length > 1 || prs.some((pr) =>
    pr.state !== "OPEN" || !Number.isSafeInteger(pr.number) || pr.number <= 0)) {
    throw new Error("expected at most one open snapshot pull request");
  }
  if (prs.length === 1) {
    return invoke(["pr", "edit", String(prs[0].number), "--repo", repo, "--body-file", bodyFile]);
  }
  return invoke([
    "pr", "create", "--repo", repo, "--base", "main", "--head", branch,
    "--title", title, "--body-file", bodyFile,
  ]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const options = {};
    const names = { "--repo": "repo", "--branch": "branch", "--title": "title", "--body-file": "bodyFile" };
    for (let i = 2; i < process.argv.length; i += 2) {
      const name = names[process.argv[i]];
      if (!name || !process.argv[i + 1]) throw new Error(`invalid option: ${process.argv[i]}`);
      options[name] = process.argv[i + 1];
    }
    process.stdout.write(updateSnapshotPr(options));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
