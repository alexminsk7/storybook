import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from './progress';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Progress value={60} className="w-[300px]" />,
};
