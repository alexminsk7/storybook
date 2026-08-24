import * as React from 'react';

import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          // h-10 collides with the overridden `spacing` scale and resolves to 48px, not 40px
          // — see the same note in button.tsx. Matches the button's default height (44px) for
          // visual alignment in forms; not independently verified against a Figma Input frame.
          // px-4 (not px-3): Figma binds --space-4 (12px) to horizontal padding, confirmed on
          // all three states (520:3061 / 588:103 / 3065:376) individually. Disabled is
          // opacity-only there too — same colors faded to 60%, not a swap to a muted fill.
          'flex h-[var(--height-44)] w-full rounded-8 border bg-input-background px-4 py-2 text-sm leading-5 text-input-foreground outline-none transition-colors placeholder:text-input-foreground-placeholder disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-destructive-foreground focus:border-destructive-foreground focus:ring-2 focus:ring-destructive-foreground/20'
            : 'border-input-border focus:border-input-border-focus focus:ring-2 focus:ring-ring/20',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
