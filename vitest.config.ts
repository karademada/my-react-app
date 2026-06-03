import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/features/**/*.ts'],
      exclude: ['src/features/**/*.tsx', 'src/**/*.test.ts'],
    },
  },
})
