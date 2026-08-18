import type { CSSProperties } from 'react'

/**
 * Styles partagés par les formulaires d'authentification.
 *
 * Séparés d'AuthLayout.tsx : un module qui exporte des composants ne doit
 * exporter que des composants, sinon Fast Refresh remonte tout l'arbre à
 * chaque édition (react-refresh/only-export-components).
 */
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
