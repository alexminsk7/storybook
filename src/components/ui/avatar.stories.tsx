import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from './avatar';

// Inline SVG data URIs — no story in this repo relies on an external image URL (checked:
// card/input/button/accordion stories all use plain markup or none at all), and a network
// dependency would make story screenshots flaky. Each swatch is just a solid rect so the
// image clearly fills the 32x32 avatar regardless of shape.
const avatarSvg = (bg: string, initials: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${bg}"/><text x="32" y="40" font-size="24" text-anchor="middle" fill="white" font-family="sans-serif">${initials}</text></svg>`
  )}`;

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
  },
  args: {
    shape: 'circle',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Circle: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={avatarSvg('#0ea5e9', 'JD')} alt="Jane Doe" />
      <AvatarFallback shape={args.shape}>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  // Deliberately-broken src so Radix's real image-error fallback fires — AvatarFallback is
  // not rendered standalone, it's Avatar's actual fallback path for a failed image load.
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/this-avatar-does-not-exist.png" alt="Wendy Wonka" />
      <AvatarFallback shape={args.shape}>WW</AvatarFallback>
    </Avatar>
  ),
};

export const Square: Story = {
  // AvatarFallback takes its own `shape` prop — it does not read Avatar Root's shape via
  // context, so both need `shape="square"` to stay in sync. Shown here with an avatar that
  // loads (AvatarImage) next to one that fails (AvatarFallback) so both corner treatments
  // are visible side by side.
  args: { shape: 'square' },
  render: (args) => (
    <div className="flex gap-4">
      <Avatar {...args}>
        <AvatarImage src={avatarSvg('#0ea5e9', 'JD')} alt="Jane Doe" />
        <AvatarFallback shape={args.shape}>JD</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage src="/this-avatar-does-not-exist.png" alt="Wendy Wonka" />
        <AvatarFallback shape={args.shape}>WW</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  name: 'Avatar Group',
  render: (args) => (
    <AvatarGroup>
      <Avatar {...args}>
        <AvatarImage src={avatarSvg('#0ea5e9', 'JD')} alt="Jane Doe" />
        <AvatarFallback shape={args.shape}>JD</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage src={avatarSvg('#f97316', 'AM')} alt="Alex Miller" />
        <AvatarFallback shape={args.shape}>AM</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage src={avatarSvg('#22c55e', 'WW')} alt="Wendy Wonka" />
        <AvatarFallback shape={args.shape}>WW</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
