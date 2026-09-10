import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function SheetDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when done.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-name">Name</Label>
            <Input id="sheet-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-username">Username</Label>
            <Input id="sheet-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Default: Story = {
  render: () => <SheetDemo />,
};

export const Open: Story = {
  render: () => <SheetDemo defaultOpen />,
};
