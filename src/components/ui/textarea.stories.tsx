import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Textarea placeholder="Type your message here." className="w-[300px]" />,
};

export const Disabled: Story = {
  render: () => <Textarea placeholder="Type your message here." className="w-[300px]" disabled />,
};
