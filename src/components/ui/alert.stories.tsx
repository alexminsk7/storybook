import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert, AlertDescription, AlertTitle } from './alert';

// Alert takes no icon prop — the icon is a consumer-supplied plain SVG first child (see
// SPEC.md "Alert"). No icon library is installed in this repo, so stories use generic
// inline SVGs (stroke="currentColor" so they follow the variant's foreground color).
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.29 3.86-8.18 14.14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.89-2.99L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="w-96">
      <CheckCircleIcon />
      <AlertTitle>You can add components to your app</AlertTitle>
      <AlertDescription>This is an alert with icon, title and description.</AlertDescription>
    </Alert>
  ),
};

// "Title only" per SPEC.md is not a separate variant — it's the `default` variant with
// AlertDescription simply omitted.
export const TitleOnly: Story = {
  name: 'Title only',
  render: (args) => (
    <Alert {...args} className="w-96">
      <CheckCircleIcon />
      <AlertTitle>This alert has a title and no description</AlertTitle>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args} className="w-96">
      <AlertTriangleIcon />
      <AlertTitle>Unable to process your payment</AlertTitle>
      <AlertDescription>
        <p>Please verify your billing information and try again.</p>
        <ul className="list-inside list-disc">
          <li>Check your card details</li>
          <li>Ensure sufficient funds are available</li>
          <li>Verify your billing address</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
};
