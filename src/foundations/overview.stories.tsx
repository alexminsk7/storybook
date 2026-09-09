import type { Meta, StoryObj } from '@storybook/react-vite'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Calendar } from '../components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

/**
 * The library ships one Figma brand (orange). Each consuming app rebinds the
 * brand-carrying semantic tokens and the component layer follows. Use the
 * toolbar **Theme** (light / dark) and **Brand** (Tornado orange / AppLicant
 * blue) switches on any story; the four stories below pin one combination each.
 */
const meta = {
  title: 'Foundations/Overview',
  // no autodocs: each story pins its own global theme via a decorator that
  // writes document.documentElement, so stacking them on one docs page fights
  tags: ['!autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Plain SVG icon — Alert takes no icon prop, see alert.stories.tsx.
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function Showcase() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outlinePrimary">Outline</Button>
        <Button variant="ghostPrimary">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Delete</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <Input placeholder="you@example.com" />
      <Alert className="w-80">
        <CheckCircleIcon />
        <AlertTitle>Alert title</AlertTitle>
        <AlertDescription>Border and text follow the theme.</AlertDescription>
      </Alert>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/this-avatar-does-not-exist.png" alt="Wendy Wonka" />
          <AvatarFallback>WW</AvatarFallback>
        </Avatar>
        <Avatar shape="square">
          <AvatarImage src="/this-avatar-does-not-exist.png" alt="Wendy Wonka" />
          <AvatarFallback shape="square">WW</AvatarFallback>
        </Avatar>
      </div>
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Surface, border and text follow the theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm">Confirm</Button>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible defaultValue="item-1" className="w-80">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item one</AccordionTrigger>
          <AccordionContent>
            <p>Border and text follow the theme.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item two</AccordionTrigger>
          <AccordionContent>
            <p>Placeholder content for item two.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Calendar
        mode="single"
        selected={new Date(2025, 5, 25)}
        defaultMonth={new Date(2025, 5, 1)}
        captionLayout="dropdown"
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm this action</AlertDialogTitle>
            <AlertDialogDescription>Surface, border and text follow the theme.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const LightTornado: Story = {
  name: 'Light · Tornado',
  globals: { theme: 'light', brand: 'tornado' },
  render: () => <Showcase />,
}

export const LightApplicant: Story = {
  name: 'Light · AppLicant',
  globals: { theme: 'light', brand: 'applicant' },
  render: () => <Showcase />,
}

export const DarkTornado: Story = {
  name: 'Dark · Tornado',
  globals: { theme: 'dark', brand: 'tornado' },
  render: () => <Showcase />,
}

export const DarkApplicant: Story = {
  name: 'Dark · AppLicant',
  globals: { theme: 'dark', brand: 'applicant' },
  render: () => <Showcase />,
}
