# GitHub Pages Setup

This repository is dedicated to Kaspa AI Agent Skill.

Default project URL:

- https://gryszzz.github.io/Kaspa-Ai-Agent-Skill/

## Optional Custom Domain

The Pages workflow uses the default GitHub Pages project URL unless you set a repository Actions variable:

- `GH_PAGES_CNAME`

When `GH_PAGES_CNAME` is set, the workflow writes that value into the deployed `CNAME` artifact. No custom domain is hard-coded in this repository.

## GitHub Pages Settings

1. Repo -> `Settings` -> `Pages`.
2. Use GitHub Actions as the Pages source.
3. Leave custom domain blank unless you intentionally configure `GH_PAGES_CNAME`.
4. Enable `Enforce HTTPS` when GitHub allows it.

## Quick Verification

```bash
curl -I https://gryszzz.github.io/Kaspa-Ai-Agent-Skill/
```
