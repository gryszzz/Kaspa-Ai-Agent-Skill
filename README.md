# 🧠 Kaspa Sovereign Architect Engine

**Kaspa researcher + engineering skill** with **cross-platform adapters** for Codex, OpenAI-style agents, Claude, Cursor, OpenClaw, Gemini CLI, and generic LLM workflows.

## 🚀 What This Is

This repository publishes a reusable AI skill package for serious Kaspa research and engineering.

- **Skill ID:** `$kaspa-sovereign-architect-engine`
- **Main skill file:** [`SKILL.md`](skills/public/kaspa-sovereign-architect-engine/SKILL.md)
- **Release downloads:** [GitHub Releases](https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/releases)
- **Positioning:** package-first distribution (not a website product)
- **Freshness model:** current-aware, source-grounded, KIP-aware, and research-radar aware
- **Build scope:** Kaspa protocol, wallet, indexer, WASM, dApp, Kdapp, and infrastructure work

## 🔥 What This Agent Is Good At

`$kaspa-sovereign-architect-engine` focuses on:

- **Kaspa research radar:** economics, L1/L2, consensus, mining, KIPs, papers, and ecosystem engineering
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

Automated verification:

- [Compatibility Matrix workflow](https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/actions/workflows/compatibility-matrix.yml)
- Release gating validation is enforced in [`.github/workflows/release-skill.yml`](.github/workflows/release-skill.yml)

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

### Option B: Install from source

```bash
mkdir -p "$CODEX_HOME/skills/public"
cp -R skills/public/kaspa-sovereign-architect-engine "$CODEX_HOME/skills/public/"
```

### Option C: Install scripts

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

### Option D: Install for OpenClaw

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

### Option E: Install for Gemini CLI

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
- [`kaspa-balance-api/`](kaspa-balance-api/) - production-oriented Kaspa API sample
- [`kaspa-codex-evolution-loop/`](kaspa-codex-evolution-loop/) - autonomous iteration framework
