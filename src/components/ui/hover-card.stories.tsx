import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

const meta = {
  title: 'UI/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function HoverCardDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <HoverCard defaultOpen={defaultOpen}>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold">@nextjs</h4>
          <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
          <span className="text-xs text-muted-foreground">Joined December 2021</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export const Default: Story = {
  render: () => <HoverCardDemo />,
};

export const Open: Story = {
  render: () => <HoverCardDemo defaultOpen />,
};
