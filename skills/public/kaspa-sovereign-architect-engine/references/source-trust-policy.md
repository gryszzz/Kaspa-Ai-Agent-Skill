# Source Trust Policy

Trust order:
1. Current source code from official Kaspa repositories
2. Official Kaspa documentation
3. KIP repositories
4. Kaspa Research forum posts
5. Official developer resources
6. DeepWiki summaries
7. Community repos and guides
8. GPTs, tweets, videos, articles, and summaries

Rules:
- Code beats docs when docs are stale.
- KIPs must be checked for status.
- GitHub PRs marked "merged" must be checked for `baseRefName`; a PR merged into a feature branch is not the same as code merged into `master` or a stable release branch.
- Testnet activation must not be described as mainnet activation.
- Branch-only code must not be described as stable-release behavior.
- Experimental repositories must not be described as production tooling without explicit evidence.
- Research posts are not the same as activated protocol behavior.
- Community tooling must be labeled as community tooling.
- Experimental frameworks must be labeled experimental.
- Never convert roadmap discussion into present-tense fact.
