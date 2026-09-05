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
