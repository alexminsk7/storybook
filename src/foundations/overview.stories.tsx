import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../components/ui/button'
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
      <Input placeholder="you@example.com" />
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Surface, border and text follow the theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm">Confirm</Button>
        </CardContent>
      </Card>
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
