import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'

import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-sans/700.css'
import '../src/styles/globals.css'

const preview: Preview = {
  initialGlobals: {
    theme: 'light',
    brand: 'tornado',
  },
  globalTypes: {
    theme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Brand overlay',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'tornado', title: 'Tornado · orange' },
          { value: 'applicant', title: 'AppLicant · blue' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals }) => {
      useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-theme', globals.theme)
        root.setAttribute('data-brand', globals.brand)
      }, [globals.theme, globals.brand])
      return <Story />
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
