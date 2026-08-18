# place·kabar — Frontend

Boutique e-commerce « récolte éthique tracée de Madagascar » — React 19 SPA
avec clean architecture (domain / slice / selectors), design atomique et
paiement Stripe Checkout via un backend Strapi.

## Stack

- **React 19.2** + React Compiler (`babel-plugin-react-compiler`)
- **Vite** (rolldown-vite 7.2.2) + TypeScript 5.7
- **Redux Toolkit 2** (slices + RTK Query) + react-redux 9
- **Chakra UI v3** (tokens + skeletons) + design tokens CSS maison
  (`src/theme/placekabar-tokens.css`)
- **GSAP** (animations header / grille produits)
- **Vitest 4** (unit + Storybook en browser Playwright) + Storybook 10
- Déploiement : **Vercel** (SPA + fonctions serverless `api/` pour le bot Slack ops)

## Commandes

```bash
pnpm install
pnpm dev              # dev server (port 5173)
pnpm build            # tsc -b && vite build
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint flat config
pnpm test             # Vitest watch
pnpm test:coverage    # unit + stories, coverage v8
pnpm storybook        # Storybook (port 6006)
```

Premier lancement des tests browser : `pnpm playwright:install` (installe
Chromium dans `.playwright-browsers/`, dossier ignoré par git).

## Architecture

```
src/
├── features/<domain>/   # clean architecture par domaine
│   ├── *Domain.ts       #   fonctions pures (business logic, zéro React/IO)
│   ├── *Slice.ts        #   reducers Redux Toolkit (délèguent au domain)
│   ├── *Selectors.ts    #   sélecteurs mémoïsés
│   └── *Page.tsx        #   pages / connecteurs UI ↔ store
├── components/
│   ├── atoms/           # primitives (Button)
│   ├── molecules/       # compositions simples (ProductCard, CartItem)
│   └── organisms/       # sections de page (Header, ShoppingCart, CartPage)
├── api/                 # RTK Query (apiSlice) + mappers Strapi (strapi.ts)
├── store/               # configuration du store + hooks typés
├── theme/               # tokens Chakra + CSS design system placekabar
├── stories/             # stories Storybook par composant
└── __tests__/           # tests store/features
```

Règles de base (détaillées dans `CLAUDE.md` et `.claude/rules/`) :

- La business logic vit dans `*Domain.ts` (fonctions pures) — jamais dans les
  composants ou les slices.
- Les selectors calculent l'état dérivé ; les composants ne calculent rien.
- Chaque item du panier est identifié par un `cartKey` (id + taille + couleur)
  — suppression / mise à jour de quantité **par variante**, jamais par id seul.
- Pas de `useMemo`/`useCallback` manuel (React Compiler s'en charge).

## Flux principal

1. `GET /api/products?populate=*` (RTK Query) → catalogue filtré par
   catégorie / prix / recherche (selectors memoïsés).
2. Ajout au panier avec variantes taille/couleur → `cartKey` unique par variante.
3. Checkout : `POST /api/orders/checkout-session` (JWT requis) → redirection
   Stripe Checkout → webhook `POST /api/orders/stripe-webhook` (signature
   vérifiée) → statut `paid` + décrément du stock.
4. Auth : `auth/local` + `auth/local/register` Strapi ; JWT en localStorage
   (`pk_auth_jwt`), session restaurée au boot via `/api/users/me`.

## Variables d'environnement

| Variable            | Rôle                                      |
|---------------------|-------------------------------------------|
| `VITE_STRAPI_URL`   | URL du backend Strapi (défaut `http://localhost:1337`) |

Voir `.env.example`. Le backend exige en plus `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `CLIENT_URL` (voir `../strapi-backend/.env.example`).

## Performances

Audit complet dans `.perf-audit/report.md` (racine du repo). Mesures clés
après correctifs (prod build) : LCP cold ≈ 516 ms, CLS warm = 0.
Le bundle est éclaté par vendors (react / redux / chakra / anim) et les
routes sont chargées paresseusement avec skeletons.

## Tests

- **Unit (Vitest)** : domain, slices, selectors — `src/__tests__/` +
  tests colocalisés.
- **Stories** : chaque composant a sa story ; elles servent aussi de tests
  browser via `@storybook/addon-vitest`.
- Couverture : `pnpm test:coverage` (cible : `src/features/**/*.ts`).
