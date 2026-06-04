# Toccata Evidence Ladder

This page explains how this repository ranks Toccata-era evidence. It is meant for readers who need to decide whether a claim is mainnet behavior, testnet behavior, branch-only work, a proposal, or research direction.

Short rule: TN10 and TN12 evidence is useful testnet evidence. It is not mainnet activation.

## Source Tiers

Tier 1: stable release notes and tags

- Use for final release claims.
- Mainnet activation claims need explicit release, activation, or merged production evidence.
- A pre-activation pre-release is useful upgrade evidence, but it is not final activation evidence.

Tier 2: Toccata pre-release notes and tags

- Record tag, published date, target branch, pre-release flag, and activation wording.
- Preserve explicit phrases such as pre-activation, sanity testing, one more upgrade, or scheduled activation.
- Separate mainnet pre-activation evidence from TN10/TN12 activation evidence.

Tier 3: Rusty Kaspa branches

- Track `master`, `toccata`, `tn10`, `tn12`, and release tags.
- Record commit hashes and audit date.
- Branch code is stronger than docs, but branch-only behavior is still not automatically released behavior.

Tier 4: Rusty Kaspa pull requests

- Record PR number, title, state, draft status, base branch, head branch, and head SHA.
- A PR merged into a feature branch is not a merge into `master`.
- Open or draft PRs are implementation evidence, not final production behavior.

Tier 5: merged KIP files

- A KIP merged into `kaspanet/kips` `master` is stronger than a KIP PR.
- Still separate specification status from implementation and network activation.

Tier 6: KIP pull requests

- Use KIP PRs for proposal text and design intent.
- Record document status such as `Draft` or `Proposed` when available.
- Do not describe KIP PR text as final protocol behavior.

Tier 7: official Kaspa docs

- Use docs to understand builder-facing framing.
- Check docs source and timestamps when possible.
- If docs conflict with current code, code wins until the docs catch up.

Tier 8: Kaspa Research posts

- Use research posts for design rationale, future direction, and open questions.
- Label research as research unless it is tied to code, KIPs, and activation evidence.

Tier 9: tooling repositories

- SilverScript, vProgs, SDKs, examples, and experiments help builders prepare.
- A working testnet tool is not the same as audited mainnet wallet or indexer support.

Tier 10: live TN10/TN12 signals

- Use `/info/blockdag` checks to confirm endpoint health and testnet DAA context.
- Pair testnet observations with branch, PR, and docs evidence.
- Never infer mainnet activation from TN10 or TN12.

Tier 11: community commentary

- Treat videos, posts, summaries, and social commentary as leads.
- Confirm against official code, KIPs, docs, research records, or live testnet signals before using them.

## Claim Labels

Use these labels in docs, issues, PRs, and research notes:

- Mainnet verified: explicit mainnet release, activation, or merged production evidence exists.
- Mainnet pre-activation: a release is intended for mainnet sanity testing before activation, and does not prove activation.
- Testnet verified: TN10 or TN12 evidence exists and the network is named.
- Branch verified: code exists on a named branch and commit hash.
- PR verified: pull request exists with state, base branch, and head SHA recorded.
- KIP proposal: KIP PR exists but is not merged to `kaspanet/kips` `master`.
- Docs/research signal: official docs or research posts describe the idea, but activation is not proven.
- Experimental tooling: examples or tools exist, but production readiness is not established.
- Unknown: the source set does not prove the claim.

## Reader Checklist

Before repeating a Toccata claim:

1. Record the audit date.
2. Record relevant branch hashes.
3. Record release tag, pre-release flag, and activation or pre-activation wording.
4. Record PR state and base branch.
5. Record KIP state separately from implementation state.
6. Record TN10/TN12 endpoint results only as testnet evidence.
7. State what would need to be true for a mainnet claim.

## Repo References

- Toccata source snapshot: [`../research-snapshots/toccata/latest.md`](../research-snapshots/toccata/latest.md)
- TN10/TN12 smoke tests: [`../research-snapshots/toccata/rpc-smoke-tests.md`](../research-snapshots/toccata/rpc-smoke-tests.md)
- Source trust policy: [`../skills/public/kaspa-sovereign-architect-engine/references/source-trust-policy.md`](../skills/public/kaspa-sovereign-architect-engine/references/source-trust-policy.md)
- Toccata R&D playbook: [`../skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md`](../skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md)
