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
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByPlaceholderText('Email'));
  },
};

export const Hover: Story = {
  name: 'Hover',
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByPlaceholderText('Email'));
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Can’t edit this' },
};

export const Error: Story = {
  args: { error: true, defaultValue: 'invalid@' },
};
