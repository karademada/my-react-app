---
name: testing
description: Vitest + React Testing Library + Playwright conventions. Auto-loads on test edits.
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/__tests__/**/*"
  - "**/*.stories.ts"
  - "**/*.stories.tsx"
  - "vitest.config.ts"
  - "playwright.config.ts"
---

<important if="writing or editing tests, stories, or test config">

## Stack

- **Vitest 4** — unit + integration runner. Browser mode via `@vitest/browser-playwright`.
- **React Testing Library** — query by role/label, not by class or test-id when avoidable.
- **Storybook 10 + addon-vitest** — stories double as visual regression + interaction tests.
- **Playwright** — full E2E (not yet wired; add under `e2e/` when needed).

## Patterns

- Domain functions → pure unit tests (`*Domain.test.ts`). One assertion per behavior.
- Slices → reducer + selector tests asserting state transitions.
- Components → behavior tests via RTL (`getByRole`, `findByText`). Avoid testing implementation details (state shape, internal handlers).
- Stories → write `*.stories.tsx` for every component in `atoms`/`molecules`. Use `play` functions for interaction assertions.

## TDD workflow

1. Write the failing test first (red).
2. Implement minimum to pass (green).
3. Refactor with tests green.
4. Run `pnpm test:coverage` before commit — keep coverage non-decreasing on touched files.

## Forbidden

- No snapshot-only assertions for logic — assert on behavior.
- No `screen.debug()` left in committed tests.
- No `as any` to silence type errors — fix the type or the test.
- No mocking the Redux store at component level — wrap with a real `<Provider>` and a configured test store.

</important>
