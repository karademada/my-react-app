import { useState } from 'react'
import type { Partner } from '../../types/partner'
import { PARTNER_KIND_LABELS } from '../../types/partner'
import { CommitmentMarkList } from '../atoms/CommitmentMark'

export interface PartnerCardProps {
  partner: Partner
  onPartnerClick?: (slug: string) => void
}

const formatPlace = (partner: Partner) =>
  [partner.location?.town, partner.location?.region].filter(Boolean).join(', ')

export const PartnerCard = ({ partner, onPartnerClick }: PartnerCardProps) => {
  const [hover, setHover] = useState(false)
  const place = formatPlace(partner)
  const clickable = Boolean(onPartnerClick)

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onPartnerClick?.(partner.slug)}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onPartnerClick?.(partner.slug)
        }
      }}
      role={clickable ? 'link' : undefined}
      tabIndex={clickable ? 0 : undefined}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'transform 240ms, box-shadow 240ms',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          background: 'var(--paper-200)',
        }}
      >
        {partner.portrait ? (
          <img
            src={partner.portrait}
            alt={`Portrait de ${partner.name}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 480ms',
              transform: hover ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: 'var(--ls-label)',
              textTransform: 'uppercase',
              color: 'var(--ink-300)',
            }}
          >
            placekabar
          </div>
        )}
      </div>

      <div
        style={{
          padding: '16px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-label-sm)',
            fontWeight: 500,
            letterSpacing: 'var(--ls-label)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {PARTNER_KIND_LABELS[partner.kind]}
          {place ? ` · ${place}` : ''}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            color: 'var(--text-strong)',
            margin: 0,
          }}
        >
          {partner.name}
        </h3>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--text-muted)',
          }}
        >
          {partner.tagline ?? partner.specialty}
        </p>

        <div style={{ marginTop: 4 }}>
          <CommitmentMarkList commitments={partner.commitments} />
        </div>

        {partner.products.length > 0 && (
          <span
            style={{
              marginTop: 'auto',
              paddingTop: 12,
              borderTop: '1px solid var(--line)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-label-sm)',
              letterSpacing: 'var(--ls-label-sm)',
              color: 'var(--text-muted)',
            }}
          >
            {partner.products.length} produit{partner.products.length > 1 ? 's' : ''} en boutique
          </span>
        )}
      </div>
    </article>
  )
}

export default PartnerCard
