import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';

const meta = {
  title: 'UI/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
// Bare `StoryObj` on purpose: input-otp's props are a `render | children` union with a required
// `maxLength`, which makes `StoryObj<typeof meta>` demand `args` that can't be expressed for a
// compound `render`. `component` stays on the meta so autodocs still gets the props table.
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};
