import type { Preview } from '@storybook/react-vite'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export const decorators: Preview['decorators'] = [
  (Story) => (
    <ChakraProvider value={defaultSystem}>
      <Story />
    </ChakraProvider>
  ),
]

export const parameters: Preview['parameters'] = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
