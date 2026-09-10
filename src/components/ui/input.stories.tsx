import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Email',
    type: 'text',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  name: 'Active (focus)',
  // :focus is a pseudo-class — forced via storybook-addon-pseudo-states, same reasoning
  // as Button's Hover/Active (see button.stories.tsx).
  parameters: { pseudo: { focus: true }, docs: { description: { story: 'Figma "Active (focus ring)". Uses `:focus`, not `:focus-visible` — Figma makes no keyboard/pointer distinction.' } } },
};

export const Hover: Story = {
  name: 'Hover',
  // No --input-border-hover token exists in the design system — Input intentionally has
  // no distinct hover look, so this renders identically to Default. That's the real
  // :hover state (forced via the pseudo-states addon), not a bug.
  parameters: { pseudo: { hover: true }, docs: { description: { story: 'Identical to Default on purpose: the design system defines no `--input-border-hover` token.' } } },
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: 'Opacity-only, same convention as Button; native `disabled` attribute.' } } },
  args: { disabled: true, defaultValue: 'Can’t edit this' },
};

export const Error: Story = {
  parameters: { docs: { description: { story: 'Code-only axis: `error` sets `aria-invalid` and swaps the border/ring to the destructive colour.' } } },
  args: { error: true, defaultValue: 'invalid@' },
};
