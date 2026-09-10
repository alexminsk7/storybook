import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

// Rounding is keyed by `shape` and shared with AvatarFallback, which renders inside Root and
// needs the same corner treatment without duplicating the circle/square logic.
const shapeRounding = {
  circle: 'rounded-full',
  square: 'rounded-8',
} as const;

// `flex` is required, not decorative: Radix's Avatar.Root renders a <span> (display: inline by
// default), which ignores width/height and never clips overflow — without it, size-8/rounding/
// overflow-hidden silently no-op unless the consumer happens to nest Avatar inside a flex parent.
const avatarVariants = cva('flex size-8 shrink-0 overflow-hidden', {
  variants: {
    shape: shapeRounding,
  },
  defaultVariants: {
    shape: 'circle',
  },
});

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

/**
 * User avatar: image with an initials fallback. `shape` `circle` (default) | `square` — a
 * design-system extension over stock shadcn; `AvatarFallback` takes its own `shape`. Always
 * give `AvatarImage` a meaningful `alt`. `AvatarGroup` stacks several with an overlap.
 * One fixed 32px size. Reconciled with Figma frame `73:3473` (figma.com/design/ZqXhTqJIGE6YPgpdHiWNUW); contract in
 * SPEC.md § Avatar.
 */
const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, shape, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ shape }), className)} {...props} />
  )
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('size-full object-cover', className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarVariants> {}

const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  ({ className, shape, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex size-full items-center justify-center border border-avatar-border bg-avatar-background text-sm leading-4 text-avatar-foreground uppercase',
        shapeRounding[shape ?? 'circle'],
        className
      )}
      {...props}
    />
  )
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const AvatarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center [&>*:not(:first-child)]:border [&>*:not(:first-child)]:border-avatar-border [&>*:not(:last-child)]:-mr-3',
        className
      )}
      {...props}
    />
  )
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
