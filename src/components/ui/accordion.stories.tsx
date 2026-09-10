import type { Meta, StoryObj } from '@storybook/react-vite';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// Neutral placeholder content — Figma's demo copy ("Product Information" / "Shipping
// Details" / "Return Policy") is example-only per SPEC.md, not a fixed contract.
function AccordionDemo({ defaultValue }: { defaultValue?: string }) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultValue} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Item one</AccordionTrigger>
        <AccordionContent>
          <p>Placeholder content for item one goes here.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item two</AccordionTrigger>
        <AccordionContent>
          <p>Placeholder content for item two goes here.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Item three</AccordionTrigger>
        <AccordionContent>
          <p>Placeholder content for item three goes here.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const Default: Story = {
  render: () => <AccordionDemo />,
};

export const Open: Story = {
  name: 'Open (item one)',
  render: () => <AccordionDemo defaultValue="item-1" />,
};
