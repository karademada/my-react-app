import { defineConfig, type Plugin } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

/**
 * `@vitejs/plugin-react` se type contre `vite`, que ce projet remplace par
 * rolldown-vite (override dans package.json), alors que `vitest/config`
 * réexporte les types du vrai `vite`. Les deux `Plugin` sont structurellement
 * incompatibles — même contournement que `as PluginOption` dans vite.config.ts.
 *
 * Une fabrique et non une instance partagée : chaque projet Vitest doit avoir
 * la sienne.
 */
const reactPlugin = () => react() as unknown as Plugin

export default defineConfig({
  // Vitest ne charge pas vite.config.ts : le plugin React doit être redéclaré ici,
  // sinon le JSX des *.stories.tsx n'est pas transformé ("React is not defined").
  // Sans babel-plugin-react-compiler : inutile en test, et coûteux.
  plugins: [reactPlugin()],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/features/**/*.ts'],
      exclude: ['src/features/**/*.tsx', 'src/**/*.test.ts'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        // Un `plugins` de projet remplace celui de la racine (pas de merge) :
        // react() doit être répété ici.
        plugins: [
          reactPlugin(),
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
