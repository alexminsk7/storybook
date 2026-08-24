import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    asChild: { control: false },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  // userEvent.hover() only dispatches DOM mouse events — it does not move the browser's
  // real cursor, so the CSS :hover pseudo-class this button's styling depends on never
  // actually engages. storybook-addon-pseudo-states forces the pseudo-class directly by
  // rewriting stylesheets, which works reliably in both story and docs view, and is what
  // Chromatic's own docs recommend for snapshotting pseudo-states.
  parameters: { pseudo: { hover: true } },
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Link: Story = {
  args: { variant: 'link' },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
};
