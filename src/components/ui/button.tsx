import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-8 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-button-background text-button-foreground hover:bg-button-background-hover active:bg-button-background-active disabled:bg-button-background-disabled disabled:text-button-foreground-disabled',
        secondary:
          'bg-button-background-filled text-button-foreground-filled hover:opacity-90 active:opacity-80 disabled:bg-button-background-disabled disabled:text-button-foreground-disabled disabled:opacity-100',
        outline:
          'border border-button-border-outline bg-button-background-outline text-button-foreground-outline hover:bg-button-background-ghost-hover disabled:border-border disabled:text-button-foreground-disabled disabled:bg-button-background-outline',
        outlinePrimary:
          'border border-button-border-secondary bg-button-background-outline text-button-foreground-secondary hover:bg-button-background-ghost-hover disabled:border-border disabled:text-button-foreground-disabled disabled:bg-button-background-outline',
        ghost:
          'bg-transparent text-foreground hover:bg-button-background-ghost-hover disabled:text-button-foreground-disabled',
        ghostPrimary:
          'bg-transparent text-button-foreground-ghost-primary hover:bg-button-background-ghost-hover disabled:text-button-foreground-disabled',
        link: 'bg-transparent p-0 h-auto text-button-foreground-link underline-offset-4 hover:underline disabled:text-button-foreground-disabled disabled:no-underline',
        destructive:
          'bg-button-background-destructive text-button-foreground-destructive hover:bg-button-background-destructive-hover disabled:bg-button-background-disabled disabled:text-button-foreground-disabled',
      },
      size: {
        // h-10/h-11/w-10 etc. are ambiguous here: our custom `spacing` scale (0-12) silently
        // overrides Tailwind's default height/width scale (which derives from `spacing` by
        // default) for the SAME keys, so bare `h-10` resolves to --space-10 (48px), not the
        // 40px a reader would expect. Using the CSS var directly removes all ambiguity.
        default: 'h-[var(--height-44)] px-4 py-2', // confirmed against Figma Dev Mode: H 44
        // NOTE: this height scale is literal-pixel (height-N = Npx), not a step scale like
        // Tailwind's own default (where "8" conventionally means 32px). h-[var(--height-8)]
        // was wrong here for exactly that reason — it rendered an 8px-tall button whose own
        // text overflowed it, which is the Cancel/Confirm overlap bug. Fixed to height-32.
        sm: 'h-[var(--height-32)] rounded-4 px-3 text-xs', // 32px — Figma's Button page has no sm/lg examples, best guess
        lg: 'h-[var(--height-48)] rounded-8 px-8', // 48px — Figma's Button page has no sm/lg examples, best guess
        icon: 'h-[var(--height-44)] w-[var(--height-44)]', // square, matches default height
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
