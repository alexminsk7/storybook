# Course chat — capstone

_Draft. Adapt the voice before posting._

---

Capstone done — a **themeable shadcn/ui design-system Storybook**, one component set for two of my
products.

- **Live:** https://storybook-dqk.pages.dev
- **Repo:** https://github.com/alexminsk7/storybook
- **PRs:** #4 Tailwind v4 · #5 themeable brand · #6 SPEC + agent team + README

What it does: brand is a token, so the same `Button` / `Input` / `Card` render blue for AppLicant
and orange for Tornado — flip **Theme** (light/dark) and **Brand** in the Storybook toolbar, or see
all four in `Foundations/Overview`.

How it was built — `spec → orchestrate → review`:

1. `spec` — SPEC.md from my existing AppLicant PRD/IA + the Figma "Shadcn UI" file (verified the
   Button variants/states via Figma MCP)
2. `builder` / `reviewer` — component to spec, tokens only, read-only PASS/FAIL gate
3. `storybook` — stories per variant + state, a real browser check of each
4. `shipper` — conventional commit, draft PR; CI, Chromatic and the Cloudflare preview run
   themselves

The team (`LEAD` + 5 subagents) lives in `.claude/agents/` + `agents.html`.

My job through all of it was the review, not the typing.

Branch preview of the final PR: https://feat-capstone.storybook-dqk.pages.dev
