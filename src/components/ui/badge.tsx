import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva('inline-flex items-center justify-center rounded-full text-xs font-medium leading-4', {
  variants: {
    variant: {
      default: 'h-[22px] bg-badge-background-default px-3 py-1 text-badge-foreground-default',
      success: 'h-[22px] bg-badge-background-success px-3 py-1 text-badge-foreground-success',
      secondary: 'h-[22px] bg-badge-background-secondary px-3 py-1 text-badge-foreground-secondary',
      // bg token is the "soft" tint; fg token routes around a Figma internal-path export glitch
      // (raw pull names it var(--badge\/foreground-destructive-soft, #e7000b)) — that token
      // doesn't exist, but its fallback value is identical to the real --badge-foreground-destructive.
      destructive: 'h-[22px] bg-badge-background-destructive-soft px-3 py-1 text-badge-foreground-destructive',
      outline: 'h-[22px] border border-badge-border-outline px-3 py-1 text-badge-foreground-outline',
      // Figma name drift: "Secondary_icon" is styled identically to `default` (brand fill), not
      // `secondary` — kept as its own value per Figma's 10-value contract, drift intentional.
      // gap-2 (not gap-1): Figma's raw 4px gap maps to this project's --space-2, not --space-1 (2px).
      secondaryIcon: 'h-[22px] gap-2 bg-badge-background-default px-3 py-1 text-badge-foreground-default',
      defaultNumber: 'h-[var(--height-20)] bg-badge-background-default px-3 py-1 text-badge-foreground-default',
      // solid fill (vs. `destructive`'s soft tint) — reuses foreground-default for contrast on the dark fill.
      destructiveFill: 'h-[var(--height-20)] bg-badge-background-destructive px-3 py-1 text-badge-foreground-default',
      // px-2 py-1 (not a literal px-1/py-0.5 copy of Figma's raw digits): Figma's 4px/2px fallbacks
      // map to this project's --space-2/--space-1.
      secondaryNumber: 'h-[var(--height-20)] border border-badge-border-outline px-2 py-1 font-mono text-badge-foreground-outline',
      info: 'h-[22px] bg-badge-background-info px-3 py-1 text-badge-foreground-info',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
));
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
