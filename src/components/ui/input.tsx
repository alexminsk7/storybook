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
          'flex h-10 w-full rounded-8 border bg-input-background px-3 py-2 text-sm text-input-foreground outline-none transition-colors placeholder:text-input-foreground-placeholder disabled:cursor-not-allowed disabled:bg-input-background-disabled disabled:text-button-foreground-disabled',
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
