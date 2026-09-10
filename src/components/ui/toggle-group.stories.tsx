import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

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
// Typed on the component's own props, not `typeof meta`: Radix ToggleGroup's props are a
// `single | multiple` union with a required `type`, and Storybook's meta-derived `args`
// (which subtracts meta.args from the props) collapses that union to `never`.
type ToggleGroupProps = ComponentProps<typeof ToggleGroup>;
type Story = StoryObj<ToggleGroupProps>;

// Figma "Icon Group": single-select, one item filled with the brand, the rest neutral.
export const SingleSelect: Story = {
  parameters: { docs: { description: { story: 'The Figma "Icon Group" case: exactly one item on, `aria-checked` semantics.' } } },
  args: { type: 'single', defaultValue: 'a' },
  render: (args: ToggleGroupProps) => (
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
  parameters: { docs: { description: { story: '`type="multiple"`: any number of items on, `aria-pressed` semantics.' } } },
  args: { type: 'multiple', defaultValue: ['a', 'c'] },
  render: (args: ToggleGroupProps) => (
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
  parameters: { docs: { description: { story: 'Whole group disabled — faded, pointer events blocked, skipped by keyboard focus.' } } },
  args: { type: 'single', defaultValue: 'a', disabled: true },
  render: (args: ToggleGroupProps) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
      <ToggleGroupItem value="d">D</ToggleGroupItem>
    </ToggleGroup>
  ),
};
