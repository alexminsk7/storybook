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
  parameters: { pseudo: { focus: true } },
};

export const Hover: Story = {
  name: 'Hover',
  // No --input-border-hover token exists in the design system — Input intentionally has
  // no distinct hover look, so this renders identically to Default. That's the real
  // :hover state (forced via the pseudo-states addon), not a bug.
  parameters: { pseudo: { hover: true } },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Can’t edit this' },
};

export const Error: Story = {
  args: { error: true, defaultValue: 'invalid@' },
};
