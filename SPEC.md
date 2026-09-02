# SPEC — shadcn/ui design-system Storybook

Capstone: run a real product surface through `spec → orchestrate → review` — Figma → component →
Storybook story → PR → preview.

## Spec of record

This repo has no product spec of its own. The consuming product is **AppLicant**
(`github.com/alexminsk7/applicant`); its specification already exists and is reused verbatim:

| Document | Covers |
| --- | --- |
| [`outputs/prd.md`](https://github.com/alexminsk7/applicant/blob/main/outputs/prd.md) | product requirements, scope, MoSCoW |
| [`outputs/project-doc.md`](https://github.com/alexminsk7/applicant/blob/main/outputs/project-doc.md) | §5.1 design references — brand, contrast, spacing, motion; §6.1 per-feature specs |
| [`outputs/ia.md`](https://github.com/alexminsk7/applicant/blob/main/outputs/ia.md) | screen & state inventory (§3), component anatomy (navbar, auth dialog) |
| [`outputs/ux-audit/README.md`](https://github.com/alexminsk7/applicant/blob/main/outputs/ux-audit/README.md) | acceptance checklist — Vercel Web Interface Guidelines + Playwright pass at 1440/360 light/dark |

This repo implements the **shadcn/ui components those documents depend on**, themeable so one library
serves both AppLicant (blue `#136cff`) and Tornado (orange `#d63f00`) — see `README.md`.

## Capstone component — `Button`

Source: [`src/components/ui/button.tsx`](src/components/ui/button.tsx) ·
stories: [`src/components/ui/button.stories.tsx`](src/components/ui/button.stories.tsx)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", component set **`73:3681`**
(node `72:2719` "Button" page). Verified against the code on 2026-09-02 via Figma MCP
(`get_metadata` + `get_screenshot` — `get_design_context` needs a desktop selection here; Code
Connect needs a Figma Org plan, so no `.figma.ts` is published yet).

Figma variant axes: **Type** × **State**.

| Figma `Type` | code `variant` | note |
| --- | --- | --- |
| Primary | `default` | brand fill |
| Secondary | `outlinePrimary` | brand border + brand text — **name drift**: Figma "Secondary" ≠ code `secondary` |
| Filled | `secondary` | neutral-100 fill |
| Destructive | `destructive` | |
| Outline | `outline` | neutral border |
| Ghost | `ghost` | transparent, neutral text |
| Ghost Primary | `ghostPrimary` | transparent, brand text |
| Link | `link` | brand text, underline |

Figma `State`: `Default` / `Pressed` / `Disabled` — Pressed and Disabled are **opacity-only** in
Figma (`opacity-80` / `opacity-60`, base colours unchanged); the code matches
(`active:opacity-80`, `disabled:opacity-60`). Hover is a web-only addition (Figma documents no
hover state). Not in the Figma set: `xl` size, `loading`, `asChild` — all code-only extensions,
commented as such.

### Contract

- **`variant`**: `default | secondary | outline | outlinePrimary | ghost | ghostPrimary | link | destructive` — default `default`
- **`size`**: `default (h44) | sm (h32) | lg (h48) | xl (h56) | icon (h44 square)` — default `default`
- **`loading`**: boolean — spinner + `aria-busy`, sets `disabled`
- **`asChild`**: boolean — render via Radix `Slot`
- states: rest / hover / active (`opacity-80`) / focus-visible (`ring-2 ring-ring`) / disabled (`opacity-60`, `pointer-events-none`)
- brand-carrying tokens (`--button-background`, `--button-foreground`, …) cascade from `--primary`, so the component is theme-agnostic

### Accessibility

- focus ring: `--ring` (brand-tinted per theme); visible on every variant incl. `ghost` / `link`
- `disabled` renders `disabled` attribute (not `aria-disabled`) + `pointer-events-none`
- `loading` sets `aria-busy` and blocks interaction
- reduced-motion: the consuming app's global `prefers-reduced-motion` kill switch disables the spinner and transitions
- known: brand blue `#136cff` on white is ~3.5:1 — below AA for 14px text, accepted from the Figma library as-is (same call AppLicant made)

## Out of scope

- renaming code `variant`s to match Figma `Type` names (breaks existing stories; tracked as reconciliation)
- publishing Code Connect (`.figma.ts`) — needs a Figma Organization plan
- AppLicant / Tornado consuming this repo as an installed package — needs a lib build + `exports`
