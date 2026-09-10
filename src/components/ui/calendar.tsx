import * as React from 'react';
import { DayPicker, getDefaultClassNames, type DayButtonProps } from 'react-day-picker';

import { cn } from '../../lib/utils';
import { Button, buttonVariants } from './button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      // Figma 502:3312 draws the standalone container with border + radius + shadow; the picker
      // stories strip it (`border-0 shadow-none rounded-none`) since PopoverContent supplies it.
      // p-4 = --space-4 = 12px (Figma container padding); --cell-size drives every day/nav
      // square and is overridable per story via a className.
      className={cn('group/calendar rounded-[var(--radius-12)] border border-[var(--popover-border)] bg-[var(--popover-background)] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] [--cell-size:2rem]', className)}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        // gap-5 = --space-5 = 16px (Figma month gap); Tailwind gap-4 here would be 12px.
        months: cn('relative flex flex-col gap-5 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-5', defaultClassNames.month),
        nav: cn('absolute inset-x-0 top-0 flex items-center justify-between', defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[var(--cell-size)] p-0 aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[var(--cell-size)] p-0 aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-[var(--cell-size)] w-full items-center justify-center px-[var(--cell-size)]',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-[var(--cell-size)] items-center justify-center gap-[6px] text-sm font-medium',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative h-[var(--height-32)] rounded-8 border border-[var(--border)] bg-[var(--background)] shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-ring',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn('absolute inset-0 opacity-0', defaultClassNames.dropdown),
        // A `label` caption is plain centred text; a dropdown caption is the pill's visible
        // face and has to lay the value and its chevron out on one row.
        caption_label: cn(
          'select-none font-medium text-[var(--foreground)]',
          captionLayout === 'label'
            ? 'text-sm'
            : 'flex h-[var(--height-32)] items-center gap-2 rounded-8 pl-3 pr-2 text-sm [&>svg]:size-3 [&>svg]:text-[var(--muted-foreground)]',
          defaultClassNames.caption_label
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn('flex-1 text-xs font-normal text-[var(--muted-foreground)]', defaultClassNames.weekday),
        // mt-3 = --space-3 = 8px between week rows (Tailwind mt-2 here would be 4px).
        week: cn('mt-3 flex w-full', defaultClassNames.week),
        day: cn(
          'group/day relative aspect-square w-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-8 [&:last-child[data-selected=true]_button]:rounded-r-8',
          defaultClassNames.day
        ),
        range_start: cn('rounded-l-8 bg-[var(--accent)]', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-r-8 bg-[var(--accent)]', defaultClassNames.range_end),
        // Figma 502:3314 paints the range band across adjacent-month days too, so the
        // outside fade has to yield once a day is part of the selection.
        outside: cn(
          'text-[var(--muted-foreground)] opacity-50 data-[selected=true]:opacity-100',
          defaultClassNames.outside
        ),
        disabled: cn('text-[var(--muted-foreground)] opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        // Inline SVG chevrons (no icon lib), same feather-style paths as accordion.tsx.
        // size-4 = 12px here; the nav-button chevrons inherit button.tsx's [&_svg]:size-4 clamp.
        Chevron: ({ orientation, className: chevronClassName }) => {
          const path =
            orientation === 'left'
              ? 'm15 18-6-6 6-6'
              : orientation === 'right'
                ? 'm9 18 6-6-6-6'
                : 'm6 9 6 6 6-6';
          return (
            <svg
              className={cn('size-4', chevronClassName)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={path} />
            </svg>
          );
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

// `day` is pulled out of `props` only so react-day-picker's CalendarDay object is not
// spread onto the DOM <button>; the button itself renders from `modifiers` + children.
function CalendarDayButton({ className, day: _day, modifiers, ...props }: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'aspect-square size-[var(--cell-size)] w-full text-sm font-normal',
        'data-[selected-single=true]:bg-[var(--primary)] data-[selected-single=true]:text-[var(--primary-foreground)]',
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[var(--accent)] data-[range-middle=true]:text-[var(--accent-foreground)]',
        'data-[range-start=true]:rounded-l-8 data-[range-start=true]:bg-[var(--primary)] data-[range-start=true]:text-[var(--primary-foreground)]',
        'data-[range-end=true]:rounded-r-8 data-[range-end=true]:bg-[var(--primary)] data-[range-end=true]:text-[var(--primary-foreground)]',
        modifiers.today && 'bg-[var(--accent)] text-[var(--accent-foreground)]',
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
