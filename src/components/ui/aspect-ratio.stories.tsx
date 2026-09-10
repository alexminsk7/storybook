import type { Meta, StoryObj } from '@storybook/react-vite';

import { AspectRatio } from './aspect-ratio';

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[320px]">
      <AspectRatio
        ratio={16 / 9}
        className="flex items-center justify-center rounded-8 bg-muted text-sm text-muted-foreground"
      >
        16 : 9
      </AspectRatio>
    </div>
  ),
};
