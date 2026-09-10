import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

// Items here use visible text labels (A–D), matching the Figma frame. An icon-only item has no
// accessible name of its own — the consumer must then pass `aria-label` on that ToggleGroupItem.

const meta = {
  title: 'UI/Toggle Group',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    disabled: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: {
    type: 'single',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma "Icon Group": single-select, one item filled with the brand, the rest neutral.
export const SingleSelect: Story = {
  args: { type: 'single', defaultValue: 'a' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
      <ToggleGroupItem value="d">D</ToggleGroupItem>
    </ToggleGroup>
  ),
};

// type="multiple" — more than one item can be on at once (aria-pressed instead of aria-checked).
export const MultipleSelect: Story = {
  args: { type: 'multiple', defaultValue: ['a', 'c'] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
      <ToggleGroupItem value="d">D</ToggleGroupItem>
    </ToggleGroup>
  ),
};

// Whole group disabled — faded, pointer-events blocked, keyboard focus skipped.
export const Disabled: Story = {
  args: { type: 'single', defaultValue: 'a', disabled: true },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
      <ToggleGroupItem value="d">D</ToggleGroupItem>
    </ToggleGroup>
  ),
};
