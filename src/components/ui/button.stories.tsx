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
      options: ['default', 'secondary', 'outline', 'outlinePrimary', 'ghost', 'ghostPrimary', 'link', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon'],
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
  parameters: { pseudo: { hover: true }, docs: { description: { story: 'Web-only state — Figma documents Default / Pressed / Disabled but no hover. Forced with `storybook-addon-pseudo-states`.' } } },
};

export const Active: Story = {
  parameters: { pseudo: { active: true }, docs: { description: { story: 'Figma State=Pressed: opacity 80%, base colours unchanged.' } } },
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: 'Figma State=Disabled: opacity 60% + `pointer-events: none`; renders the native `disabled` attribute.' } } },
  args: { disabled: true },
};

export const Loading: Story = {
  parameters: { docs: { description: { story: 'Code-only: spinner, `aria-busy`, and the button is disabled while loading.' } } },
  args: { loading: true },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const OutlinePrimary: Story = {
  args: { variant: 'outlinePrimary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const GhostPrimary: Story = {
  args: { variant: 'ghostPrimary' },
};

export const Link: Story = {
  args: { variant: 'link' },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
};

export const XL: Story = {
  parameters: { docs: { description: { story: 'Code-only size (56px), one step above `lg`; not in the Figma set.' } } },
  args: { size: 'xl' },
};

// Figma "CTA Button" (node 3115:18877 on the Button page) is not its own component — it is the
// `default` button stretched to its container's width. See SPEC.md "Button" › Figma.
export const CTA: Story = {
  args: { children: 'Get started' },
  render: (args) => (
    <div className="w-80">
      <Button {...args} className="w-full" />
    </div>
  ),
};
