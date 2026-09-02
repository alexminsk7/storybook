# LinkedIn post

_Draft. Rewrite in your own voice before posting; add the course name and a screenshot/GIF._

---

I just finished a design-engineering course, and the capstone made the point better than any lecture:

**in 2026, the job isn't writing the component faster than a person — it's reviewing what the AI wrote, faster and more honestly.**

For the capstone I built a themeable shadcn/ui design-system Storybook that serves two of my products from one component set. Brand is a token, so the same Button / Input / Card render blue for one app and orange for the other; light and dark both work; every variant and state has a story.

I ran it through a small agent team instead of prompting my way through it:

→ **spec** — turned my existing product docs + the Figma design-system file into a written contract (variants, sizes, states, accessibility)
→ **builder** — implemented to that contract, tokens only, smallest diff
→ **reviewer** — a read-only gate: coverage, no hardcoded colours, focus states — PASS or FAIL
→ **storybook** — wrote the stories and checked each one in a real browser
→ **shipper** — conventional commit, draft PR; CI, visual regression and the preview deploy ran on their own

Three focused PRs, each with its own preview URL. I approved a contract, I approved a render, and I reviewed the diffs. That was the work.

The framework is Andrej Karpathy's: **spec → orchestrate → review**. Vibe coding gets you a prototype; this gets you something you'd actually merge.

Live: https://storybook-dqk.pages.dev
Code: https://github.com/alexminsk7/storybook

#designengineering #frontend #storybook #ai
