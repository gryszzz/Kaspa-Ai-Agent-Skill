<img width="1983" height="793" alt="ChatGPT Image May 30, 2026, 10_28_23 PM (1)" src="https://github.com/user-attachments/assets/cbfee1fb-2065-4853-b3bc-f365b5d9a741" />

# 🧠 Kaspa Ai Agent Skill 

**Kaspa researcher + engineering skill** with **cross-platform adapters** for Codex, OpenAI-style agents, Claude, Cursor, OpenClaw, Gemini CLI, and generic LLM workflows.

## 🚀 What This Is

This repository publishes a reusable AI skill package for serious Kaspa research and engineering.

- **Skill ID:** `$kaspa-sovereign-architect-engine`
- **Main skill file:** [`SKILL.md`](skills/public/kaspa-sovereign-architect-engine/SKILL.md)
- **Release downloads:** [GitHub Releases](https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/releases)
- **Published release:** `v1.6.2` - GitHub Releases and Packages
- **Repository skill version:** `v1.7.0` - complete Toccata-aware update, not yet published
- **Positioning:** package-first distribution (not a website product)
- **Freshness model:** current-aware, source-grounded, KIP-aware, and research-radar aware
- **Build scope:** Kaspa protocol, wallet, indexer, WASM, dApp, Kdapp, and infrastructure work

## 🔥 What This Agent Is Good At

`$kaspa-sovereign-architect-engine` focuses on:

- **Kaspa research radar:** economics, L1/L2, consensus, mining, KIPs, papers, and ecosystem engineering
- **Toccata R&D intelligence:** branch-aware tracking for covenants, ZK opcodes, sequencing commitments, SilverScript, Based Apps, and vProgs
- **Toccata integration contracts:** scheduled-versus-active DAA gating, `storageMass`/`storage_mass`, `compute_commit`, fee-policy separation, miner template preservation, and one-way DB migration
- **Protocol engineering:** BlockDAG, GHOSTDAG, DAGKNIGHT status checks, mempool, UTXO semantics, and future-feature handling
- **KIP-aware analysis:** separates research ideas, KIP proposals, merged code, activation, wallet/indexer support, and app usability
- **Indexer architecture:** DAG-aware ordering, idempotent ingestion, dedupe, checkpoints, retries, sync lag, and query-layer separation
- **WASM + TypeScript apps:** browser/Node separation, watch-only prototypes, wallet-provider signing, RPC trust assumptions
- **Wallet + UX safety:** signing boundaries, custody warnings, phishing, UI spoofing, RPC hijacking, replay, and supply-chain risk
- **Backend and infrastructure reliability:** APIs, workers, retries, caching, validation, observability, deployment, and recovery plans

## ⚡ Quick Start (Codex)

Use the skill name in your prompt:

```text
$kaspa-sovereign-architect-engine
Design a production-ready Kaspa indexer + API with retry-safe workers and monitoring.
```

Or embed it directly:

```text
Use $kaspa-sovereign-architect-engine to audit my wallet backend for replay, nonce, and signing risks.
```

## 🛰 Example Prompts

```text
Use $kaspa-sovereign-architect-engine in Research Radar mode. Check what is new across Kaspa Research categories and identify builder-relevant changes.
```

```text
Use $kaspa-sovereign-architect-engine in Engineering Build Plan mode. Design a testnet-first Kaspa WASM wallet dashboard with watch-only mode and safe signing boundaries.
```

```text
Use $kaspa-sovereign-architect-engine in Deep Protocol Audit mode. Audit a Kaspa indexer design for DAG-aware ordering, idempotency, replay handling, and sync lag.
```

```text
Use $kaspa-sovereign-architect-engine in KIP Status mode. Build a table of relevant KIPs, their activation status, builder impact, and what must be verified.
```

```text
Use $kaspa-sovereign-architect-engine in Toccata R&D Intelligence mode. Re-check Rusty Kaspa v2.0.0, current mainnet DAA versus activation DAA 474165565, recent branch-delta impact lanes, KIP-16/17/20/21, and produce the next covenant/indexer/wallet compatibility plan.
```

## 🧩 Compatibility Matrix

| Platform | Status | Adapter |
|---|---|---|
| Codex | ✅ Native | [`SKILL.md`](skills/public/kaspa-sovereign-architect-engine/SKILL.md) |
| OpenAI-style agents | ✅ Adapter | [`agents/openai.yaml`](skills/public/kaspa-sovereign-architect-engine/agents/openai.yaml) |
| Claude / Anthropic | ✅ Adapter | [`agents/anthropic.md`](skills/public/kaspa-sovereign-architect-engine/agents/anthropic.md) |
| Cursor | ✅ Adapter | [`agents/cursor.mdc`](skills/public/kaspa-sovereign-architect-engine/agents/cursor.mdc) |
| OpenClaw | ✅ Adapter | [`agents/openclaw.md`](skills/public/kaspa-sovereign-architect-engine/agents/openclaw.md) |
| Gemini CLI | ✅ Adapter | [`agents/gemini.md`](skills/public/kaspa-sovereign-architect-engine/agents/gemini.md) |
| Any LLM platform | ✅ Adapter | [`agents/generic-system-prompt.md`](skills/public/kaspa-sovereign-architect-engine/agents/generic-system-prompt.md) |

Compatibility metadata:

- [`manifest.json`](skills/public/kaspa-sovereign-architect-engine/manifest.json)
- Source trust policy: [`source-trust-policy.md`](skills/public/kaspa-sovereign-architect-engine/references/source-trust-policy.md)
- Research radar: [`kaspa-research-radar.md`](skills/public/kaspa-sovereign-architect-engine/references/kaspa-research-radar.md)
- Toccata R&D playbook: [`toccata-rd-playbook.md`](skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md)
- Toccata mastery map: [`kaspa-toccata-2026.md`](training-corpus/kaspa-toccata-2026.md)
- Toccata R&D intelligence corpus: [`kaspa-toccata-rd-intelligence-2026.md`](training-corpus/kaspa-toccata-rd-intelligence-2026.md)

Automated verification:

- [Compatibility Matrix workflow](https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/actions/workflows/compatibility-matrix.yml)
- Release gating validation is enforced in [`.github/workflows/release-skill.yml`](.github/workflows/release-skill.yml)

Toccata source monitoring:

- [Toccata Source Monitor workflow](https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/actions/workflows/toccata-source-monitor.yml)
- Toccata evidence ladder: [`docs/toccata-evidence-ladder.md`](docs/toccata-evidence-ladder.md)
- Toccata upgrade readiness: [`docs/kaspa/toccata-upgrade-readiness.md`](docs/kaspa/toccata-upgrade-readiness.md)
- Covenant lineage indexer notes: [`docs/kaspa/covenant-lineage-indexer.md`](docs/kaspa/covenant-lineage-indexer.md)
- Wallet covenant-signing preview: [`docs/kaspa/wallet-covenant-signing-preview.md`](docs/kaspa/wallet-covenant-signing-preview.md)
- ZK proof-cost matrix: [`docs/kaspa/zk-proof-cost-matrix.md`](docs/kaspa/zk-proof-cost-matrix.md)
- Sequencing witness API sketch: [`docs/kaspa/sequencing-witness-api.md`](docs/kaspa/sequencing-witness-api.md)
- vProg scope simulator notes: [`docs/kaspa/vprog-scope-simulator.md`](docs/kaspa/vprog-scope-simulator.md)
- Mainnet readiness gate: [`docs/kaspa/mainnet-readiness-gate.md`](docs/kaspa/mainnet-readiness-gate.md)
- Machine-readable snapshot: [`research-snapshots/toccata/latest.json`](research-snapshots/toccata/latest.json)
- Reviewer snapshot: [`research-snapshots/toccata/latest.md`](research-snapshots/toccata/latest.md)
- Mainnet/TN10/TN12 RPC smoke-test notes: [`research-snapshots/toccata/rpc-smoke-tests.md`](research-snapshots/toccata/rpc-smoke-tests.md)
- Monitor script: [`scripts/toccata-source-monitor.mjs`](scripts/toccata-source-monitor.mjs)
- Monitor tests: `node --test scripts/toccata-source-monitor.test.mjs`
- Local knowledge drill: `node scripts/kaspa-knowledge-drill.mjs`
- Covenant lineage prototype: `node scripts/covenant-lineage-prototype.mjs --check-all`
- vProg scope simulator: `node scripts/vprog-scope-simulator.mjs --check`
- Network endpoint checker: `node scripts/toccata-network-check.mjs --check`
- Mainnet readiness gate: `node scripts/toccata-mainnet-readiness-gate.mjs --check`
- Behavioral contract evaluations: `node skills/public/kaspa-sovereign-architect-engine/scripts/run-behavioral-evals.mjs --check`
- Release packages bundle the skill plus adapters, references, Toccata readiness docs, fixtures, source snapshots, helper modules, and deterministic tests under the installed skill directory.
- Claim rule: final release plus schedule means "scheduled"; active mainnet requires a verified endpoint at or above the activation DAA, and wallet/indexer readiness is a separate claim

## 🛠 Install

### Option A: Install latest release (recommended)

```bash
mkdir -p "$CODEX_HOME/skills"
curl -L -o /tmp/kaspa-sovereign-architect-engine.zip \
  https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/releases/latest/download/kaspa-sovereign-architect-engine.zip
unzip -o /tmp/kaspa-sovereign-architect-engine.zip -d "$CODEX_HOME/skills"
```

Verify artifact integrity:

```bash
curl -L -o /tmp/SHA256SUMS.txt \
  https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/releases/latest/download/SHA256SUMS.txt
(cd /tmp && grep "kaspa-sovereign-architect-engine.zip$" SHA256SUMS.txt | shasum -a 256 -c -)
```

Alternative tarball install:

```bash
curl -L -o /tmp/kaspa-sovereign-architect-engine.tar.gz \
  https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/releases/latest/download/kaspa-sovereign-architect-engine.tar.gz
tar -xzf /tmp/kaspa-sovereign-architect-engine.tar.gz -C "$CODEX_HOME/skills"
```

### Option B: Pull from GitHub Packages

The currently published skill is also available as an OCI artifact in GitHub Packages:

```bash
oras pull ghcr.io/gryszzz/kaspa-sovereign-architect-engine:v1.6.2
```

The package contains the versioned ZIP, versioned tarball, and
`SHA256SUMS.txt`. Use the GitHub Release ZIP install path when you want the
simplest Codex installation flow.

### Option C: Install from source

```bash
mkdir -p "$CODEX_HOME/skills/public"
cp -R skills/public/kaspa-sovereign-architect-engine "$CODEX_HOME/skills/public/"
```

### Option D: Install scripts

macOS/Linux:

```bash
./skills/public/kaspa-sovereign-architect-engine/scripts/install-codex.sh
```

Windows PowerShell:

```powershell
.\skills\public\kaspa-sovereign-architect-engine\scripts\install-codex.ps1
```

Export adapter bundle:

```bash
./skills/public/kaspa-sovereign-architect-engine/scripts/export-adapters.sh
```

### Safe repository/local synchronization

The repository skill directory is canonical. Preview deterministic drift before
copying in either direction:

```bash
node skills/public/kaspa-sovereign-architect-engine/scripts/sync-local-skill.mjs \
  --check --report /tmp/kaspa-skill-drift.json
```

Dry-run is the default. Use `--to-local` or `--from-local` to select a
direction, and add `--apply` only after reviewing the report. Conflicts block
writes unless `--force` is explicit; use `--backup` when resolving them. See
[`local-skill-sync.md`](skills/public/kaspa-sovereign-architect-engine/references/local-skill-sync.md)
for the full workflow.

### Option E: Install for OpenClaw

OpenClaw loads AgentSkills-compatible folders from `~/.openclaw/skills` or `<workspace>/skills`.

Install globally for OpenClaw (macOS/Linux):

```bash
./skills/public/kaspa-sovereign-architect-engine/scripts/install-openclaw.sh
```

Install manually into an OpenClaw workspace:

```bash
mkdir -p ./skills
cp -R skills/public/kaspa-sovereign-architect-engine ./skills/
```

### Option F: Install for Gemini CLI

Gemini CLI loads context from `~/.gemini/GEMINI.md` and supports `@` imports.

Install adapter globally (macOS/Linux):

```bash
./skills/public/kaspa-sovereign-architect-engine/scripts/install-gemini.sh
```

Manual install:

```bash
mkdir -p ~/.gemini
cp skills/public/kaspa-sovereign-architect-engine/agents/gemini.md ~/.gemini/kaspa-sovereign-architect-engine.gemini.md
printf "\n@%s\n" "$HOME/.gemini/kaspa-sovereign-architect-engine.gemini.md" >> ~/.gemini/GEMINI.md
```

## 🌍 Use Outside Codex

1. Open an adapter file from [`agents/`](skills/public/kaspa-sovereign-architect-engine/agents/).
2. Copy its contents into your platform's system/developer instructions.
3. Add your actual task prompt.

Example task prompt:

```text
Design a Kaspa DAG-aware indexer for 100k users with failure recovery and replay-safe event handling.
```

## 📦 Releases

- Download packages: [Releases](https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/releases)
- Latest published release notes: [`v1.6.2`](release-notes/v1.6.2.md)
- Next repository release notes: [`v1.7.0`](release-notes/v1.7.0.md)
- Automated packaging workflow: [`.github/workflows/release-skill.yml`](.github/workflows/release-skill.yml)

## 🌐 Deploy + Marketing

- Auto-deploy workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml)
- GitHub Pages landing page: [Live Site](https://gryszzz.github.io/Kaspa-Ai-Agent-Skill/)
- Custom domain support: set repo variable `GH_PAGES_CNAME` (for example `skill.yourdomain.com`); workflow writes `CNAME` automatically
- Domain setup guide: [`docs/domain-setup.md`](docs/domain-setup.md)
- Launch copy + channel templates: [`docs/launch-kit.html`](docs/launch-kit.html)
- SEO files: [`docs/robots.txt`](docs/robots.txt), [`docs/sitemap.xml`](docs/sitemap.xml)
- Scaling runbook: [`docs/scaling-plan.md`](docs/scaling-plan.md)

## 📁 Repository Map

- [`skills/public/kaspa-sovereign-architect-engine/`](skills/public/kaspa-sovereign-architect-engine/) - core skill package
- [`training-corpus/kaspa-pdf-markdown/`](training-corpus/kaspa-pdf-markdown/) - normalized Kaspa corpus
- [`training-corpus/kaspa-toccata-2026.md`](training-corpus/kaspa-toccata-2026.md) - source-gated Toccata mastery map
- [`training-corpus/kaspa-toccata-rd-intelligence-2026.md`](training-corpus/kaspa-toccata-rd-intelligence-2026.md) - deeper Toccata R&D intelligence and development roadmap
- [`training-corpus/kaspa-toccata-readiness-drills-2026.md`](training-corpus/kaspa-toccata-readiness-drills-2026.md) - local Toccata preparation and self-testing loop
- [`research-snapshots/toccata/`](research-snapshots/toccata/) - automated release, branch-delta, KIP, docs, and mainnet/TN10/TN12 intelligence
- [`kaspa-balance-api/`](kaspa-balance-api/) - production-oriented Kaspa API sample
- [`kaspa-codex-evolution-loop/`](kaspa-codex-evolution-loop/) - autonomous iteration framework
