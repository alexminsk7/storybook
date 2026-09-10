import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';

// secondaryIcon's icon is a plain consumer-supplied child (no icon prop, no icon library in
// this repo) — same free-form-icon pattern as Alert's stories. 16x16 per SPEC.md ("leading
// 16×16 lucide/circle-check icon").
function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'success',
        'secondary',
        'destructive',
        'outline',
        'secondaryIcon',
        'defaultNumber',
        'destructiveFill',
        'secondaryNumber',
        'info',
      ],
    },
    children: { control: 'text' },
  },
  args: {
    variant: 'default',
    children: 'Label',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: { variant: 'success' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

// Figma name drift: styled identically to `default` (brand fill), not `secondary` — see
// SPEC.md "Badge". Only variant that takes an icon; "Verified" is Figma's own example label.
export const SecondaryIcon: Story = {
  parameters: { docs: { description: { story: 'Figma name drift: styled like `default` (brand fill), not `secondary`. The only variant that takes a leading icon.' } } },
  name: 'Secondary icon',
  args: { variant: 'secondaryIcon' },
  render: (args) => (
    <Badge {...args}>
      <CheckCircleIcon />
      Verified
    </Badge>
  ),
};

export const DefaultNumber: Story = {
  name: 'Default number',
  args: { variant: 'defaultNumber', children: '99+' },
};

// Solid red fill (vs. `destructive`'s soft tint) — reuses foreground-default for contrast.
export const DestructiveFill: Story = {
  parameters: { docs: { description: { story: 'Solid red fill, unlike `destructive`\'s soft tint.' } } },
  name: 'Destructive fill',
  args: { variant: 'destructiveFill' },
};

// Border only, monospace label font, smaller padding (px-2 py-1) — see SPEC.md "Badge".
export const SecondaryNumber: Story = {
  parameters: { docs: { description: { story: 'Border only, monospace label, tighter padding — meant for counts.' } } },
  name: 'Secondary number',
  args: { variant: 'secondaryNumber', children: '42' },
};

export const Info: Story = {
  args: { variant: 'info' },
};

// Overview of all 10 Figma variants side by side so the colour/height differences are easy
// to scan in one screenshot.
export const AllVariants: Story = {
  parameters: { docs: { description: { story: 'All ten Figma `Type` values side by side.' } } },
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="default">Label</Badge>
      <Badge variant="success">Label</Badge>
      <Badge variant="secondary">Label</Badge>
      <Badge variant="destructive">Label</Badge>
      <Badge variant="outline">Label</Badge>
      <Badge variant="secondaryIcon">
        <CheckCircleIcon />
        Verified
      </Badge>
      <Badge variant="defaultNumber">99+</Badge>
      <Badge variant="destructiveFill">Label</Badge>
      <Badge variant="secondaryNumber">42</Badge>
      <Badge variant="info">Label</Badge>
    </div>
  ),
};
