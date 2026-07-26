# Architecture Map

---

## Directory Structure

```
src/
├── api/
│   ├── apiSlice.ts          # LE slice RTK Query. Tout endpoint s'injecte ici.
│   ├── strapi.ts            # BASE_URL, shapes StrapiProduct, mapProduct, auth
│   ├── partnersApi.ts       # injectEndpoints partenaires
│   └── strapiPartners.ts    # shapes + mappers partenaires
├── features/<domain>/       # clean architecture par domaine
│   ├── <domain>Domain.ts    # fonctions pures, zéro React, zéro effet
│   ├── <domain>Slice.ts     # reducers / actions
│   ├── <domain>Selectors.ts # sélecteurs mémoïsés
│   └── *.tsx                # containers : hooks + navigate, rendent un organism
├── components/
│   ├── atoms/               # Button, Input, Text, CommitmentMark
│   ├── molecules/           # ProductCard, CartItem, PartnerCard, StoryBlocks
│   └── organisms/           # ProductList, PartnerList, PartnerDetail, Header…
├── store/
│   ├── index.ts             # configureStore, RootState, AppDispatch
│   └── hooks.ts             # useAppDispatch, useAppSelector typés
├── theme/
│   ├── placekabar-tokens.css # LA source de vérité visuelle (CSS custom properties)
│   └── placekabar-theme.ts   # system Chakra v3
├── types/index.ts           # types domaine partagés (Product, CartItem, User…)
├── types/partner.ts         # types domaine partenaires + libellés FR
├── __tests__/               # tests store-level et domain
└── stories/<level>/         # stories Storybook, miroir de components/
```

## Key File Locations

- **Configuration** : `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `tsconfig.app.json`
- **Main entry** : `src/main.tsx` → `ChakraProvider` + `Provider` Redux → `src/App.tsx` (routes)
- **Tests** : `src/__tests__/**` (Vitest, projet `unit`)
- **Design tokens** : `src/theme/placekabar-tokens.css`
- **Backend** : dépôt séparé `placekabar-strapi-backend` (Strapi 5.47, SQLite en dev)
- **URL API** : `VITE_STRAPI_URL` dans `.env`, défaut `http://localhost:1337`

## Routes

| Chemin | Composant |
|---|---|
| `/` | `features/products/ProductList` |
| `/product/:id` | `features/products/ProductDetailPage` |
| `/partners` | `features/partners/PartnersPage` |
| `/partners/:slug` | `features/partners/PartnerDetailPage` |
| `/login`, `/register` | `features/user/*` |
| `/cart` | `components/organisms/CartPage` (protégée) |
| `/checkout/success` | `components/organisms/CheckoutSuccessPage` |

## Content-types Strapi

`product` (slug, price, stock, image, gallery, sizes, colors, category, partners),
`category`, `order`, `partner`, `commitment`.
Composants : `catalog.color`, `partner.location`, `partner.key-figure`.

---

**Last Updated**: 2026-07-26
