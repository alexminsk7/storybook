import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

function CollapsibleDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="flex w-[350px] flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-4">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            Toggle
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-8 border px-4 py-2 text-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-8 border px-4 py-2 text-sm">@radix-ui/colors</div>
        <div className="rounded-8 border px-4 py-2 text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export const Default: Story = {
  render: () => <CollapsibleDemo />,
};

export const Open: Story = {
  render: () => <CollapsibleDemo defaultOpen />,
};
