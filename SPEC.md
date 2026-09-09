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

## Component — `Card`

Source: [`src/components/ui/card.tsx`](src/components/ui/card.tsx) ·
stories: [`src/components/ui/card.stories.tsx`](src/components/ui/card.stories.tsx)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", component key
`c8573d3584641ec7f68b6c4c4ce6f271432f4bdd` ("Card" — "Surface that groups related content and
actions (header, content, footer slots)", library "Shadcn UI"). **No live Figma MCP tools were
available this session** — no `get_metadata`/`get_screenshot` call was made. Everything below is
code-derived from the in-code comments left by the prior visual-reconciliation pass (commits
`1fd902f`, `1ac201f`), not independently re-verified against a live Figma node this session.

Per those code comments, reconciled against Figma but not re-checked live here:

- `rounded-[var(--radius-14)]` (14px) — not shadcn-stock `rounded-12`
- `shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]` — not shadcn-stock `shadow-sm`
- `p-7` (`--space-7` = 24px) on header/content/footer — Figma's card padding, not `--space-6` (20px)
- `CardTitle` renders `text-sm font-normal leading-5` at Figma node **`73:4339`** — not
  shadcn-stock `text-lg font-semibold`

Card has no variant axis to map: there is no `variant` or `size` prop anywhere in `card.tsx`.
Whether the Figma "Card" component itself defines variants (e.g. elevated/outlined) that the
code doesn't implement is **unverified this session**.

### Contract

`Card` is a compound component — every part is a thin `React.forwardRef` wrapper that forwards
`className` and spreads the rest of its native HTML attributes. None of the parts takes a
`variant` or `size` prop.

| Part | Element | Default classes |
| --- | --- | --- |
| `Card` | `div` | `rounded-[var(--radius-14)] border border-card-border bg-card-background text-card-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]` |
| `CardHeader` | `div` | `flex flex-col gap-1.5 p-7` |
| `CardTitle` | `h3` | `text-sm font-normal leading-5` |
| `CardDescription` | `p` | `text-sm leading-5 text-muted-foreground` |
| `CardContent` | `div` | `p-7 pt-0` |
| `CardFooter` | `div` | `flex items-center p-7 pt-0` |

No size table applies — one fixed padding scale (`p-7`/24px), no `sm`/`lg` size prop.

- states: rest only. `card.stories.tsx` states directly that "the design system defines no
  hover/active tokens for it." There is no hover, active, focus-visible, disabled, or loading
  styling anywhere in `card.tsx` — these rows are **not applicable**, not undocumented
- brand-carrying tokens (`--card-background`, `--card-border`, `--card-foreground`) cascade from
  `--card` / `--border` / `--foreground`, so Card is theme-agnostic like Button

### Accessibility

- Card renders no interactive semantics of its own (plain `div`s) — nothing to focus, no
  disabled state, no ARIA role
- `CardTitle` is a hard-coded `<h3>` — contributes to the page heading hierarchy; there is no
  `level`/`as` prop, so a consumer cannot change the emitted heading level
- reduced-motion: not applicable — `card.tsx` has no transitions or animations
- color contrast of `text-card-foreground` on `bg-card-background` not evaluated this session
  (no live Figma/contrast-checker access)

### Out of scope

- confirming whether Figma's "Card" component defines variants beyond what's implemented — needs
  live Figma access
- a `level`/`as` prop for `CardTitle`'s heading level — not present in code
- hover/active/focus-visible/disabled/loading treatments — the design system defines none for
  this static container

## Component — `Input`

Source: [`src/components/ui/input.tsx`](src/components/ui/input.tsx) ·
stories: [`src/components/ui/input.stories.tsx`](src/components/ui/input.stories.tsx)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", frame **`520:3062`**
("Input", 360×212, description: *"Single-line text input. States: Default / Active (focus ring)
/ Disabled."*). Verified live via Figma MCP (`get_metadata` + `get_design_context`) on
2026-09-05.

**Node-id "discrepancy" from the previous pass resolved — it was a hierarchy, not a conflict:**
`520:3062` is the parent frame; `520:3061` / `588:103` / `3065:376` are its three state symbols
(Default / Active / Disabled), each **320×44**.

Confirmed against the live node:

- `h-[var(--height-44)]` — **matches** the Figma frame's own height (44px) directly, not only
  Button's height by convention
- `px-4`/`py-2` (`--space-4`/`--space-2`), `rounded-8` (`--radius-8`), `border-input-border`,
  `bg-input-background` — all match
- disabled: opacity-only (`--opacity-60`), no colour swap — matches
- font is Geist (`font-['Geist:Regular']`, 14px, `line-height 20px`, weight 400) — matches this
  repo's `@fontsource/geist-sans`, not Inter

**`focus:` vs `focus-visible:` — resolved, not a bug.** Figma's own component description says
*"Active (focus ring)"* with no distinction between keyboard and pointer focus. The code's
`focus:` (ring on any focus) matches that description more closely than Button's
`focus-visible:` (keyboard-only) would — the two components are intentionally different here,
not out of sync.

**New, verified gap — not in code:** the Figma component has an `Icon` / `Inline Icon` prop; the
`Active` state shows a `lucide/circle-x` clear-button icon (hidden by default, visible when
`Icon = true`). `input.tsx` has no such prop at all. Not fixed here — flagged under "Out of
scope" below as a real, confirmed gap, not a guess.

Input has no Figma variant axis to map beyond `State`: there is no `variant` prop in
`input.tsx`.

### Contract

- `InputProps`: `React.InputHTMLAttributes<HTMLInputElement>` + **`error?: boolean`** (default
  `false`) — drives `aria-invalid` and a destructive-foreground border/ring
- no `variant` prop, no `size` prop — one fixed size: `h-[var(--height-44)]` (44px, matches
  Button's `default` height), `w-full`, `rounded-8` (8px)
- `type` is unrestricted by the component (native `<input type>` passthrough); the Storybook
  `argType` limits the control widget to `text | email | password | number` for the demo — a
  Storybook-only restriction, not a component-level constraint
- `ref` forwarded to the underlying `<input>`

No size table applies — Input has a single fixed height.

| State | Styling | Note |
| --- | --- | --- |
| rest | `border-input-border bg-input-background` | |
| hover | identical to rest | no `--input-border-hover` token exists; `input.stories.tsx` confirms this is intentional, not a bug |
| active | not styled distinctly | no `:active` treatment in code — no separate pressed state |
| focus-visible | `focus:border-input-border-focus focus:ring-2 focus:ring-ring/20` | code uses `focus:` (not `focus-visible:`), matching Figma's own "Active (focus ring)" description, which doesn't distinguish keyboard vs pointer — **confirmed intentional**, not a Button-inconsistency |
| disabled | `disabled:cursor-not-allowed disabled:opacity-60` | opacity-only, same pattern as Button; native `disabled` attribute |
| loading | not applicable | Input has no `loading` prop/state |
| error (extra axis) | `border-destructive-foreground` rest, `focus:border-destructive-foreground focus:ring-2 focus:ring-destructive-foreground/20` on focus, `aria-invalid` set | replaces the default border/ring color; doesn't stack with the rows above |

- brand-carrying tokens (`--input-background`, `--input-border`, `--input-border-focus`,
  `--ring`) cascade per theme, so Input is theme-agnostic like Button

### Accessibility

- `aria-invalid` is set only when `error` is `true` (`error || undefined`, never the literal
  string `"false"`) — correct per the attribute's boolean-or-absent contract
- `disabled` uses the native HTML `disabled` attribute (not `aria-disabled`), same convention as
  Button
- focus ring uses `focus:`, not `focus-visible:` (see Contract table) — confirmed intentional
  against Figma's own state description, not a Button-inconsistency
- **no built-in label wiring**: `Input` renders a bare `<input>` with no associated `<label>` or
  `aria-label`; `input.stories.tsx` only sets a `placeholder`, which is not a substitute for a
  label. Pairing an accessible label with the input is left entirely to the consumer
- reduced-motion: the only transition is `transition-colors` (border/ring color fade on
  focus/error) — no motion animation exists to reduce

### Out of scope

- an `Icon`/`Inline Icon` prop (Figma's clear-button `lucide/circle-x` on the `Active` state) —
  confirmed present in Figma, not implemented in `input.tsx`
- a built-in `<Label>`/label-association mechanism — none exists; left to the consumer

## Component — `Accordion`

Source: `src/components/ui/accordion.tsx` (not yet built — see "Out of scope") · stories:
`src/components/ui/accordion.stories.tsx` (not yet built)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", frame **`73:3341`**
"Accordion" — this outer frame is Figma's own documentation-page chrome (title, description, a
"View in Shadcn" link button, wrapped in a demo card); none of that is part of the actual
component and is ignored below. The reusable component lives at frame **`73:3394`** "Accordion"
(512×500), containing two state symbols: **`73:3392`** "State=default" (472×156, three collapsed
rows) and **`73:3393`** "State=open" (472×288, one row expanded). Verified live via Figma MCP
(`get_metadata` + `get_screenshot`) on 2026-09-05.

Figma's own component description (attached to `73:3394`): *"Vertically stacked collapsible
panels (FAQ pattern). A row expands to reveal its content; single-open by default."*

Figma variant axis: **State** — `default` / `open`.

| Figma `State` | code mapping | note |
| --- | --- | --- |
| default | row not in the open value | collapsed; trigger keeps its bottom border |
| open | row's `value` matches `Accordion.Root`'s open value | expanded; trigger's bottom border is **removed** (border moves to sit under the revealed answer instead); chevron rotated |

Confirmed structural/token facts from the live pull:

- trigger row ("Button" in Figma's naming — the clickable header, not this repo's `Button`
  component): `flex items-center py-[var(--py-4,16px)] w-full`, bottom-bordered
  `border-b-[1px] border-[var(--accordion-border,#e4e4e7)]` — **except** the open row's trigger,
  which has no bottom border
- trigger label: `font-['Geist:Medium'] font-weight-medium(500) text-[14px] leading-5
  text-[var(--accordion-foreground,#09090b)]`
- chevron icon, 16×16, rotates on open — one icon rotated, not two separate assets per state
- revealed answer panel: `border-b-[1px] border-[var(--accordion-border)]`,
  `flex flex-col gap-[var(--gap-4,16px)]`, `pb-[var(--mb-4,16px)]`; paragraph copy
  `font-['Geist:Regular'] font-weight-normal(400) text-[14px] leading-5
  text-[var(--accordion-foreground,#09090b)]`
- "single-open by default" (Figma's own description) — maps to Radix `type="single" collapsible`
- Figma models only `default`/`open` — **no hover, focus-visible, or disabled state was present in
  the pull**. Not inventing hover/disabled styling here (same "states: rest only"-type caveat as
  Card's section). Focus-visible is still a real code-level a11y requirement for an interactive
  trigger even without a Figma-defined visual for it — see Accessibility, not here
- the demo content ("Product Information" / "Shipping Details" / "Return Policy" + placeholder
  paragraphs) is Figma's example content only — item count, trigger copy, and answer copy are all
  consumer-supplied, not part of the component's contract

### Contract

Not yet implemented — `accordion.tsx` does not exist in this repo (confirmed: only `button.tsx`,
`card.tsx`, `input.tsx` under `src/components/ui/`). This section specifies what the builder must
implement, following this repo's compound-parts convention (`card.tsx`) and Radix-primitive
convention (`@radix-ui/react-slot`, already used by `button.tsx`).

**New dependency**: `@radix-ui/react-accordion` — not currently in `package.json`. Same tier as
`@radix-ui/react-slot`; the builder adds it. A real accordion needs Radix's expand/collapse and
keyboard behavior — not optional, CSS-only scope.

Compound parts (Radix `Root`/`Item`/`Trigger`/`Content`):

| Part | Radix primitive | Notes |
| --- | --- | --- |
| `Accordion` | `AccordionPrimitive.Root` | `type="single" collapsible` — single-open by default per Figma's description |
| `AccordionItem` | `AccordionPrimitive.Item` | wraps one row; requires a `value` |
| `AccordionTrigger` | `AccordionPrimitive.Trigger` | the clickable header row (Figma's "Button" node — not this repo's `Button`) |
| `AccordionContent` | `AccordionPrimitive.Content` | the revealed answer panel |

- `AccordionTrigger`: `flex items-center py-5 w-full border-b
  border-[var(--accordion-border,#e4e4e7)]`, label `text-sm font-medium leading-5
  text-[var(--accordion-foreground,#09090b)]`, 16×16 chevron rotating on open
  (e.g. `data-[state=open]:rotate-180`); border must be suppressed on the open item's trigger only
  (border moves to the content panel per Figma). **`py-5`, not `py-4`**: Figma's raw pull cited
  `var(--py-4, 16px)`, but that's Figma's own internal variable name, not this project's scale —
  this project's Tailwind numeric key `4` maps to `--space-4` (12px); the key that actually
  resolves to 16px is `5` (`--space-5`). Do not trust Figma's digit suffix to match this
  project's Tailwind scale; match by the literal pixel value against `tokens.css` instead (same
  class of bug as Button's height-scale gotcha)
- `AccordionContent`: `border-b border-[var(--accordion-border)] flex flex-col gap-5 pb-5`
  (not `gap-4`/`pb-4` — same 16px-vs-`--space-4`(12px) mismatch as above), paragraph text
  `text-sm font-normal leading-5 text-[var(--accordion-foreground,#09090b)]`
- no `size` prop/table — Figma shows one fixed size
- states: rest (collapsed) / open (expanded) per Figma; hover/focus-visible/disabled are
  code-level requirements not shown as distinct Figma states (see Accessibility)
- brand-carrying tokens (`--accordion-border`, `--accordion-foreground`) should cascade from
  theme tokens (`--border`, `--foreground`) the way Button/Card/Input do, keeping Accordion
  theme-agnostic — unverified since the component doesn't exist yet

### Accessibility

- Radix `Accordion.Trigger` renders a real `<button>` (wrapped in an `<h3>` by Radix's default) —
  keyboard-operable and focusable out of the box; rely on Radix's defaults rather than
  reimplementing
- focus-visible: Figma shows no distinct visual for it (only `default`/`open` were in the pull),
  but a real interactive trigger requires a visible keyboard focus ring
  (`focus-visible:ring-2 ring-ring`, matching Button's pattern) — a code-level a11y requirement to
  add regardless of Figma
- Radix wires `aria-expanded` and `aria-controls`/`aria-labelledby`, plus arrow-key/Home/End
  navigation between triggers, automatically
- reduced-motion: the expand/collapse height transition should respect
  `prefers-reduced-motion`, consistent with Button's reduced-motion note — no motion spec was in
  the Figma pull, so exact easing/duration is a code-only decision
- no disabled state in Figma or required by the pull — if a `disabled` item prop is added later,
  it should follow Button/Input's opacity-only + native-attribute convention

### Out of scope

- hover / disabled visual treatments for the trigger — Figma defines neither (only `default`/`open`)
- multi-open (`type="multiple"`) behavior — Radix supports it, but Figma's description says
  "single-open by default"; only single-open is specified here
- the demo content (item count, trigger/answer copy) — Figma's example only, not a fixed contract
- Code Connect (`.figma.ts`) — same blocker as Button (needs a Figma Organization plan)
- actual implementation (`accordion.tsx`, `accordion.stories.tsx`) — this is the SPEC section
  only; no component code was written per instruction

## Component — `Badge`

Source: `src/components/ui/badge.tsx` (not yet built), stories:
`src/components/ui/badge.stories.tsx` (not yet built)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", frame **`665:2024`**
"Badge", a real Figma **component set** (unlike Alert's three loose symbols) with one genuine
`Type` variant property and 10 real values. Verified live via `get_design_context` on
2026-09-05, which returns Figma's own generated TS union type verbatim:
`"Default" | "Default_number" | "Destructive" | "Destructive_fill" | "Outline" | "Secondary" |
"Secondary_icon" | "Secondary_number" | "Success" | "Info"`.

Figma's own component description: *"Small inline label for status, count, or category. Type
sets the color/semantics."* Per this project's already-established rule from the earlier
Sonner/Toast and Table/Navigation-Menu naming investigation ("if Figma and generic shadcn docs
disagree, Figma is the contract — generic docs are 6 variants, Figma has 10"), **all 10 Figma
values are the contract**, not the smaller stock shadcn set.

Confirmed structural/token facts from the live pull (container is always
`inline-flex items-center justify-center rounded-full`):

| Figma `Type` | code `variant` | bg token | fg token | height | note |
| --- | --- | --- | --- | --- | --- |
| Default | `default` | `--badge-background-default` | `--badge-foreground-default` | 22px | solid brand fill |
| Success | `success` | `--badge-background-success` | `--badge-foreground-success` | 22px | soft/tinted |
| Secondary | `secondary` | `--badge-background-secondary` | `--badge-foreground-secondary` | 22px | neutral fill |
| Destructive | `destructive` | `--badge-background-destructive-soft` | `--badge-foreground-destructive` | 22px | soft/tinted — see token note below |
| Outline | `outline` | none (no `bg-*` class in the pull at all — transparent) | `--badge-foreground-outline` | 22px | border only |
| Secondary_icon | `secondaryIcon` | `--badge-background-default` | `--badge-foreground-default` | 22px | **name drift**: styled identically to `default` (brand fill), not `secondary` — see below |
| Default_number | `defaultNumber` | `--badge-background-default` | `--badge-foreground-default` | 20px | solid fill, shorter height |
| Destructive_fill | `destructiveFill` | `--badge-background-destructive` | `--badge-foreground-default` | 20px | **solid** red fill (vs. `destructive`'s soft tint) — reuses the light `foreground-default` text token for contrast on a dark fill, same as `default`/`defaultNumber` |
| Secondary_number | `secondaryNumber` | none (border only, like `outline`) | `--badge-foreground-outline` | 20px | monospace label font (`font-family-mono`), smaller padding — see below |
| Info | `info` | `--badge-background-info` | `--badge-foreground-info` | 22px | soft/tinted brand |

- **`--badge/foreground-destructive-soft` naming artifact**: Figma's raw pull literally names the
  `destructive` variant's text color `var(--badge\/foreground-destructive-soft, #e7000b)` — a
  variable name containing an escaped slash, which does not exist as a real token in
  `tokens.css`. The fallback value (`#e7000b`) is value-identical to the token that **does**
  exist, `--badge-foreground-destructive` (chains to `--destructive-foreground` →
  `--color-red-600` = `#e7000b`) — use the real, existing token; this is a Figma internal-path
  export glitch, not a missing token
- padding: every variant except `Secondary_number` uses `px-3 py-1` (Figma's raw pull names these
  `--space-3`/`--space-1` directly, with fallbacks 8px/2px that **already match** this project's
  real `--space-3`(8px)/`--space-1`(2px) — the first component where Figma's own variable names
  need no digit-suffix correction). `Secondary_icon` additionally has a 4px gap between its icon
  and label — this project's `--space-2` (4px), so Tailwind `gap-2`, **not** `gap-1` (which is
  `--space-1` = 2px here) — an editing slip in an earlier draft of this SPEC wrote `gap-1` for a
  4px value, caught and corrected during the builder step
- `Secondary_number`'s padding is smaller and **does** need the usual digit-suffix correction:
  raw pull gives `px-[var(--px-1,4px)]` / `py-[var(--py-0.5,2px)]` — 4px is this project's
  `--space-2` (not `--space-1`, which is 2px) and 2px is `--space-1` — use `px-2 py-1`, not a
  literal copy of the raw digit suffixes
- height: 22px has no exact token in the `--height-*` scale (jumps `20`→`24`) — use a literal
  `h-[22px]`, there is nothing to snap to. The three 20px variants (`defaultNumber`,
  `destructiveFill`, `secondaryNumber`) **do** have an exact token, `--height-20`
- text: `text-xs font-medium leading-4` (12px / 500 / 16px — `leading-4` now resolves correctly
  to `--line-height-4` thanks to the project-wide line-height fix already shipped). `secondary
  Number` uses `font-family-mono` (Geist Mono) instead of the default sans, everything else uses
  the default sans — the only variant with a non-default font family
- **`Secondary_icon` name drift, confirmed not a copy-paste in the SPEC sense but a real Figma
  authoring inconsistency**: it is visually `default`-colored (brand orange fill), not
  `secondary`-colored, despite its name — same class of drift as Button's Figma "Secondary" =
  code `outlinePrimary`. Its only real distinguishing feature vs. plain `default` is the leading
  16×16 `lucide/circle-check` icon + `gap-1` + the example label "Verified" (not "Label" like
  every other example) — kept as its own contract value (matching Figma's real 10-value enum
  1:1, per the already-established "Figma's full set is the contract" decision for Badge), but
  the icon+gap treatment is scoped to this one variant, not generalized to "every variant accepts
  an optional icon" (no other of the 10 examples shows one)

**Three real bugs found and fixed while building this component, none part of Badge's own
contract but all blocking it from rendering correctly:**

1. `tokens.css` had `--badge-foreground-destructive: var(--color-white)` — white text, apparently
   copy-pasted from the solid-fill button pattern, but this token is actually consumed by the
   `destructive` **soft/tinted** badge background, not a solid fill. Confirmed via live computed
   styles during the storybook step: white text on a pale pink tint is barely readable. Fixed to
   `var(--destructive-foreground)` (the same solid red already used correctly by sibling tokens
   like `--alert-border-destructive`/`--alert-foreground-destructive`), matching what this SPEC
   and `badge.tsx` both already assumed it did.
2. `--font-family-mono: Geist Mono` had no matching font asset anywhere in the repo —
   `@fontsource/geist-mono` was never installed and `.storybook/preview.tsx` only imports Geist
   Sans weights. Confirmed via `document.fonts` (no Geist Mono face registered) and Canvas
   glyph-width measurement (proportional, not monospace) that `secondaryNumber`'s label was
   silently falling back to the browser default font. Fixed: added `@fontsource/geist-mono` as a
   dependency and imported its `400`/`500` weights (the only weights this repo currently uses) in
   `preview.tsx`, mirroring the existing Geist Sans import pattern.
3. Tailwind v4's automatic whole-project content scan (no `@source` restriction existed in
   `globals.css`) was picking up this very SPEC's own Figma-raw-value prose strings (e.g. an
   earlier draft's `var(--py-0.5,2px)`) as candidate utility classes and choking on the invalid
   `--py-0.5` custom-property syntax, producing a Lightning CSS build warning. Fixed once,
   project-wide, with `@source not '../../SPEC.md';` in `globals.css` — SPEC.md is documentation,
   never a real class source, and will keep quoting raw Figma variable names in future component
   sections

### Contract

No new dependency — `Badge` is a plain styled element (`<span>`), not a Radix primitive, same
category as `Alert`/`Card`.

| Part | Element | Notes |
| --- | --- | --- |
| `Badge` | `span` | `variant` prop, one of the 10 values in the table above; default `default`; content via `children` (this project's existing convention for text content, e.g. `Button`/`Alert`, not Figma's own generated `label` string-prop shape) |

- `secondaryIcon`'s icon is a plain consumer-supplied child (e.g. an inline `<svg>`), same
  free-form-icon pattern already established for `Alert` — not a dedicated icon prop
- no `size` prop — Figma shows one fixed size per variant (22px or 20px, driven by which variant,
  not a separate size axis)

### Accessibility

- `Badge` renders no interactive semantics — it is not a button or link in any of the 10
  examples; nothing to focus or keyboard-navigate
- color is never the only signal within a single badge — each variant always pairs its color with
  visible text (or icon+text for `secondaryIcon`), so no additional non-color affordance is needed

### Out of scope

- generalizing the icon+`gap-1` treatment to every variant — only `secondaryIcon` demonstrates it
- correcting `Secondary_icon`'s color-vs-name drift — kept as Figma names it, drift documented
  above (same precedent as Button's Secondary/`outlinePrimary` drift)
- a numeric-count-specific API (e.g. auto-formatting large numbers) for `defaultNumber`/
  `secondaryNumber` — Figma shows static example text only, not a numeric-formatting contract
- Code Connect (`.figma.ts`) — same blocker as every prior component
- actual implementation (`badge.tsx`, `badge.stories.tsx`) — this is the SPEC section only; no
  component code was written per instruction

## Component — `Avatar`

Source: `src/components/ui/avatar.tsx` (not yet built), stories:
`src/components/ui/avatar.stories.tsx` (not yet built)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", frame **`73:3473`** "Avatar"
— outer documentation-page chrome ignored below. **Note: this outer frame's own description text
("A modal dialog that interrupts the user with important content and expects a response.") is a
Figma copy-paste error — it's word-for-word Alert Dialog's description, not Avatar's. Not used
below**; the four sub-symbols each have their own, correct, specific descriptions instead. Four
example symbols: **`455:365`** "Circle" (32×32, image, no border), **`3141:19830`** "Letters"
(32×32, initials fallback, bordered), **`455:364`** "Square" (32×32, square corners, image),
**`455:363`** "Avatar_group" (three overlapping 32×32 avatars). Verified live via
`get_design_context` on 2026-09-05.

Figma's own per-symbol descriptions: *Circle* — "Circular user avatar — image with initials/icon
fallback." *Letters* — "Avatar showing user initials when no image is set." *Square* —
"Square-cornered avatar variant." *Avatar_group* — "Overlapping stack of avatars for multiple
users, with a +N overflow counter."

Confirmed structural/token facts from the live pull:

- size: 32×32 in every example → Tailwind `size-8`. Checked against the digit-suffix gotcha that
  has bitten every prior component: this project's `space-8` **is** 32px, so `size-8` is correct
  here without needing an arbitrary `var(--space-N)` override — the first size in this component
  library where the bare Tailwind number and this project's remapped scale happen to agree
- `Circle` (image avatar): `rounded-full`, **no border** — `<img class="object-cover rounded-full size-full">`
- `Letters` (fallback avatar): `rounded-full border border-[var(--avatar-border,#e4e4e7)]
  bg-[var(--avatar-background,white)]`, centered uppercase initials
  `text-sm leading-4 text-[var(--avatar-foreground,#09090b)]` ("WW" in the example — two-letter
  initials, not one)
- `Square`: same image treatment as `Circle` but `rounded-[var(--radius-8,8px)]` instead of
  `rounded-full` — exact scale match, no gap (unlike Alert/Alert Dialog's 10px case)
- `Avatar_group`: three avatars in a row, each pulled left by `mr-[-8px]` onto the previous one.
  **8px is this project's `--space-3`**, not `--space-2` (space-2 is 4px) — use `-mr-3`, not a
  literal `-8px` or `-mr-2`, per the same "match by pixel value" rule as every prior component.
  Border pattern: the **first** avatar in the stack has no border (nothing underneath it to
  separate from); every **subsequent** one has `border border-[var(--avatar-border)]` so its edge
  reads distinctly against the avatar it overlaps — this matches `Letters`' existing border
  treatment being reused as a stacking separator, not a new token
- the "+N overflow counter" mentioned in `Avatar_group`'s own Figma description **has no example
  instance anywhere in this pull** (all three group avatars show real images, no counter badge) —
  its shape, position, and trigger threshold are not shown; not building it from the description
  text alone, see Out of scope

### Contract

**New dependency**: `@radix-ui/react-avatar` — not currently in `package.json`. Same tier as
`@radix-ui/react-accordion`/`@radix-ui/react-alert-dialog`. Radix's `Avatar.Image` already
implements the "show image if it loads, otherwise fall through" behavior that Figma's
Circle-vs-Letters split describes — use it rather than hand-rolling image-error detection.

| Part | Radix primitive | Notes |
| --- | --- | --- |
| `Avatar` | `AvatarPrimitive.Root` | `shape` prop: `circle` (default, `rounded-full`) \| `square` (`rounded-[var(--radius-8)]`); `flex size-8 overflow-hidden shrink-0` — **`flex` is required, not decorative**: Radix's `Avatar.Root` renders a `<span>` (`display: inline` by default), which ignores `width`/`height` and never clips `overflow-hidden` unless blockified — confirmed by live browser measurement during the storybook step (a bare `Avatar` rendered 64×64 unclipped instead of 32×32 circular until `flex` was added; it only "looked" correct wherever a flex/grid parent happened to blockify it, e.g. inside `AvatarGroup`) |
| `AvatarImage` | `AvatarPrimitive.Image` | `size-full object-cover` — no border (matches `Circle`/`Square`) |
| `AvatarFallback` | `AvatarPrimitive.Fallback` | `size-full flex items-center justify-center border border-[var(--avatar-border)] bg-[var(--avatar-background)] text-sm leading-4 text-[var(--avatar-foreground)] uppercase` — takes its own `shape` prop for corner rounding (no shared context with `Avatar` Root; a consumer using `shape="square"` must pass it to both, same as this project's other two-prop compounds) |
| `AvatarGroup` | plain `div` wrapper (not a Radix primitive — Radix ships no group primitive) | `flex items-center [&>*:not(:first-child)]:border [&>*:not(:first-child)]:border-[var(--avatar-border)] [&>*:not(:last-child)]:-mr-3` |

- no `size` prop beyond the one fixed 32×32 Figma shows — if a size scale is needed later, it's a
  code-only extension, not in this contract
- `AvatarFallback` initials are consumer-supplied text content (Radix requires manual text, e.g.
  first-letter-of-first-and-last-name logic) — not computed by the component itself
- `shape="square"` is a real, confirmed design-system extension beyond shadcn/ui's stock Avatar
  (which is always circular) — keep it, it has its own named Figma symbol and description, same
  "Figma-set is the contract, generic docs are anatomy-only" principle already applied to Badge

### Accessibility

- `AvatarImage` should always receive a meaningful `alt`; Radix does not enforce this — a
  code-level requirement, not shown in Figma (Figma's own image layers have empty `alt=""`, which
  is a Figma-canvas-rendering artifact, not a real accessibility recommendation)
- `AvatarFallback` renders as plain text — no ARIA role needed, it's not interactive
- no focus states apply — `Avatar` renders no interactive elements in any example

### Out of scope

- the `AvatarGroup` "+N overflow counter" — named in Figma's own description text but no example
  instance shows its shape, position, or trigger threshold; not inventing it from prose alone
- an automatic initials-generation helper (e.g. deriving "WW" from a full name) — Figma shows the
  rendered result only, not the source logic; consumer supplies the initials text directly
- a size scale beyond the one 32×32 example
- Code Connect (`.figma.ts`) — same blocker as every prior component
- actual implementation (`avatar.tsx`, `avatar.stories.tsx`) — this is the SPEC section only; no
  component code was written per instruction

## Component — `Alert`

Source: `src/components/ui/alert.tsx` (not yet built), stories:
`src/components/ui/alert.stories.tsx` (not yet built)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", frame **`73:3398`** "Alert"
— outer documentation-page chrome (title, description, "View in Shadcn" link, divider rules
between examples), ignored below. Three example symbols live on this page: **`73:3445`**
"Default" (icon + title + description), **`381:854`** "Title only" (icon + title, no
description), **`381:855`** "Destructive" (icon + title + description + a bulleted list).
Verified live via `get_design_context` on 2026-09-05.

Figma's own per-symbol descriptions: *Default* — "Inline contextual alert — an informational
message that sits in the document flow (not a toast)." *Title only* — "Alert variant with a title
and no body copy — compact single-line notice." *Destructive* — "Destructive alert variant —
signals an error or failed action."

**"Title only" is not a separate variant** — it is the `default` variant's styling with an
optional `AlertDescription` simply omitted, not a distinct visual treatment or a third `variant`
enum value. Only two real style variants exist: `default` and `destructive`.

**Structural inconsistency found between the three example symbols, resolved by falling back to
generic shadcn/ui docs** (per this project's established priority rule — Figma wins on visual
values, but when Figma's own examples disagree on *structure*, generic docs settle the tie):
`Destructive` and `Title only` both use one icon, sized to the full height of the title(+
description) column beside it — the clean, general structure. `Default` alone duplicates the icon
slot as two separate icon+text flex rows (one real icon, one invisible spacer row for
alignment) — a Figma authoring artifact specific to that one instance, not the general contract.
The real, current `ui.shadcn.com/docs/components/alert` implementation uses a CSS grid
(`grid-cols-[calc(var(--spacing)*4)_1fr] grid-rows-[auto_auto]`, icon as `row-span-2`) to get the
same "icon once, text stacked beside it" result without duplicating the icon — that grid approach
is the contract below, not `Default`'s duplicated-icon flex rows.

Confirmed structural/token facts from the live pull:

- container: `border border-[var(--alert-border-default,#e4e4e7)]
  bg-[var(--alert-background-default,white)] rounded-[var(--radius-lg,10px)]
  px-[var(--px-4,16px)] py-[var(--py-3,12px)]` — **10px radius is the same scale gap already
  documented for Alert Dialog** (no `--radius-10` token); use `rounded-[var(--radius-12)]` for the
  same nearest-fit reason, keep the two consistent
- `px-4`(16px fallback) → this project's `space-5` (16px); `py-3`(12px fallback) → `space-4`
  (12px) — Tailwind `px-5 py-4`, not `px-4 py-3` (same digit-suffix-≠-project-scale gotcha as
  Accordion/Alert Dialog)
- gap between icon and text column: `gap-x-3`(12px fallback) → `space-4` → Tailwind `gap-4`
- icon: 16×16 — **`size-5` in this project's remapped scale, not `size-4`** (same digit-suffix
  gotcha as elsewhere: this project's `size-4` = 12px, `size-5` = 16px; confirmed by computed-style
  measurement during the storybook step, not assumed) — consumer-supplied (each of the three examples uses a **different**
  glyph — a check-circle, a trash icon, and a warning-circle — confirming the icon is a free-form
  child, not a variant-controlled swap slot, matching real shadcn/ui's API where any SVG can be
  passed as the first child)
- title: `text-sm font-medium leading-5` — `text-[var(--alert-foreground-default,#09090b)]` for
  `default`, `text-[var(--alert-foreground-destructive,#e7000b)]` for `destructive`
- description: `text-sm font-normal leading-5`, same two foreground tokens as title (both title
  and description use the *same* foreground color per variant — confirmed, no separate muted tone
  for the description here, unlike Alert Dialog's `dialog-foreground-muted`)
- `Destructive`'s bulleted list (`<ul className="list-disc">`, `<li>` items) is example content
  inside the description slot, not a distinct sub-component — `AlertDescription` accepts arbitrary
  children including lists; no dedicated `AlertList` part exists in the contract
- `tokens.css` already has `--alert-background-success`/`--alert-foreground-success` (pre-synced
  tier-3 tokens) but **no live Figma instance of a `success` alert was found on this page** (only
  Default/Title-only/Destructive) and **no `--alert-border-success` token exists at all** — not
  building a `success` variant now; flagged as backlog, do not invent it from the leftover tokens
  alone

### Contract

No new dependency — `Alert` is a plain styled container, not a Radix primitive (same as `Card`).

| Part | Element | Notes |
| --- | --- | --- |
| `Alert` | `div`, `role="alert"` | `variant` prop: `default` \| `destructive`; grid container: `grid grid-cols-[16px_1fr] grid-rows-[auto_auto] gap-x-4 gap-y-1 rounded-[var(--radius-12)] border px-5 py-4 text-sm`; icon child gets `[&>svg]:row-span-2 [&>svg]:size-5` (16px true size, not `size-4`) |
| `AlertTitle` | `div` | `font-medium leading-5 col-start-2` |
| `AlertDescription` | `div` | `font-normal leading-5 col-start-2` — accepts arbitrary children (e.g. a `<ul>`) |

- `variant: 'default'` → `border-[var(--alert-border-default)] bg-[var(--alert-background-default)] text-[var(--alert-foreground-default)]`
- `variant: 'destructive'` → `border-[var(--alert-border-destructive)] bg-[var(--alert-background-default)] text-[var(--alert-foreground-destructive)]` (background stays the default surface per the live pull — only the border and text/icon color change on `destructive`, background does not swap to a tinted destructive fill)
- no `size` prop — Figma shows one fixed size
- icon is a plain child (`<svg>`/icon component), not a named prop — matches the confirmed
  free-form-glyph finding above

### Accessibility

- `role="alert"` on the root so assistive tech announces it as a live region — this is a static,
  code-level a11y requirement (Figma has no concept of ARIA roles), consistent with how Accordion's
  focus-visible ring was added as a code-only requirement not shown in Figma
- no interactive elements inside `Alert` itself (no button/dismiss action in any of the three
  examples) — nothing to focus-trap or keyboard-navigate

### Out of scope

- `Default`'s duplicated-icon flex-row structure — a Figma authoring artifact, not the contract
  (see "Structural inconsistency" above)
- a `success` variant — tokens exist but no live Figma instance and no border token; backlog only
- a dismiss/close button — none of the three Figma examples show one; not part of this contract
- exact radius: same documented scale-gap nearest-fit as Alert Dialog (`radius-12` for a 10px
  design value)
- Code Connect (`.figma.ts`) — same blocker as every other component so far
- actual implementation (`alert.tsx`, `alert.stories.tsx`) — this is the SPEC section only; no
  component code was written per instruction

## Component — `Alert Dialog`

Source: `src/components/ui/alert-dialog.tsx` (not yet built), stories:
`src/components/ui/alert-dialog.stories.tsx` (not yet built)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", frame **`402:419`**
"Alert Dialog" — outer documentation-page chrome (title, description, "View in Shadcn" link),
ignored below. The reusable component lives at frame **`73:5720`** "Alert dialog", containing two
state symbols: **`73:5719`** "State=Button" (112×36, the demo trigger) and **`1061:2210`**
"State=open" (552×400, the open dialog). Verified live via `get_design_context` on 2026-09-05.

Figma's own component description: *"Modal that interrupts the user to confirm an important or
destructive action; blocks the background until resolved."*

Figma variant axis: **State** — `Button` (closed, showing only the trigger) / `open`.

The `open` symbol's outer `400×552` canvas with `p-5`(20px) padding is Figma's fixed demo-frame
sizing, not the real component — a real `AlertDialogOverlay` is a fullscreen fixed backdrop, not
a 400×552 box. Same "outer frame is Figma canvas, not the contract" caveat as Accordion's `73:3341`.

Confirmed structural/token facts from the live pull:

- dialog surface: `bg-[var(--background)] border border-[var(--border)]`, two-layer drop shadow
  that is exactly Tailwind's built-in `shadow-lg` (`0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px
  rgba(0,0,0,.1)` — confirmed against the file's own named effect style "Box Shadow/shadow-lg") —
  use the `shadow-lg` utility directly, no custom token needed (`tokens.css` has no `--shadow-*`
  scale, so Tailwind's default is untouched and already correct)
- corner radius: Figma's raw pull gives `var(--radius-lg, 10px)`. **10px is not in this project's
  radius scale** (`--radius-2/4/8/12/14/16/24/32/48/full/none` — confirmed via `tokens.css`, no
  `--radius-10`). Nearest steps are 8 and 12, equally close numerically. `Card` (the closest
  existing "elevated surface" precedent) already snaps a non-matching Figma radius to a bigger
  step than `Button`'s 8 (`rounded-[var(--radius-14)]`, not 8) — following that precedent, use
  **`rounded-[var(--radius-12)]`**, not 8. Flagging this as a real scale gap, not a confident exact
  match — if Figma is later re-measured and a `--radius-10` step gets added, revisit
- content padding: `p-[var(--p-6,24px)]` → this project's `--space-4` scale index for 24px is
  **`space-7`** (scale: `space-0..12` = 0,2,4,8,12,16,20,24,32,40,48,64,96px), i.e. Tailwind
  `p-7` — same "Figma's raw digit suffix ≠ this project's key" gotcha as Accordion/Button; verify
  by pixel value, not by copying `p-6` literally
- gap between the header block and the footer: `gap-[var(--gap-4,16px)]` → 16px = `space-5` →
  Tailwind `gap-5` (not `gap-4`)
- header block (title + description): `flex flex-col gap-[var(--gap-2,8px)]` → 8px = `space-3` →
  Tailwind `gap-3` (not `gap-2`)
- title: `font-['Geist:Regular'] font-normal text-lg leading-[var(--line-height-7,28px)]
  text-[var(--foreground)]` — **`font-normal`, not `font-semibold`**. This is a real, confirmed
  divergence from generic shadcn/ui docs (whose default `AlertDialogTitle` is `font-semibold`);
  per this project's established doc-priority rule (Figma wins over generic docs when they
  disagree — same principle already applied to Badge's variant set), the Figma-normal weight is
  the contract here, not the docs' semibold
- description: `text-sm font-normal leading-5 text-[var(--muted-foreground)]` — component-scoped
  `--dialog-foreground-muted` token exists in `tokens.css` and is more precise than the generic
  `--muted-foreground` Figma's raw pull names; use the component-scoped one (same pattern as
  Accordion's `--accordion-foreground`)
- footer buttons: two instances of this repo's own `Button` component — left one uses
  `border-[var(--button-border-outline)] bg-[var(--button-background-outline)]
  text-[var(--button-foreground-outline)]` (= `Button`'s existing `outline` variant, unchanged),
  right one uses `bg-[var(--button-background)] text-[var(--button-foreground)]` (= `Button`'s
  existing `default` variant) — both already-published tokens on the instances, not raw values,
  confirming these are real `Button` instances, not custom-styled lookalikes
- footer order in Figma (left → right): outline "Label" then default "Label" — matches Radix/
  shadcn's conventional DOM order `Cancel` then `Action`, no divergence to reconcile
- demo copy ("Are you absolutely sure?" / "This action cannot be undone..." / "Show dialog") is
  Figma's example content only, not a fixed contract — same caveat as Accordion's placeholder text

**Token bug found and fixed in `tokens.css` before writing this component** (not part of Alert
Dialog's own contract, but blocking it): `--dialog-background` was declared twice inside the same
`:root, [data-theme='light']` block — once as a translucent scrim color
(`--color-alpha-black-20`), once as the opaque card-surface color (`var(--background)`) — the
second silently won, so `--dialog-scrim` (which aliased `--dialog-background`) resolved to an
**opaque** background in light mode instead of a translucent backdrop. The dark-theme block had
the mirror-image bug: it only overrode the scrim-flavored value, leaving `--dialog-background`
itself translucent in dark mode. Fixed by splitting the collision into two independently-named
variables (`--dialog-background` = surface, `--dialog-scrim` = backdrop) in both theme blocks, and
repointing `--drawer-scrim`/`--sheet-scrim` (same collision, same root cause) at the fixed
`--dialog-scrim` instead of at `--dialog-background`.

### Contract

**New dependency**: `@radix-ui/react-alert-dialog` — not currently in `package.json`. Same tier as
`@radix-ui/react-accordion`.

Compound parts (Radix `Root`/`Trigger`/`Portal`/`Overlay`/`Content`/`Title`/`Description`/
`Action`/`Cancel`; `Header`/`Footer` are plain layout `div`s per shadcn convention, not Radix
primitives):

| Part | Radix primitive | Notes |
| --- | --- | --- |
| `AlertDialog` | `AlertDialogPrimitive.Root` | |
| `AlertDialogTrigger` | `AlertDialogPrimitive.Trigger` | consumer supplies the trigger content (often `asChild` + this repo's `Button`) — Figma's "Show dialog" is a demo only, not a fixed contract |
| `AlertDialogPortal` | `AlertDialogPrimitive.Portal` | |
| `AlertDialogOverlay` | `AlertDialogPrimitive.Overlay` | `fixed inset-0 z-50 bg-[var(--dialog-scrim)]`; fullscreen — Figma's 400×552 canvas is demo sizing only |
| `AlertDialogContent` | `AlertDialogPrimitive.Content` | `bg-[var(--dialog-background)] border border-[var(--dialog-border)] rounded-[var(--radius-12)] shadow-lg flex flex-col gap-5 p-7`, fixed/centered (`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`), `z-50` |
| `AlertDialogHeader` | plain `div` | `flex flex-col gap-3 text-left` |
| `AlertDialogFooter` | plain `div` | `flex items-center justify-end gap-3` |
| `AlertDialogTitle` | `AlertDialogPrimitive.Title` | `text-lg font-normal leading-7 text-[var(--dialog-foreground)]` |
| `AlertDialogDescription` | `AlertDialogPrimitive.Description` | `text-sm font-normal leading-5 text-[var(--dialog-foreground-muted)]` |
| `AlertDialogAction` | `AlertDialogPrimitive.Action` | styled with `buttonVariants()` (default/primary) — reuse `Button`'s `cva`, don't reimplement |
| `AlertDialogCancel` | `AlertDialogPrimitive.Cancel` | styled with `buttonVariants({ variant: 'outline' })` |

- no `size` prop — Figma shows one fixed size
- unlike `Dialog`, `AlertDialogPrimitive.Content` does not dismiss on outside click, by Radix's
  own design (`onPointerDownOutside`/`onInteractOutside` call `preventDefault()` internally,
  confirmed by reading `@radix-ui/react-alert-dialog`'s source and by browser verification) — do
  not add custom dismiss-on-outside-click behavior, that would contradict the component's purpose.
  **Escape does still close it** (falls through to the underlying Dialog primitive's default
  Escape handling, acting like `Cancel`) — this is real Radix/shadcn behavior, not a bug; an
  earlier draft of this SPEC incorrectly claimed Escape was blocked too, corrected after live
  verification
- open/close fade+scale animation on `Overlay`/`Content` — no motion spec was in the Figma pull
  (only `Button`/`open` states, no transition frames), so exact easing/duration is a code-only
  decision, consistent with Accordion's reduced-motion note

### Accessibility

- Radix sets `role="alertdialog"`, `aria-labelledby` (→ `Title`), `aria-describedby` (→
  `Description`) automatically — do not hand-roll these
- focus moves into the dialog on open and returns to the trigger on close automatically (Radix
  focus trap); rely on Radix's defaults rather than reimplementing
- reduced-motion: the fade+scale transition should respect `prefers-reduced-motion`, consistent
  with Accordion's and Button's reduced-motion notes
- no disabled/hover states in Figma or required by the pull — `Action`/`Cancel` inherit whatever
  hover/disabled treatment `Button`'s own `cva` already defines, nothing new to add here

### Out of scope

- the trigger's visual styling — Figma's "Show dialog" is a demo only; the real component accepts
  arbitrary trigger content via `asChild`
- the 400×552 demo canvas sizing and its `p-5` padding — Figma frame artifact, not the real
  fullscreen `Overlay` behavior
- exact radius: flagged as a scale gap (10px has no exact token), `radius-12` is a documented
  nearest-fit choice, not a confirmed exact match
- Code Connect (`.figma.ts`) — same blocker as Button/Accordion (needs a Figma Organization plan)
- actual implementation (`alert-dialog.tsx`, `alert-dialog.stories.tsx`) — this is the SPEC
  section only; no component code was written per instruction

## Component — `Calendar`

Source: `src/components/ui/calendar.tsx` (not yet built — see "Out of scope") · stories:
`src/components/ui/calendar.stories.tsx` (not yet built)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", page frame **`73:3711`**
"Calendar". **No live Figma MCP access this session** — this section is written from the LEAD's
`FIGMA-BRIEF-calendar.md` (Figma MCP pull, 2026-09-06), not independently re-verified against a
live node.

`73:3711` shows **one component** (`Calendar`, a thin wrapper over `react-day-picker` v9 — new
dependency, user-approved 2026-09-06) in several prop configurations, plus two Popover
compositions. Figma's config symbols are **not separate components** — same "one component,
several prop values" pattern as Alert's "Title only". Mapping (flag any of these being read as
distinct components as drift):

| Figma symbol / label | code |
| --- | --- |
| Calendar — base, single month (`502:3312`) | `<Calendar mode="single" captionLayout="dropdown" />` |
| Range Calendar (`502:3314`) | `<Calendar mode="range" numberOfMonths={2} captionLayout="label" />` |
| Month and Year Selector (`502:3321`) — "Month and Year" | `captionLayout="dropdown"` |
| … "Month Only" | `captionLayout="dropdown-months"` |
| … "Year Only" | `captionLayout="dropdown-years"` |
| 2-month / Custom-Cell caption ("June 2025" centred) | `captionLayout="label"` (RDP default) |
| Custom Cell Size (`1463:5909`) | `<Calendar className="[--cell-size:3rem]" captionLayout="label" />` — **no `size` prop** (see Cell size) |
| "Dropdown" `<select>` shown under the calendars (`502:3321`) | Storybook `argTypes` select control on the story — **not** a `Select` component |
| Date of Birth Picker (`502:3324`) | story-level `DatePickerDemo()` in `calendar.stories.tsx` — `Popover` + `<Calendar mode="single" captionLayout="dropdown" />` |
| Date and Time Picker (`502:3327`) | story-level `DateTimePickerDemo()` — the DoB popover (narrower) + this repo's `Input type="time" step="1"` |

The two pickers are **demo compositions, not new primitives** — small functions inside the
stories file, exactly like `AccordionDemo` / `AlertDialogDemo`.

Not added (user decision 2026-09-06): `date-fns` (the picker stories format the selected date with
native `Intl.DateTimeFormat(undefined, { dateStyle: 'long' })`); `lucide-react` (chevrons are
inline `<svg>`, like `accordion.tsx`). `react-day-picker` v9 does its own date math internally —
there is no `date-fns` **peer** dependency to add. If `date-fns` shows up in the lockfile it is
RDP's own bundled copy, which this repo neither imports from nor lists in `package.json`.

### Contract

Not yet implemented — `calendar.tsx` / `popover.tsx` do not exist (`src/components/ui/` currently
has `accordion` `alert-dialog` `button` `card` `input`). This specifies what the builder
implements, following shadcn's own RDP-v9 `Calendar` wrapper and this repo's Radix-primitive
convention.

**New dependencies**: `react-day-picker@^9`, `@radix-ui/react-popover@^1` (same tier as the four
`@radix-ui/*` packages already in `package.json`).

`Calendar` is `React.ComponentProps<typeof DayPicker>` intersected with `{ buttonVariant? }` — the
full `DayPicker` prop surface passes through. In-scope props:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `mode` | `"single" \| "multiple" \| "range"` | none (display-only) | passthrough; `selected` / `onSelect` types follow `mode` |
| `selected` / `onSelect` | per `mode` | — | passthrough; v9 `onSelect(value, triggerDate, modifiers, e)` |
| `captionLayout` | `"label" \| "dropdown" \| "dropdown-months" \| "dropdown-years"` | `"label"` | `label` = static "June 2025"; `dropdown` = month + year `<select>`; `dropdown-months` / `dropdown-years` = one `<select>` + one label |
| `numberOfMonths` | `number` | `1` | `2` for the range view; RDP shows the prev chevron on the first month and the next chevron on the last only |
| `disabled` | RDP `Matcher \| Matcher[]` | — | matching days get `disabled` + `aria-disabled`, non-interactive |
| `showOutsideDays` | `boolean` | `true` | adjacent-month leading/trailing days rendered at `opacity-50` |
| `startMonth` / `endMonth` | `Date` | — | bound month nav and the `dropdown-years` range; the DoB picker sets these |
| `buttonVariant` | this repo's `Button` `variant` | `"ghost"` | nav-button style (shadcn v9 prop) |
| `className` | `string` | — | on the RDP root; carries `[--cell-size:…]` overrides |
| `classNames` | `Partial<ReturnType<typeof getDefaultClassNames>>` | — | per-part class overrides (RDP passthrough) |
| `components` | RDP `CustomComponents` | wrapper presets `Chevron` (inline `<svg>`) | consumer may extend / override |
| …rest | `DayPickerProps` | — | `month`, `defaultMonth`, `weekStartsOn`, `min`, `max`, `required`, `locale`, `formatters`, … all pass through |

**No `size` prop.** Day / weekday / nav cell scale is the shadcn-v9 `--cell-size` CSS custom
property set on the RDP root: default `[--cell-size:2rem]` (32px — matches Figma's 32px day
cell). Per-instance override is a `className`, e.g. Custom Cell Size passes
`className="[--cell-size:3rem]"` (≈48px). A bespoke `size` enum would duplicate a native
mechanism for a single story — not added.

Structure / tokens a reviewer checks (resolve every px→key by **value**, not digit — this repo's
`--space-N` / `--height-N` / `--radius-N` scales differ from stock Tailwind, the same gotcha
already documented for Button / Accordion / Alert / Alert Dialog):

- **container** (RDP `root`): `bg-popover-background border border-popover-border
  rounded-[var(--radius-12)] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]`, `flex flex-col gap-5`
  (`p-4` = `--space-4` = 12px; `gap-5` = `--space-5` = 16px; the shadow value equals `Card`'s)
- **months wrapper** (2-month view): `gap-5` (16px) between months
- **nav buttons** (`button_previous` / `button_next`): `size-[var(--cell-size)]` (32px),
  `rounded-8` (Figma 6px → nearest repo step, +2px), inline `<svg>` chevron 16px `currentColor`,
  hover `bg-accent` (from `buttonVariant="ghost"`), `focus-visible:ring-2 focus-visible:ring-ring`
- **caption `label`**: centred `text-sm font-medium text-foreground` ("June 2025"); text comes
  from RDP's default formatter (English) — a `formatters` + `Intl.DateTimeFormat` override is
  available but not needed to match Figma
- **caption `dropdown*`**: RDP native `<select>` per unit, styled as a pill —
  `h-[var(--height-32)] rounded-8 border border-border bg-background text-sm font-medium
  text-foreground` + inline `<svg>` down-chevron ≈12px; **keep the native `<select>`** (see a11y),
  style via `classNames`
- **weekday header**: `text-xs font-normal text-muted-foreground`, cell width `--cell-size`,
  labels from RDP (Su Mo Tu We Th Fr Sa)

Day-cell states (RDP modifier → styling; `text-sm font-normal`, box is `--cell-size` square):

| State | RDP modifier | Styling (tokens) |
| --- | --- | --- |
| default | — | `text-foreground` |
| hover | — | `bg-accent text-accent-foreground` |
| selected (single / multiple) | `selected` | `bg-primary text-primary-foreground rounded-8` |
| today (not selected) | `today` | `bg-accent text-accent-foreground rounded-8` |
| outside month | `outside` | `text-muted-foreground opacity-50` (only when `showOutsideDays`) |
| disabled | `disabled` | `text-muted-foreground opacity-50 pointer-events-none` + `aria-disabled` |
| range start | `range_start` | `bg-primary text-primary-foreground rounded-l-8` (full `rounded-8` when start === end) |
| range end | `range_end` | `bg-primary text-primary-foreground rounded-r-8` |
| range middle | `range_middle` | `bg-accent text-accent-foreground` — square, continuous band |
| focus-visible (keyboard) | `focused` | `focus-visible:ring-2 focus-visible:ring-ring` on the day button |

`selected` wins over `today` when both apply. No `loading` / pressed / active state — RDP days are
plain buttons and Figma shows none.

### Story compositions (demo-level, in `calendar.stories.tsx` — not exported primitives)

- **`DatePickerDemo`** (`502:3324`): label "Date of birth" (`text-sm font-medium`) above a
  `Popover`. Trigger = `Button variant="outline"` ≈`w-[240px]`, `justify-between`; left text
  "Select a date" (`text-muted-foreground`) when empty, else
  `Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date)`; trailing inline-`<svg>`
  chevron 16px. `PopoverContent className="w-auto p-0"` wraps
  `<Calendar mode="single" captionLayout="dropdown" startMonth={…} endMonth={…} />`. Selecting a
  day sets the story's `open` state to `false` (closes the popover).
- **`DateTimePickerDemo`** (`502:3327`): `flex gap-5`. Left = `DatePickerDemo`'s popover, narrower
  (≈`w-[150px]`). Right = label "Time" + `<Input type="time" step="1" defaultValue="10:30:00" />`
  — this repo's existing `Input`, **no change to `input.tsx`** (`type` and `className` already
  pass through); optional `className="[&::-webkit-calendar-picker-indicator]:hidden"` if the
  native time icon looks off.

### Token resolution & open gaps for LEAD

- **Figma `radius-lg` 10px** (calendar container, and Popover content) — no `--radius-10` in
  `tokens.css`. Spec'd as **`rounded-[var(--radius-12)]`** (+2px), matching the same nearest-fit
  already chosen for `Alert` and `Alert Dialog` at this exact 10px value. (`Card` independently
  snapped its own non-matching radius to `--radius-14`.) Revisit if a `--radius-10` token is added.
- **Figma nav-button radius 6px** — no `--radius-6`; `--radius-4` and `--radius-8` are
  equidistant. Spec'd as **`rounded-8`** to match this repo's `Button` corner and the day cells.
  Flag, not an exact match.
- **6px pill gap** (between caption `<select>`s) has no key in this repo's spacing scale
  (`--space-1` 2px / `--space-2` 4px / `--space-3` 8px); `gap-[6px]` or snap to `gap-2` / `gap-3`
  — builder's call, cosmetic.
- **`--cell-size` default `2rem`** is a literal, not a token — 32px matches Figma, no token needed.

### Accessibility

- `react-day-picker` v9 renders a real `role="grid"` table: `gridcell` day buttons with per-day
  `aria-label` and `aria-selected`, roving `tabindex`, and built-in keyboard nav (arrow keys,
  Home / End, PageUp / PageDown for months, Shift+PageUp / PageDown for years). Rely on RDP — do
  not reimplement grid semantics or key handling.
- nav buttons are real `<button>`s with RDP-supplied `aria-label`s and `aria-disabled` at the
  `startMonth` / `endMonth` bounds; add the house `focus-visible:ring-2 focus-visible:ring-ring`.
- day buttons get the same `focus-visible` ring; focus **movement** is RDP's, the ring is ours.
- `captionLayout="dropdown*"` uses native `<select>` — keyboard/AT-accessible for free, RDP gives
  each an accessible name ("Choose the Month" / "Choose the Year"). Do **not** swap in a custom
  listbox (out of scope).
- reduced-motion: `Calendar` has no animation of its own (month nav is instant) — nothing to gate.
- picker trigger (story-level): the trigger `Button` must carry an accessible name — the visible
  label plus `aria-label` / `aria-labelledby` tying it to the field label ("Date of birth" /
  "Time"), since "Select a date" alone is ambiguous out of context.

### Out of scope

- `calendar.tsx` / `calendar.stories.tsx` implementation — this is the SPEC section only; no
  component code was written per instruction
- the two picker compositions as shipped primitives — they are demo functions in
  `calendar.stories.tsx`, not exports; `input.tsx` is not modified
- a standalone `Select` for the caption — RDP's native `<select>` is kept and styled via
  `classNames`
- i18n: `locale` prop, `date-fns` locale, localized month / weekday names beyond the browser
  default; RDP `formatters` not customised (defaults are English, which matches Figma)
- time-zone handling — JS `Date` / RDP operate in local time only; no TZ prop
- multi-month range beyond `numberOfMonths={2}`
- week-number column, `ISOWeek`, calendar footer
- exact radius (10px / 6px) — documented nearest-fit, see "open gaps" above
- Code Connect (`.figma.ts`) — same Figma-Org-plan blocker as every prior component

## Component — `Popover`

Source: `src/components/ui/popover.tsx` (not yet built) · stories:
`src/components/ui/popover.stories.tsx` (not yet built — basic open/closed), also exercised by the
picker compositions in `calendar.stories.tsx`

### Figma

No dedicated Popover page. Popover appears only as the shell of the two picker compositions on
`73:3711` (DoB picker `502:3324`, Date & Time picker `502:3327`), per `FIGMA-BRIEF-calendar.md` —
**no live Figma MCP access this session**. There is no variant axis: Figma shows one open popover
containing a `Calendar`. Everything visual inside belongs to `Calendar`; `Popover` contributes the
surface + positioning only.

### Contract

**New dependency**: `@radix-ui/react-popover@^1`. Thin wrapper, shadcn-style, matching this repo's
`alert-dialog.tsx` conventions — **manual `data-[state]` transitions** (this repo has no
`tailwindcss-animate` plugin; `tailwind.config.cjs` sets `plugins: []`).

| Part | Radix primitive | Notes |
| --- | --- | --- |
| `Popover` | `PopoverPrimitive.Root` | re-export; `modal` passthrough (Radix default `false`) |
| `PopoverTrigger` | `PopoverPrimitive.Trigger` | re-export; usually `asChild` + this repo's `Button` |
| `PopoverAnchor` | `PopoverPrimitive.Anchor` | re-export; optional — positioning ref when it differs from the trigger |
| `PopoverContent` | `PopoverPrimitive.Portal` › `PopoverPrimitive.Content` | styled; forwards `align` / `sideOffset` |

`PopoverContent` defaults & styling:

- `align="center"`, `sideOffset={4}` (shadcn defaults); `side="bottom"` (Radix default);
  `avoidCollisions` on (Radix default) — auto-flips near the viewport edge
- classes: `z-50 w-72 rounded-[var(--radius-12)] border border-popover-border
  bg-popover-background p-4 text-popover-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]
  outline-none` — `--popover-background` / `--popover-border` / `--popover-foreground` all exist
  in `tokens.css` and flip for dark + the `applicant` brand, so `Popover` stays theme-agnostic
- open/close transition (mirrors `alert-dialog.tsx`): `transition-[opacity,transform] duration-200
  data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=open]:opacity-100
  data-[state=open]:scale-100`
- the picker compositions override `className="w-auto p-0"` so the content shrink-wraps the
  `Calendar`

### Interaction states

| Trigger | Behaviour |
| --- | --- |
| rest | trigger only; content not mounted |
| open (click / Enter / Space) | Radix mounts content in a portal, positions it, moves focus into the content (`onOpenAutoFocus`) |
| Esc | closes; focus returns to the trigger |
| outside pointer-down / focus leaves content | closes; focus returns to the trigger |
| focus-visible | the trigger uses whatever `focus-visible` ring its own element defines (the `Button` ring when `asChild` + `Button`); `Popover` adds none |
| disabled / loading | not applicable — `Popover` has no such state; a disabled trigger is the consumer's `Button` |

### Accessibility

- **Focus trap**: only when `Popover modal` is set. Radix default is **non-modal**
  (`modal={false}`) — focus is *managed* (into content on open, back to trigger on close) but not
  *trapped*, there is no scroll-lock, and the background stays interactive. The pickers use the
  non-modal default; selecting a day sets the story's `open` to `false`, closing the popover and
  restoring focus.
- **Esc** always closes and restores focus, in both modes.
- **Labelling**: Radix Popover has no `Title` / `Description` primitive. Radix sets the trigger's
  `aria-haspopup` / `aria-expanded` / `aria-controls` and gives the content an `id`; it does not
  auto-label the content. For the pickers the `Calendar` grid is self-describing; the trigger
  `Button` carries the accessible name (see Calendar › Accessibility).
- reduced-motion: the opacity/scale transition should respect `prefers-reduced-motion`, consistent
  with `Button` / `Alert Dialog` notes; exact easing/duration is a code decision (no motion spec
  in Figma).

### Out of scope

- `popover.tsx` / `popover.stories.tsx` implementation — SPEC section only
- `PopoverArrow` — not in Figma, not exported (can be added later)
- `Title` / `Description` sub-parts — Radix Popover has none; labelling is the consumer's job
- a custom focus trap in non-modal mode — pass Radix `modal` if a trap is required
- `tailwindcss-animate` enter/exit keyframes — this repo uses manual `data-[state]` transitions
- exact radius (10px `radius-lg`) — same documented `--radius-12` nearest-fit as `Calendar`
- Code Connect (`.figma.ts`) — same blocker as every prior component
