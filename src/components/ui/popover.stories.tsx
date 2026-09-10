import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    // 'padded' + a tall wrapper: the content is portalled, so a centred layout
    // would clip it out of the Chromatic snapshot.
    layout: 'padded',
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[20rem] items-start justify-center pt-4">{children}</div>;
}

export const Default: Story = {
  render: () => (
    <Frame>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Placeholder content goes here.</p>
        </PopoverContent>
      </Popover>
    </Frame>
  ),
};

export const Open: Story = {
  parameters: { docs: { description: { story: 'Rendered open so the portalled content is visible in the docs and in Chromatic.' } } },
  render: () => (
    <Frame>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Dimensions</span>
            <Input defaultValue="100%" aria-label="Width" />
          </div>
        </PopoverContent>
      </Popover>
    </Frame>
  ),
};

/** `align="start"` — the alignment the date pickers use. */
export const AlignStart: Story = {
  parameters: { docs: { description: { story: '`align="start"` on `PopoverContent` — the panel\'s left edge lines up with the trigger.' } } },
  render: () => (
    <Frame>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-between">
            Aligned to start
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <p className="text-sm">Content edge lines up with the trigger's start edge.</p>
        </PopoverContent>
      </Popover>
    </Frame>
  ),
};

export const Dark: Story = {
  parameters: { docs: { description: { story: 'Pinned to the dark theme via globals.' } } },
  globals: { theme: 'dark', brand: 'tornado' },
  render: () => (
    <Frame>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Placeholder content goes here.</p>
        </PopoverContent>
      </Popover>
    </Frame>
  ),
};
