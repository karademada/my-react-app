# Common Mistakes

**⚠️ CRITICAL - Read at session start**

---

## Top 5 Critical Mistakes

### 1. Créer un second `createApi` au lieu d'injecter dans le slice existant

**Symptom** : deux `reducerPath`, deux middlewares, cache dupliqué, invalidation qui ne
traverse pas les features.
**Check** : `src/api/apiSlice.ts` exporte déjà `api`. C'est le seul point d'entrée RTK Query.
**Fix** : `api.enhanceEndpoints({ addTagTypes: [...] }).injectEndpoints({ endpoints })` dans un
fichier dédié, et rien à modifier dans `store/index.ts`. Voir `src/api/partnersApi.ts`.

### 2. Styler avec les tokens Chakra alors que les composants utilisent des CSS vars

**Symptom** : les couleurs ne sortent pas, ou le composant jure à côté de `ProductCard`.
**Check** : ouvrir `src/components/molecules/ProductCard.tsx` avant d'écrire du style. La
pratique réelle, c'est `style={{ color: 'var(--text-strong)' }}`, pas les props Chakra —
malgré ce que dit la section Conventions de `CLAUDE.md`.
**Fix** : puiser dans `src/theme/placekabar-tokens.css`. `--font-display` (Hanken Grotesk) pour
les titres, `--font-mono` (Spline Sans Mono) pour les libellés de provenance et les prix,
`--accent` (moss) comme seul accent, `--line` pour les filets.

### 3. Importer depuis `react-router` au lieu de `react-router-dom`

**Symptom** : `Failed to resolve import "react-router"`.
**Check** : `package.json` liste `react-router-dom@^7`, pas `react-router`.
**Fix** : `import { useNavigate, useParams, useSearchParams } from 'react-router-dom'`.

### 4. Consommer les réponses Strapi 5 sans passer par un mapper

**Symptom** : `attributes` undefined, prix en string, URLs d'image relatives et cassées.
**Check** : Strapi 5 renvoie les champs à plat avec un `documentId`, pas de `data.attributes`.
Les médias arrivent en URL relative en local.
**Fix** : suivre le pattern `mapProduct` / `mapPartner` — un type `StrapiX` pour la réponse
brute, un type domaine dans `types/`, une fonction de mapping entre les deux. Jamais de shape
Strapi qui remonte jusqu'aux composants.

### 5. Chasser des échecs qui préexistent

**Symptom** : on croit avoir cassé le build.
**Check** :
- Frontend : `src/__tests__/store/store.test.ts > should have initial products` échoue déjà sur
  `main` — le test attend un state produits non vide alors que `productsSlice` démarre à zéro
  depuis le passage à Strapi.
- Backend : `types/generated` est gitignoré, donc sur un clone frais `pnpm build` **et**
  `node scripts/seed-*.js` échouent avec trois TS2353 sur `order.ts`. Les champs existent bien
  dans le schéma.
**Fix** : côté backend, `pnpm strapi ts:generate-types` avant tout build. Côté frontend, le test
est à corriger séparément, il n'est pas de votre fait.

---

## Rappels de conventions

- Anglais dans le code, français à l'écran. Les libellés passent par des tables
  (`PARTNER_KIND_LABELS`), jamais en dur dans un composant.
- La logique métier vit dans `*Domain.ts`. Un composant ne filtre ni ne trie.
- Tout fichier ajouté dans `src/` a un test ou une story.
- React 19 + React Compiler : pas de `useMemo` / `useCallback` manuels.

---

**Last Updated**: 2026-07-26
