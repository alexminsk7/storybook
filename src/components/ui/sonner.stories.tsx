import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { Button } from './button';
import { Toaster } from './sonner';

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: { label: 'Undo', onClick: () => {} },
          })
        }
      >
        Show toast
      </Button>
    </>
  ),
};
