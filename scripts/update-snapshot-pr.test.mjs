import assert from "node:assert/strict";
import test from "node:test";
import { updateSnapshotPr } from "./update-snapshot-pr.mjs";

const options = {
  repo: "gryszzz/Kaspa-Ai-Agent-Skill",
  branch: "automation/kaspa-source-intelligence",
  title: "Update source snapshot",
  bodyFile: "/tmp/snapshot body.md",
};

for (const previousState of ["MERGED", "CLOSED", null]) {
  test(`creates a new PR when the previous PR is ${previousState ?? "absent"}`, () => {
    const calls = [];
    const run = (command, args) => {
      assert.equal(command, "gh");
      calls.push(args);
      if (args[1] === "list") {
        assert.equal(args[args.indexOf("--state") + 1], "open");
        const history = previousState ? [{ number: 22, state: previousState }] : [];
        return JSON.stringify(history.filter((pr) => pr.state === "OPEN"));
      }
      return "https://github.com/example/repo/pull/23\n";
    };
    assert.match(updateSnapshotPr(options, run), /pull\/23/);
    assert.equal(calls[1][1], "create");
    assert.equal(calls[1].at(-1), options.bodyFile);
  });
}

test("edits an existing open PR by number", () => {
  const calls = [];
  updateSnapshotPr(options, (_command, args) => {
    calls.push(args);
    return args[1] === "list" ? JSON.stringify([{ number: 23, state: "OPEN" }]) : "updated\n";
  });
  assert.deepEqual(calls[1], ["pr", "edit", "23", "--repo", options.repo, "--body-file", options.bodyFile]);
});

test("a failed lookup cannot trigger creation", () => {
  let calls = 0;
  assert.throws(() => updateSnapshotPr(options, () => {
    calls += 1;
    throw new Error("GitHub unavailable");
  }), /GitHub unavailable/);
  assert.equal(calls, 1);
});

for (const result of ["invalid JSON", "{}", '[{"number":22,"state":"MERGED"}]',
  '[{"number":22,"state":"OPEN"},{"number":23,"state":"OPEN"}]']) {
  test(`refuses an invalid or ambiguous lookup: ${result}`, () => {
    let calls = 0;
    assert.throws(() => updateSnapshotPr(options, () => { calls += 1; return result; }));
    assert.equal(calls, 1);
  });
}
