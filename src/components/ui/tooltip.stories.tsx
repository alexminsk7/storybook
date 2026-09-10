import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function TooltipDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const Default: Story = {
  render: () => <TooltipDemo />,
};

export const Open: Story = {
  render: () => <TooltipDemo defaultOpen />,
};
