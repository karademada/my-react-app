// Import requis pour `vitest --project=storybook` uniquement : ce pipeline
// (cache sb-vitest/) transforme ce fichier en JSX classique -> React.createElement,
// d'ou "React is not defined" et l'echec des 29 tests. Storybook dev (cache sb-vite/)
// rend correctement avec ou sans cet import.
// Ne pas retirer tant que rolldown-vite/Storybook n'aligne pas le runtime automatique.
import React from 'react'
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
