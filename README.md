# shadcn-ui-storybook

A Storybook that mirrors the Figma **"Shadcn UI"** design system in code, themeable so one
component set serves two products:

| Brand | Colour | Product |
| --- | --- | --- |
| `tornado` (default) | orange `#d63f00` | [Tornado](https://github.com/alexminsk7/tornado-app) — Taekwondo club PWA |
| `applicant` | blue `#136cff` | [AppLicant](https://github.com/alexminsk7/applicant) — AI mock interviews |

Brand is a token. `[data-brand='applicant']` rebinds four semantic tokens (`--primary` and
friends) and the whole `--button-* / --badge-* / --switch-*` layer follows. Switch **Theme**
(light/dark) and **Brand** independently from the Storybook toolbar.

**Live:** <https://storybook-dqk.pages.dev>

## Stack

- Storybook 10 · `@storybook/react-vite` · React 19 · Vite 8
- **Tailwind v4** via `@config` (the token scale is non-linear — see [`src/styles/globals.css`](src/styles/globals.css))
- tokens: `src/styles/tokens.css` — primitives → semantic → per-component, generated from Figma variables
- addons: a11y, docs, vitest, MCP, `storybook-addon-pseudo-states` (real hover/active/focus stories)
- Chromatic for visual review

## Run

```bash
npm ci
npm run storybook        # http://localhost:6006
npm run build-storybook  # -> storybook-static/
npm run lint
```

## Components

44 components in `src/components/ui/`, each with a `.stories.tsx`. **The Storybook is the
documentation**: every component has a Docs page (intro, props table generated from the
TypeScript types, every story rendered live) — <https://storybook-dqk.pages.dev>.
`Foundations/Overview` shows the four theme × brand combinations side by side.

| Tier | Components | State |
| --- | --- | --- |
| Reconciled with Figma | `accordion` `alert` `alert-dialog` `avatar` `badge` `breadcrumb` `button` `calendar` `card` `fab` `input` `popover` `toggle-group` | measured against the Figma frames; contract per component in [`SPEC.md`](SPEC.md) |
| Stock shadcn/ui | the other 31 (`dialog`, `select`, `table`, `tabs`, `sheet`, `tooltip`, …) | imported via the shadcn CLI; colours come from the token layer, **spacing/heights not yet reconciled** with Figma |

The design contract — Figma node, token mapping, a11y decisions, out-of-scope list — lives in
[`SPEC.md`](SPEC.md), one section per reconciled component.

## CI / deploy

- `.github/workflows/ci.yml` — `lint` + `build-storybook` on every PR (Node from `.node-version`)
- `.github/workflows/chromatic.yml` — Chromatic on every push and PR
- Cloudflare Pages — Git integration, `npm run build-storybook` → `storybook-static/`, a
  `*.pages.dev` preview per branch

## Agent team

Built with a `LEAD` + five subagents (`spec / builder / reviewer / storybook / shipper`) in
[`.claude/agents/`](.claude/agents/). See [`agents.html`](agents.html) for the pipeline and the
hand-off points.

## Not done yet

- AppLicant / Tornado still keep their own copies of these components — consuming this repo as an
  installed package needs a library build + `exports`.
- Code Connect (`.figma.ts`) needs a Figma Organization plan.
- Scoped theming (a dark island on a light page) needs the component-token layer duplicated into
  the `[data-theme='dark']` block; the global toolbar/app-level switch works fully.
