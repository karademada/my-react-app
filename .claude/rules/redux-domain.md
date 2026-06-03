---
name: redux-domain
description: Clean Architecture — domain, slice, selectors. Auto-loads on Redux/feature edits.
paths:
  - "src/features/**/*Domain.ts"
  - "src/features/**/*Slice.ts"
  - "src/features/**/*Selectors.ts"
  - "src/store.ts"
  - "src/__tests__/**/*"
---

<important if="editing Redux slices, domain, or selectors">

## Layer responsibilities

- **`*Domain.ts`** — pure functions over plain data. No Redux, no React, no I/O. Easy to unit-test in isolation. Examples: `addItem(cart, product)`, `totalPrice(items)`.
- **`*Slice.ts`** — Redux Toolkit `createSlice` only. Reducers delegate to domain functions for non-trivial logic. No business rules inline.
- **`*Selectors.ts`** — read-only derivations. Use `createSelector` from RTK for memoized chains. Components call selectors, never raw state.

## Rules

- Reducers must remain pure — Immer handles mutation; do **not** dispatch from within reducers.
- Async = `createAsyncThunk` or RTK Query. No `setTimeout`/`fetch` in components.
- Selectors take the full root state (`RootState`) — never call them with partial state.
- New domain functions ship with colocated `*.test.ts` (Vitest) covering edge cases.

## Forbidden

- Importing React inside `*Domain.ts` or `*Slice.ts`.
- Inline `useSelector(state => state.foo.bar.baz)` — use a named selector.
- Direct state mutation outside a slice reducer.
- Cross-feature reducer imports — communicate via actions or selectors composed at component level.

</important>
