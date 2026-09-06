import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const alertVariants = cva(
  // size-5, not size-4: this project's remapped spacing scale makes size-4 = 12px, size-5 = 16px.
  'grid grid-cols-[16px_1fr] grid-rows-[auto_auto] gap-x-4 gap-y-1 rounded-[var(--radius-12)] border px-5 py-4 text-sm [&>svg]:row-span-2 [&>svg]:size-5',
  {
    variants: {
      variant: {
        default: 'border-[var(--alert-border-default)] bg-[var(--alert-background-default)] text-[var(--alert-foreground-default)]',
        destructive: 'border-[var(--alert-border-destructive)] bg-[var(--alert-background-default)] text-[var(--alert-foreground-destructive)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant, className }))} {...props} />
  )
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('col-start-2 font-medium leading-5', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('col-start-2 font-normal leading-5', className)} {...props} />
  )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
