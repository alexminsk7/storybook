import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';
import { Switch } from './switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="airplane-mode-on" defaultChecked />
      <Label htmlFor="airplane-mode-on">Airplane Mode</Label>
    </div>
  ),
};
