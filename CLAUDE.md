# my-react-app

Redux Shop demo — Clean Architecture e-commerce app.

## Stack

- React 19.2 + React Compiler (`babel-plugin-react-compiler`)
- Vite (rolldown-vite override) + TypeScript 5.7
- Redux Toolkit 2 + react-redux 9
- Chakra UI v3 + Emotion
- Framer Motion + GSAP
- Vitest 4 + Playwright + Storybook 10
- pnpm

## Commands

- `pnpm dev` — Vite dev server
- `pnpm build` — `tsc -b && vite build`
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint flat config
- `pnpm test` — Vitest watch
- `pnpm test:coverage` — coverage run
- `pnpm storybook` — Storybook on port 6006

## Architecture

- `src/features/<domain>/` — clean architecture per slice:
  - `*Domain.ts` — **pure** business functions, no side effects, no React
  - `*Slice.ts` — Redux Toolkit slice (reducers/actions)
  - `*Selectors.ts` — memoized selectors
  - `*.tsx` — feature-level components
- `src/components/{atoms,molecules,organisms}/` — atomic design, UI-only
- `src/__tests__/` — store-level tests; colocated `*.test.ts(x)` for units

## Workflow

Research → Plan → Execute → Review → Ship. Always start with plan mode for any change touching 2+ files. Phase-gated tests (unit + integration). Commit on task completion.

## Conventions

- Domain logic stays pure — UI never reaches into business rules
- Selectors compute derived state — components do not
- Chakra v3 props over custom CSS where possible
- Type all public exports; avoid `any`
- React 19: no manual `useMemo`/`useCallback` for components handled by React Compiler

## Don't

- Don't put business logic in components or slices — it lives in `*Domain.ts`
- Don't mutate Redux state outside slices
- Don't add files to `src/` without a test (unit or story)
