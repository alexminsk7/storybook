import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fab } from './fab';

// No icon library is installed in this repo (see alert.stories.tsx) — the Figma FAB uses
// lucide/plus, so stories use a generic inline plus SVG. stroke="currentColor" so it follows
// --button-foreground.
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const meta = {
  title: 'UI/FAB Button',
  component: Fab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    asChild: { control: false },
    children: { control: false },
  },
  args: {
    // FAB Button is icon-only — the consumer MUST supply an accessible name.
    'aria-label': 'Create',
    children: <PlusIcon />,
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Figma State=Pressed — opacity-only, inherited from Button's `active:opacity-80`.
export const Pressed: Story = {
  parameters: { pseudo: { active: true }, docs: { description: { story: 'Figma State=Pressed — opacity 80%, inherited from Button.' } } },
};

// Figma State=Disabled — opacity-only + pointer-events-none, inherited from Button.
export const Disabled: Story = {
  parameters: { docs: { description: { story: 'Figma State=Disabled — opacity 60% and `pointer-events: none`, inherited from Button.' } } },
  args: { disabled: true },
};
