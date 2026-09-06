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

## Component — `Breadcrumb`

Source: `src/components/ui/breadcrumb.tsx` (not yet built), stories:
`src/components/ui/breadcrumb.stories.tsx` (not yet built)

### Figma

Design system: `figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW` "Shadcn UI", frame **`101:424`**
"Breadcrumb" — outer documentation-page chrome ignored below. The reusable component set lives
at **`665:2036`**, a real component set with one `Type` variant property and five values:
`custom_seperator` (**`101:634`**), `dropdown` (**`424:448`**), `collapsed` (**`101:633`**),
`link_component` (**`101:632`**), `responsive` (**`101:631`**). Verified live via
`get_design_context` on 2026-09-05.

Figma's own component description: *"Hierarchical navigation trail. Type covers collapsed
overflow, custom separators, dropdown grouping, and responsive behavior."*

**These 5 `Type` values are not a style-variant axis — they are five different USAGE EXAMPLES of
one flexible compound-parts API, not five branches of a component-level `type` prop.** None of
them changes color/size/font; each only changes which children are present (a slash separator
instead of the default chevron, an ellipsis for collapsed overflow, a dropdown-styled item, plain
vs. longer example labels). This matches real shadcn/ui's own Breadcrumb documentation almost
exactly — their docs literally group examples under headings "Custom separator" / "Dropdown" /
"Collapsed" / "Link component", the same four names Figma's `Type` values echo (`responsive` is a
Figma-only fifth example, demonstrating the same collapsed-overflow pattern with different
content, not a sixth structural shape). **No `type` prop is built** — the five Figma instances
become five Storybook stories instead, demonstrating composition, not a switch statement.

Confirmed structural/token facts from the live pull:

- text: every label is `text-sm font-normal leading-5` (14px/400/20px) — links and the trailing
  "ellipsis-truncated" labels use `text-[var(--muted-foreground)]`, the final/current item uses
  `text-[var(--foreground)]` (still `font-normal`, not bold — matches real shadcn's own
  `BreadcrumbPage` exactly, no divergence to flag here for once)
- list gap: `gap-[var(--gap-1\,5,6px)]` (Figma's escaped `1,5` = "1.5", fallback 6px). **This is
  the first spacing value in this component library that needs no digit-suffix correction**: this
  project's `spacing` scale override only replaces the integer keys `0`–`12`; Tailwind's own
  built-in fractional key `1.5` (0.375rem = 6px) is untouched by the override and already equals
  Figma's fallback exactly — `gap-1.5` is correct as literally written, verify this claim in the
  builder step by checking `tailwind.preset.cjs`'s `spacing` object only defines integer keys
  before trusting it, don't assume from this note alone
- separator/ellipsis icons: 14×14. Same reasoning as the gap above — `size-3.5` (Tailwind's
  built-in 0.875rem = 14px) is untouched by this project's integer-only spacing override and
  already matches; verify the same way before trusting it
- the dropdown item's chevron-down icon is 16×16 — **this one does need the usual correction**:
  it's a whole-number Figma size, not a fractional one, so the established "`size-4` = 12px here,
  `size-5` = 16px" rule applies — use `size-5`, not `size-4`
- the dropdown item's internal gap (icon-to-text) is `gap-[var(--space-2,4px)]` — Figma named this
  one directly with this project's own real token name, no correction needed, use `gap-2`
  (matches `--space-2` = 4px)
- default separator = `lucide/chevron-right`; `custom_seperator`/`dropdown` override it with
  `lucide/slash` instead — confirms the separator is swappable per-instance, not fixed
- the `dropdown` instance only demonstrates the **visual affordance** (a chevron-down icon next to
  a breadcrumb item) — no open/closed state, menu items, or interaction is shown or demoed
  anywhere in the pull; not wiring real dropdown-menu behavior (`DropdownMenu` is a separate,
  not-yet-built component in the backlog) — see Out of scope
- `collapsed`/`responsive` both insert a bare `lucide/ellipsis` icon (no visible click target/box
  around it) to represent truncated overflow items

### Contract

No new dependency for the icons/structure — plain HTML elements (`nav`/`ol`/`li`/`a`/`span`), same
category as `Alert`/`Badge`. `BreadcrumbLink` reuses `@radix-ui/react-slot` (already a dependency,
used by `Button`) for `asChild` support, matching real shadcn/ui's own API — needed for router
`Link` compatibility, not a speculative addition.

| Part | Element | Notes |
| --- | --- | --- |
| `Breadcrumb` | `nav` | `aria-label="breadcrumb"` — code-level requirement, not shown in Figma (Figma has no ARIA concept) |
| `BreadcrumbList` | `ol` | `flex flex-wrap items-center gap-1.5 break-words text-sm text-[var(--muted-foreground)]` |
| `BreadcrumbItem` | `li` | `inline-flex items-center gap-1.5` |
| `BreadcrumbLink` | `a` (or `Slot` via `asChild`) | `text-[var(--muted-foreground)] hover:text-[var(--foreground)]` — hover is a code-only addition, Figma shows no hover state (same precedent as every prior interactive-adjacent component) |
| `BreadcrumbPage` | `span` | `role="link" aria-disabled="true" aria-current="page" font-normal text-[var(--foreground)]` — the final, non-link item; `role="link"` tells assistive tech it visually reads as a link even though it isn't interactive (matches real shadcn/ui's own implementation — an omission in an earlier draft of this SPEC, caught during the builder step) |
| `BreadcrumbSeparator` | `li` | `role="presentation" aria-hidden="true"`; default child is a baked-in inline chevron-right svg (`size-3.5`) — matches `accordion.tsx`'s own baked-in chevron pattern; consumer can override by passing a different child (e.g. the slash icon) |
| `BreadcrumbEllipsis` | `span` | `role="presentation" aria-hidden="true"`; bare `size-3.5` ellipsis icon plus a `sr-only` "More" text node — the `sr-only` text is a code-level a11y requirement (Figma's icon is silent to assistive tech on canvas, a real one needs an accessible name) |

- no `size`/`variant` prop on any part — Figma shows one fixed text size/weight throughout every
  example
- the dropdown item is composed from existing parts (`BreadcrumbItem` + `BreadcrumbLink` + a
  chevron-down icon child), not a new named sub-component

### Accessibility

- `nav[aria-label="breadcrumb"]` and `BreadcrumbPage`'s `aria-current="page"`/`aria-disabled` are
  code-level requirements matching real shadcn/ui's own accessible implementation — Figma has no
  ARIA concept, none of this is visible on canvas
- `BreadcrumbSeparator`/`BreadcrumbEllipsis` are `aria-hidden` — decorative, screen readers should
  skip them; `BreadcrumbEllipsis` still needs its `sr-only` "More" text so an icon-only visual
  isn't completely silent if a screen reader does land on it via other navigation
- `BreadcrumbLink` is a real `<a>` (or a real link via `asChild`) — keyboard-focusable and
  activatable by default, no custom keyboard handling needed
- reduced-motion: not applicable — no transitions or animations anywhere in this component

### Out of scope

- real dropdown-menu behavior (open/close, keyboard nav, menu items) for the `dropdown` example —
  only the visual affordance (chevron-down icon) is confirmed in Figma; wiring an actual
  `DropdownMenu` is that component's own future scope, not Breadcrumb's
- a visible/invisible larger tap-target box around `BreadcrumbEllipsis` (real shadcn/ui wraps it
  in a `size-9` hit area) — Figma shows a bare icon with no surrounding box; not inventing one
- automatic collapsing logic (deciding *when* to show an ellipsis based on available width) — both
  `collapsed` and `responsive` are static, pre-collapsed examples; no responsive-measurement code
  is specified here
- Code Connect (`.figma.ts`) — same blocker as every prior component
- actual implementation (`breadcrumb.tsx`, `breadcrumb.stories.tsx`) — this is the SPEC section
  only; no component code was written per instruction

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
