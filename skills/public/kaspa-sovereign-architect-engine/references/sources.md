# Source Inventory

Use this inventory with `source-trust-policy.md`. Record absolute dates for time-sensitive claims and commit hashes for repository analysis.

## Verified Source Snapshot

Snapshot date: 2026-04-26

- Rusty Kaspa `master`: `3a8e9f00f748b2e0ac94c43efd7a0699800f1866`
- Rusty Kaspa `stable`: `e97070faa3826c590f477e327c82daaddd6178f4`
- Kaspa docs `main`: `6aa5e9f52995f53dc85ef3e8c7c71bab9a359b3e`
- Kaspa KIPs `master`: `2a77c954b2241bce7954ba5fecad0ac7694ce195`
- Kdapp `master`: `eade8531e5230409a53fdb17535ad52a6480880d`
- Simply Kaspa Indexer `main`: `d97b9f486aa53a8c5ff5a7310cd8c46ffa7df23e`

These hashes are a freshness baseline, not a permanent truth. Re-run `git ls-remote` or inspect local clones before making "latest" claims.

## Primary Sources

- Kaspa Official: `https://kaspa.org/`
- Official Developer Resources: `https://kaspa.org/developers-resourses/`
- Official Developer Page: `https://kaspa.org/developer/`
- Official Docs Repository: `https://github.com/kaspanet/docs`
- Wiki: `https://wiki.kaspa.org/`
- Kaspa Research Forum: `https://research.kas.pa/`
- Kaspa Research Categories: `https://research.kas.pa/categories`
- Kaspa Improvement Proposals: `https://github.com/kaspanet/kips`
- Rusty Kaspa: `https://github.com/kaspanet/rusty-kaspa`
- GhostDAG / PHANTOM paper: `https://eprint.iacr.org/2018/104.pdf`
- Kaspa Explorer: `https://explorer.kaspa.org/`
- Alternative Explorer: `https://kas.fyi/`

## Official and Core Repositories

- Rusty Kaspa: `https://github.com/kaspanet/rusty-kaspa`
- Deprecated Go node (kaspad): `https://github.com/kaspanet/kaspad`
- Kaspa Improvement Proposals: `https://github.com/kaspanet/kips`
- Kaspa docs: `https://github.com/kaspanet/docs`
- WASM SDK (inside Rusty Kaspa): `https://github.com/kaspanet/rusty-kaspa/tree/master/wasm`
- WASM JavaScript/TypeScript integration guide: `https://kaspa.aspectron.org/integrating-wasm/`
- Kdapp: `https://github.com/michaelsutton/kdapp`
- Kaspa SQL Indexer: `https://github.com/supertypo/simply-kaspa-indexer`

## Community and Ecosystem Repositories

- Kaspa JS utilities / KKluster tooling: verify current repository before use; label as community tooling unless official ownership is confirmed.
- SilverScript: verify current repository and status before giving production guidance.
- Kasia: `https://github.com/K-Kluster/Kasia`
- Kaspium Wallet: `https://github.com/azbuky/kaspium_wallet`
- Kasware Wallet Extension: `https://github.com/kasware-wallet/extension`

## Toccata Programmability Sources

- Rusty Kaspa releases: `https://github.com/kaspanet/rusty-kaspa/releases`
- Kaspa vision and roadmap context: `https://kaspa.org/vision/`
- Kaspa builder/development page: `https://kaspa.org/build`
- Kaspa programmability overview: `https://docs.kaspa.org/programmability`
- Covenants guide: `https://docs.kaspa.org/programmability/covenants`
- Based Apps guide: `https://docs.kaspa.org/programmability/based-apps`
- Inline ZK guide: `https://docs.kaspa.org/programmability/inline-zk`
- Full vProgs guide: `https://docs.kaspa.org/programmability/full-vprogs`
- SilverScript: `https://github.com/kaspanet/silverscript`
- vProgs: `https://github.com/kaspanet/vprogs`
- KIPs: `https://github.com/kaspanet/kips`

## Secondary Sources

- DeepWiki for Rusty Kaspa: `https://deepwiki.com/kaspanet/rusty-kaspa`
- Kaspa Research GPT or GPT-style assistants: use only as navigation aids; never let them override code, official docs, KIPs, or research forum posts.

## Protocol and Consensus Comparators

- Bitcoin Core index modules: `https://github.com/bitcoin/bitcoin/tree/master/src/index`
- Bitcoin BIPs: `https://github.com/bitcoin/bips`
- Ethereum EIP-1193: `https://eips.ethereum.org/EIPS/eip-1193`

## Indexing and Query-Layer References

- The Graph docs: `https://thegraph.com/docs/`
- PostgreSQL docs: `https://www.postgresql.org/docs/`
- ClickHouse docs: `https://clickhouse.com/docs/`

## Cryptography and Wallet Foundations

- CryptoBook: `https://cryptobook.nakov.com/`
- Mastering Bitcoin repository: `https://github.com/bitcoinbook/bitcoinbook`

## DevOps and Platform References

- Docker docs: `https://docs.docker.com/`
- Kubernetes docs: `https://kubernetes.io/docs/home/`
- NGINX docs: `https://nginx.org/en/docs/`
- Redis docs: `https://redis.io/docs/`
- Cloudflare developer docs: `https://developers.cloudflare.com/`

## UX and Product References

- Refactoring UI: `https://www.refactoringui.com/`
- Nielsen Norman Group: `https://www.nngroup.com/articles/`
- Laws of UX: `https://lawsofux.com/`

## Suggested Local Workspace Layout

```text
repos/
  rusty-kaspa/
  kaspad/
  kips/
  docs/
  kdapp/
  simply-kaspa-indexer/
  kaspa-js-or-kkluster-utilities/
  kasia/
  kaspium_wallet/
  kasware-extension/
```

## Snapshot Discipline

Record commit and analysis date for each repo before reporting:

```bash
git -C repos/<repo-name> rev-parse HEAD
git -C repos/<repo-name> show -s --format=%ci HEAD
```

Record branch state when the working tree is not detached:

```bash
git -C repos/<repo-name> rev-parse --abbrev-ref HEAD
git -C repos/<repo-name> status --short
```

For web sources that are not git repositories, record fetch date and URL explicitly in the report.
