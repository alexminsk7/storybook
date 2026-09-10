import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DateRange } from 'react-day-picker';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
      description: 'Figma 502:3321 "Dropdown" — Month and Year / Month Only / Year Only',
    },
    numberOfMonths: { control: { type: 'number', min: 1, max: 2 } },
    showOutsideDays: { control: 'boolean' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma draws every frame on June/July 2025. Pinning the month keeps Chromatic
// snapshots stable instead of drifting with the current date.
const JUNE_2025 = new Date(2025, 5, 1);
const JULY_2025 = new Date(2025, 6, 1);
const SELECTED = new Date(2025, 5, 25);
const RANGE = { from: new Date(2025, 5, 25), to: new Date(2025, 6, 9) };

// 'en-US' rather than the runtime default: the picker trigger's text is part of the
// Chromatic snapshot, so it must not vary with the CI machine's locale.
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date);

type CaptionLayout = React.ComponentProps<typeof Calendar>['captionLayout'];

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SingleCalendar({
  captionLayout = 'dropdown',
  className,
}: {
  captionLayout?: CaptionLayout;
  className?: string;
}) {
  const [date, setDate] = React.useState<Date | undefined>(SELECTED);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={JUNE_2025}
      captionLayout={captionLayout}
      className={className}
    />
  );
}

/** Figma 502:3324 — Date of Birth Picker. Composition, not an exported primitive. */
function DatePickerDemo({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-[var(--foreground)]">Date of birth</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-label={date ? `Date of birth: ${formatDate(date)}` : 'Date of birth, select a date'}
            className={cn('w-[240px] justify-between font-normal', triggerClassName)}
          >
            {date ? (
              formatDate(date)
            ) : (
              <span className="text-[var(--input-foreground-placeholder)]">Select a date</span>
            )}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={JUNE_2025}
            captionLayout="dropdown"
            onSelect={(next) => {
              setDate(next);
              setOpen(false);
            }}
            // PopoverContent already supplies the surface — drop the standalone chrome.
            className="rounded-none border-0 shadow-none"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Figma 502:3327 — Date and Time Picker. Reuses this repo's Input, unmodified. */
function DateTimePickerDemo() {
  return (
    <div className="flex items-end gap-5">
      <DatePickerDemo triggerClassName="w-[150px]" />
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-[var(--foreground)]">Time</span>
        <Input
          type="time"
          step="1"
          defaultValue="10:30:00"
          aria-label="Time"
          className="w-[120px]"
        />
      </div>
    </div>
  );
}

/** Figma 502:3312 — the base single-month calendar, dropdown month + year caption. */
export const Default: Story = {
  render: () => <SingleCalendar />,
};

/** Figma 502:3314 — two months, label caption, highlighted span between start and end. */
export const Range: Story = {
  render: function RangeCalendar() {
    const [range, setRange] = React.useState<DateRange | undefined>(RANGE);
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        defaultMonth={JUNE_2025}
        numberOfMonths={2}
        captionLayout="label"
      />
    );
  },
};

/** Figma 502:3321 "Month and Year" — both dropdowns. */
export const MonthAndYearSelector: Story = {
  render: () => <SingleCalendar captionLayout="dropdown" />,
};

/** Figma 502:3321 "Month Only". */
export const MonthOnlySelector: Story = {
  render: () => <SingleCalendar captionLayout="dropdown-months" />,
};

/** Figma 502:3321 "Year Only". */
export const YearOnlySelector: Story = {
  render: () => <SingleCalendar captionLayout="dropdown-years" />,
};

/** Figma 1463:5909 — same component, larger cells via the --cell-size override. */
export const CustomCellSize: Story = {
  render: () => (
    <Calendar mode="single" defaultMonth={JULY_2025} captionLayout="label" className="[--cell-size:3rem]" />
  ),
};

/** Weekends disabled — the `disabled` matcher, per SPEC's day-cell state table. */
export const DisabledDates: Story = {
  render: () => (
    <Calendar
      mode="single"
      defaultMonth={JUNE_2025}
      captionLayout="label"
      disabled={{ dayOfWeek: [0, 6] }}
    />
  ),
};

/** Outside days hidden — `showOutsideDays={false}`. */
export const WithoutOutsideDays: Story = {
  render: () => (
    <Calendar mode="single" defaultMonth={JUNE_2025} captionLayout="label" showOutsideDays={false} />
  ),
};

export const DatePicker: Story = {
  name: 'Date picker (Popover)',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex min-h-[26rem] items-start justify-center pt-4">
      <DatePickerDemo />
    </div>
  ),
};

export const DateAndTimePicker: Story = {
  name: 'Date and time picker',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex min-h-[26rem] items-start justify-center pt-4">
      <DateTimePickerDemo />
    </div>
  ),
};

/** The component is theme-agnostic: every colour comes from a semantic token. */
export const Dark: Story = {
  globals: { theme: 'dark', brand: 'tornado' },
  render: () => <SingleCalendar />,
};

export const BrandAppLicant: Story = {
  name: 'Brand — AppLicant (blue)',
  globals: { theme: 'light', brand: 'applicant' },
  render: () => <SingleCalendar />,
};

export const DarkBrandAppLicant: Story = {
  name: 'Dark — AppLicant (blue)',
  globals: { theme: 'dark', brand: 'applicant' },
  render: () => <SingleCalendar />,
};
