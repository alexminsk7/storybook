import * as React from 'react';

import { cn } from '../../lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-[var(--radius-14)] border border-card-border bg-card-background text-card-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  // p-7, not p-6: this project's spacing scale is not Tailwind's, and --space-7 is the 24px
  // step Figma uses for card padding (--space-6 would be 20px).
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex flex-col gap-1.5 p-7', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    // Figma's card header (73:4339) is 14px/400 at --card-foreground — not shadcn's web default
    // of 18px semibold, which is what this used to render.
    <h3 ref={ref} className={cn('text-sm font-normal leading-5', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-5 text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-7 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center p-7 pt-0', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
