import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  // Pressed and Disabled are opacity-only in Figma (opacity-80 / opacity-60 on every one of the
  // eight types, base colors unchanged) — not a swap to different background tokens. The
  // --button-background-active/-disabled tokens exist in tokens.css but the component never
  // binds them, so applying them here made Disabled render grey instead of a faded variant.
  'inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-8 text-sm font-medium leading-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] transition-[color,background-color,opacity] outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-80 disabled:opacity-60 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
  {
    variants: {
      // Hover is the one state Figma does not document (its States are Default/Pressed/Disabled
      // only), so it stays a web-only addition on top of the Figma-exact states.
      variant: {
        default: 'bg-button-background text-button-foreground hover:bg-button-background-hover',
        secondary:
          'border border-button-border-outline bg-button-background-filled text-button-foreground-filled hover:bg-button-background-ghost-hover',
        outline:
          'border border-button-border-outline bg-button-background-outline text-button-foreground-outline hover:bg-button-background-ghost-hover',
        outlinePrimary:
          'border border-button-border-secondary bg-button-background-outline text-button-foreground-secondary hover:bg-button-background-ghost-hover',
        ghost:
          'bg-transparent text-button-foreground-outline shadow-none hover:bg-button-background-ghost-hover',
        ghostPrimary:
          'bg-transparent text-button-foreground-ghost-primary shadow-none hover:bg-button-background-ghost-hover',
        link: 'bg-transparent text-button-foreground-link underline underline-offset-4 shadow-none hover:bg-button-background-ghost-hover',
        destructive:
          'bg-button-background-destructive text-button-foreground hover:bg-button-background-destructive-hover',
      },
      size: {
        // h-10/h-11/w-10 etc. are ambiguous here: our custom `spacing` scale (0-12) silently
        // overrides Tailwind's default height/width scale (which derives from `spacing` by
        // default) for the SAME keys, so bare `h-10` resolves to --space-10 (48px), not the
        // 40px a reader would expect. Using the CSS var directly removes all ambiguity.
        // H44 with --space-5 (16px) horizontal / --space-3 (8px) vertical padding, per Figma.
        default: 'h-[var(--height-44)] px-5 py-3',
        // NOTE: this height scale is literal-pixel (height-N = Npx), not a step scale like
        // Tailwind's own default (where "8" conventionally means 32px). h-[var(--height-8)]
        // was wrong here for exactly that reason — it rendered an 8px-tall button whose own
        // text overflowed it, which is the Cancel/Confirm overlap bug. Fixed to height-32.
        sm: 'h-[var(--height-32)] rounded-4 px-4 py-2 text-xs', // Figma's Button page has no sm/lg examples, best guess
        lg: 'h-[var(--height-48)] rounded-8 px-6 py-3', // Figma's Button page has no sm/lg examples, best guess
        xl: 'h-[var(--height-56)] rounded-8 px-8 py-4', // no Figma frame either — per PRD, one step up from lg
        icon: 'h-[var(--height-44)] w-[var(--height-44)] p-0', // square, matches default height
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : null}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
