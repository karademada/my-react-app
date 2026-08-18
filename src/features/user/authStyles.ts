import type { CSSProperties } from 'react'

<<<<<<< HEAD
/**
 * Styles partagés par les formulaires d'authentification.
 *
 * Séparés d'AuthLayout.tsx : un module qui exporte des composants ne doit
 * exporter que des composants, sinon Fast Refresh remonte tout l'arbre à
 * chaque édition (react-refresh/only-export-components).
 */
=======
// Shared input styling for auth forms (plain object, no component export —
// keeps react-refresh happy and avoids duplicating the style in both pages).
>>>>>>> 91eae22 (chore: production polish — branding, dead code removal, docs, stable tests)
export const inputStyle: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--ink-900)',
  background: 'var(--bg-surface)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-md)',
  padding: '10px 14px',
  outline: 'none',
  boxSizing: 'border-box',
}
