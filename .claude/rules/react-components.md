---
name: react-components
description: React 19 + Chakra UI v3 component rules. Auto-loads when editing components.
paths:
  - "src/components/**/*.tsx"
  - "src/features/**/*.tsx"
  - "src/App.tsx"
  - "src/main.tsx"
---

<important if="editing a component under src/components or src/features">

## React 19

- React Compiler is enabled (`babel-plugin-react-compiler`). Do **not** add `useMemo` / `useCallback` / `React.memo` unless profiler proves a regression — compiler handles it.
- Use Server-Components-safe patterns where applicable; this app is SPA but stay forward-compatible.
- `ref` is a regular prop in React 19 — no `forwardRef` for new components.

## Chakra UI v3

- Prefer Chakra props (`<Box p={4}>`) over `style` / `className`.
- v3 uses `Theme` provider + `system` config. Do **not** import deprecated v2 APIs.
- Animation primitives: `framer-motion` for transitions, `gsap` for timeline-heavy work.

## Atomic Design

- `atoms/` — single-purpose primitives (`Button`, `Text`, `Input`). No business state.
- `molecules/` — small compositions (`CartItem`, `ProductCard`). Receive props, dispatch actions, do **not** call selectors directly.
- `organisms/` — page sections (`Header`, `ShoppingCart`). May connect to Redux via selectors.
- Feature components (`src/features/<x>/X.tsx`) wire organisms to routes.

## Forbidden

- No business logic in components — call `*Domain.ts` functions or dispatch slice actions.
- No `any` on props — define explicit interfaces.
- No inline event handlers spawning expensive computations — extract or memoize at slice level.

</important>
