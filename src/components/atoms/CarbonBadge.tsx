import type { ReactNode } from 'react'
import {
  computeCarbonFootprint,
  formatCarbon,
} from '../../features/products/carbonDomain'
import type { Product } from '../../types'

/**
 * Badge carbone d'un produit — « CO2e transport + fabrication ».
 * Calculé à partir du poids et du lieu de production (voir carbonDomain).
 * S'affiche en bas de carte ou en détail ; si le produit n'a pas de poids,
 * on n'affiche rien (pas d'estimation fantaisiste).
 */

export interface CarbonBadgeProps {
  product: Product
  icon?: ReactNode
  /** Affichage compact : "1,4 kg CO2e" seul. */
  compact?: boolean
}

export const CarbonBadge = ({ product, icon, compact }: CarbonBadgeProps) => {
  const weight = product.weightGrams ?? 0
  if (weight <= 0) return null

  const fp = computeCarbonFootprint({
    weightGrams: weight,
    origin: product.carbonOrigin,
  })

  const label = `${formatCarbon(fp.totalGrams)} CO2e`

  if (compact) {
    return (
      <span
        title={`Empreinte carbone estimée · ${fp.totalKm} km parcourus`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.04em',
          color: 'var(--moss-700)',
        }}
      >
        {icon ?? '🍃'} {label}
      </span>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        background: 'var(--moss-100)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{icon ?? '🍃'}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--moss-700)' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--moss-700)', opacity: 0.85 }}>
          Empreinte estimée · {fp.totalKm} km parcourus
        </span>
      </div>
    </div>
  )
}

export default CarbonBadge
