import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Select defaultOpen={defaultOpen}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Default: Story = {
  render: () => <SelectDemo />,
};

export const Open: Story = {
  render: () => <SelectDemo defaultOpen />,
};
