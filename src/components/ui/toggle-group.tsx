import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from '../../lib/utils';

// Figma "Icon Group" (3223:37201) is a single-select segmented control: the selected item is
// filled with the brand (Button's `default` tokens), the rest are neutral (Button's `secondary`
// / "Filled" tokens), no border on either. Items share width (`flex-1`). Radix ToggleGroup
// supplies the roving tabindex + arrow-key nav + radiogroup semantics. See SPEC.md "Toggle Group".
//
// Resolve Figma's arbitrary values against this project's non-linear scale by pixel, not by
// digit (see .claude/agents/builder.md): Figma px-[13px] → px-4 (--space-4 = 12px, nearest real
// token); Figma py = --space-3 = 8px → py-3; h-44 / rounded-8 / text-sm / leading-5 all match
// Button. Shadow copied verbatim from button.tsx — Figma's "shadow-xs" is 0.1 alpha, but
// Tailwind's shadow-xs utility is 0.05, so Button uses this explicit value and so does this.
const toggleGroupItemClass =
  'inline-flex items-center justify-center h-[var(--height-44)] rounded-8 px-4 py-3 text-sm font-medium leading-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] whitespace-nowrap bg-[var(--secondary)] text-[var(--button-foreground-filled)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 data-[state=on]:bg-button-background data-[state=on]:text-button-foreground';

/**
 * Segmented control: a row of `ToggleGroupItem`s where the selected one carries the brand fill
 * and the rest the neutral fill. `type="single"` (the Figma case) or `"multiple"`. Roving
 * tabindex, arrow-key navigation and `aria-checked`/`aria-pressed` come from Radix. Icon-only
 * items need an `aria-label`. Reconciled with Figma "Icon Group" `3223:37201`
 * (figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW); contract in SPEC.md § Toggle Group.
 */
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center gap-4 [&>*]:flex-1', className)}
    {...props}
  />
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleGroupItemClass, className)} {...props} />
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
