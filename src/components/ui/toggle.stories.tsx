import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoldIcon } from 'lucide-react';

import { Toggle } from './toggle';

const meta = {
  title: 'UI/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle bold">
      <BoldIcon />
      Bold
    </Toggle>
  ),
};
