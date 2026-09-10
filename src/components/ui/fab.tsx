import * as React from 'react';

import { Button, type ButtonProps } from './button';
import { cn } from '../../lib/utils';

// FAB Button (Figma 3102:18442) is Button's `default` variant made circular: 56px round,
// heavier shadow, a single 24px glyph. Every state is opacity-only in Figma (Default 100 /
// Pressed 80 / Disabled 60) — the same mechanism Button already implements — so this wraps
// Button rather than redeclaring the focus ring, active/disabled opacity and transitions.
// `size` and `variant` are fixed; `size-7` here = 24px in this project's remapped scale
// (Button's base `[&_svg]:size-4` = 12px).
export type FabProps = Omit<ButtonProps, 'variant' | 'size'>;

const Fab = React.forwardRef<HTMLButtonElement, FabProps>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="default"
    size="icon"
    className={cn('size-[var(--height-56)] rounded-full shadow-md [&_svg]:size-7', className)}
    {...props}
  />
));
Fab.displayName = 'Fab';

export { Fab };
