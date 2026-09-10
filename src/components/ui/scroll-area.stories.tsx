import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from './scroll-area';
import { Separator } from './separator';

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-[220px] w-[250px] rounded-8 border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Tags</h4>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i}>
            <div className="text-sm">v1.2.0-beta.{30 - i}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
