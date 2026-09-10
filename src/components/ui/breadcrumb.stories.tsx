import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

// Figma's component set has one `Type` variant property with 5 values (link_component,
// custom_seperator, dropdown, collapsed, responsive) — per SPEC.md these are 5 USAGE PATTERNS
// (composition examples) of one flexible compound-parts API, not a style-variant axis. No
// `type` prop exists on Breadcrumb, so each Figma instance becomes its own story below instead
// of an argType-driven switch. No argTypes/controls either: every part just forwards plain HTML
// attributes, same as Accordion/Card's compound stories.

function SlashIcon() {
  return (
    <svg
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 3 8 21" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="size-5"
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

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Link component — plain trail, default chevron-right separators. `Home` uses
// `BreadcrumbLink asChild` to show router-`Link` compatibility (the anchor below stands in for
// a router component); the rest use plain `<a>`, which is equally valid per SPEC.
function LinkComponentDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#">Home</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export const LinkComponent: Story = {
  parameters: { docs: { description: { story: 'Figma `Type=link_component`: plain trail; the first link uses `asChild` to show router-`Link` compatibility.' } } },
  name: 'Link component',
  render: () => <LinkComponentDemo />,
};

export const LinkComponentHover: Story = {
  name: 'Link component (hover)',
  // hover is a code-only addition on BreadcrumbLink (Figma shows no hover state — see SPEC.md).
  // userEvent.hover() doesn't move the real cursor, so :hover never engages; the pseudo-states
  // addon forces it directly, same approach as button.stories.tsx/input.stories.tsx.
  parameters: { pseudo: { hover: true }, docs: { description: { story: 'Hover is a code-only addition on `BreadcrumbLink` — Figma shows no hover state.' } } },
  render: () => <LinkComponentDemo />,
};

// 2. Custom separator — same trail, default chevron-right swapped for a slash icon by passing
// a child into BreadcrumbSeparator.
export const CustomSeparator: Story = {
  parameters: { docs: { description: { story: 'Figma `Type=custom_seperator`: pass any child to `BreadcrumbSeparator` to replace the chevron.' } } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// 3. Dropdown — visual affordance only (chevron-down icon next to a breadcrumb item), composed
// from existing parts. No open/closed state or menu items — SPEC explicitly keeps that out of
// scope until a real DropdownMenu component exists.
export const Dropdown: Story = {
  parameters: { docs: { description: { story: 'Figma `Type=dropdown`: the visual affordance only — no menu is wired until `DropdownMenu` is reconciled.' } } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="inline-flex items-center gap-2">
            Components
            <ChevronDownIcon />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// 4. Collapsed — a bare BreadcrumbEllipsis stands in for truncated middle items.
export const Collapsed: Story = {
  parameters: { docs: { description: { story: 'Figma `Type=collapsed`: `BreadcrumbEllipsis` stands in for truncated middle items.' } } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// 5. Responsive — same collapsed shape as above, with Figma's longer example labels to
// demonstrate wrapping/longer content, not a sixth structural shape.
export const Responsive: Story = {
  parameters: { docs: { description: { story: 'Figma `Type=responsive`: the collapsed shape with longer labels to show wrapping.' } } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Data Fetching</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Caching and Revalidating</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
