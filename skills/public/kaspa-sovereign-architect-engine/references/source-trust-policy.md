# Source Trust Policy

Trust order:
1. Official stable release notes and tags
2. Official pre-release notes and tags, with activation/pre-activation wording preserved
3. Current source code from official Kaspa repositories
4. Official Kaspa documentation
5. KIP repositories
6. Kaspa Research forum posts
7. Official developer resources
8. DeepWiki summaries
9. Community repos and guides
10. GPTs, tweets, videos, articles, and summaries

Rules:
- Start protocol-primitives research from the Kaspa Developer Docs, then use
  Rusty Kaspa source code, release tags, KIPs, and live network evidence to
  validate or correct the implementation detail.
- For Toccata engineering, use official/repo-backed sources only: Rusty Kaspa
  release tags, the Toccata Guide, Rusty Kaspa proto files, KIP-16/17/20/21,
  Go Kaspad v0.12.23 for legacy compatibility, and local repo docs that cite
  those sources.
- Code beats docs when docs are stale.
- A pre-activation pre-release is upgrade evidence, not final mainnet activation evidence.
- A final release with a future activation DAA is release and schedule evidence; it becomes active-behavior evidence only after a verified mainnet endpoint reaches the threshold.
- Endpoint evidence must include the returned network name; a successful HTTP response from the wrong network is not valid corroboration.
- Protocol activation and wallet/indexer readiness are separate claims and require separate evidence.
- KIPs must be checked for status.
- GitHub PRs marked "merged" must be checked for `baseRefName`; a PR merged into a feature branch is not the same as code merged into `master` or a stable release branch.
- Testnet activation must not be described as mainnet activation.
- Branch-only code must not be described as stable-release behavior.
- Experimental repositories must not be described as production tooling without explicit evidence.
- Research posts are not the same as activated protocol behavior.
- Community tooling must be labeled as community tooling.
- Experimental frameworks must be labeled experimental.
- Never convert roadmap discussion into present-tense fact.
