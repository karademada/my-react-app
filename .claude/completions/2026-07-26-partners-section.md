# Section Partenaires

**Date** : 2026-07-26
**Branche** : `feat/partners` (frontend + backend)

---

## Ce qui a été fait

Section « partenaires » complète : listing filtrable et fiche détaillée pour les fermiers,
producteurs, collecteurs, coopératives et transformateurs, reliés aux produits du catalogue.

### Backend (`placekabar-strapi-backend`)

- Content-type `partner` : métier, spécialité, récit en `blocks`, portrait, galerie,
  localisation, chiffres clés, année de partenariat, certificats
- Content-type `commitment` : labels (bio, équitable, social, écologique, responsable) en
  collection séparée, avec description et organisme certificateur
- Composants `partner.location`, `partner.key-figure`
- Relation many-to-many `partner ↔ product`, déclarée des deux côtés
- Middleware `default-populate` : `/api/partners` renvoie une fiche complète sans paramètre
- `scripts/seed-partners.js` (5 engagements, 7 partenaires) et
  `scripts/enable-public-partners.js` (permissions du rôle Public)

### Frontend (`vite-frontend`)

- `types/partner.ts`, `api/strapiPartners.ts`, `api/partnersApi.ts`
- `features/partners/partnersDomain.ts` + 16 tests
- `atoms/CommitmentMark`, `molecules/PartnerCard`, `molecules/StoryBlocks`,
  `organisms/PartnerList`, `organisms/PartnerDetail`
- Routes `/partners` et `/partners/:slug`
- Aucune dépendance ajoutée

## Décisions

- **Engagements en collection séparée** plutôt que cinq booléens sur `partner` : permet de
  décrire ce que chaque label garantit et de nommer le certificateur, et le filtre du listing se
  construit depuis la collection.
- **Populate côté serveur** via middleware : évite `qs` et les query strings à rallonge au front.
- **Filtrage côté client** via `partnersDomain.applyFilters`, comme `productsDomain` pour les
  produits. `buildPartnersQuery` accepte déjà les filtres serveur si la liste grossit.
- **Filtres dans l'URL**, pas dans Redux : partageable, compatible retour arrière, indexable au
  moment du SSR.
- **`StoryBlocks` maison** pour le format `blocks` de Strapi 5, ~90 lignes, plutôt qu'une
  dépendance.

## Vérifié

Backend : schémas chargés par Strapi, seed OK, API testée en marche (populate par défaut, tri,
filtres `$eq` et `$in`, relation inverse produit → partenaires, cas du partenaire sans produit).
Frontend : `typecheck`, `build`, `lint` et les 16 tests de domaine passent.

## Reste à faire

- Lien `/partners` dans le `Header` — la section n'est pas encore atteignable
- Stories pour `PartnerList` et `PartnerDetail`
- Bloc « Cultivé par » sur `ProductDetailPage` (hook `useGetPartnersByProductIdQuery` prêt)
- Upload des portraits dans le Media Library
- Pagination au-delà de 100 partenaires

## Bugs préexistants repérés

1. `types/generated` gitignoré côté backend → `pnpm build` et les scripts de seed cassés sur
   tout clone frais. Un `strapi ts:generate-types` en `postinstall` réglerait ça.
2. `src/__tests__/store/store.test.ts > should have initial products` échoue sur `main`.
