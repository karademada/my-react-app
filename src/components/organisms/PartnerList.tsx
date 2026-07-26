import type { Commitment, Partner, PartnerFilters, PartnerKind } from '../../types/partner'
import { PARTNER_KIND_LABELS } from '../../types/partner'
import { PartnerCard } from '../molecules/PartnerCard'

const KINDS = Object.keys(PARTNER_KIND_LABELS) as PartnerKind[]

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-label-sm)',
  fontWeight: 500,
  letterSpacing: 'var(--ls-label)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
}

interface FilterButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

const FilterButton = ({ active, onClick, children }: FilterButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    style={{
      background: 'none',
      border: 'none',
      padding: '0 0 4px',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--ls-label-sm)',
      textTransform: 'uppercase',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)',
      borderBottom: `1.5px solid ${active ? 'var(--text-strong)' : 'transparent'}`,
      transition: 'color var(--dur-fast), border-color var(--dur-fast)',
    }}
  >
    {children}
  </button>
)

export interface PartnerListProps {
  partners: Partner[]
  commitments: Commitment[]
  filters: PartnerFilters
  regions: string[]
  isLoading?: boolean
  isError?: boolean
  onSelectKind: (kind: PartnerKind) => void
  onToggleCommitment: (slug: string) => void
  onPartnerClick: (slug: string) => void
  onRetry?: () => void
}

export const PartnerList = ({
  partners,
  commitments,
  filters,
  regions,
  isLoading,
  isError,
  onSelectKind,
  onToggleCommitment,
  onPartnerClick,
  onRetry,
}: PartnerListProps) => (
  <div
    style={{
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--gutter) var(--space-24)',
    }}
  >
    <header
      style={{
        padding: 'var(--space-20) 0 var(--space-12)',
        maxWidth: 'var(--container-text)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <span style={labelStyle}>La filière</span>
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-display-lg)',
          fontWeight: 600,
          lineHeight: 1.04,
          letterSpacing: 'var(--ls-display)',
          color: 'var(--text-strong)',
        }}
      >
        Chaque produit porte le nom de celui qui l'a fait pousser.
      </h1>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--text-muted)',
        }}
      >
        Fermiers, collecteurs et coopératives avec qui nous travaillons en direct. Chaque
        référence de la boutique remonte jusqu'à sa parcelle.
      </p>
      {partners.length > 0 && (
        <span style={labelStyle}>
          {partners.length} partenaire{partners.length > 1 ? 's' : ''}
          {regions.length > 0 && ` · ${regions.length} région${regions.length > 1 ? 's' : ''}`}
        </span>
      )}
    </header>

    <div
      style={{
        borderTop: '1px solid var(--line)',
        paddingTop: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-12)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={labelStyle}>Métier</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
          {KINDS.map((kind) => (
            <FilterButton
              key={kind}
              active={filters.kind === kind}
              onClick={() => onSelectKind(kind)}
            >
              {PARTNER_KIND_LABELS[kind]}
            </FilterButton>
          ))}
        </div>
      </div>

      {commitments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={labelStyle}>Engagement</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
            {commitments.map((c) => (
              <FilterButton
                key={c.slug}
                active={filters.commitmentSlugs.includes(c.slug)}
                onClick={() => onToggleCommitment(c.slug)}
              >
                {c.name}
              </FilterButton>
            ))}
          </div>
        </div>
      )}
    </div>

    {isLoading ? (
      <p style={{ ...labelStyle, padding: 'var(--space-16) 0' }}>Chargement…</p>
    ) : isError ? (
      <div style={{ padding: 'var(--space-16) 0', maxWidth: 480 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-strong)' }}>
          La liste des partenaires n'a pas pu être chargée.
        </p>
        <button
          type="button"
          onClick={onRetry}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            color: 'var(--accent)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Réessayer
        </button>
      </div>
    ) : partners.length === 0 ? (
      <div style={{ padding: 'var(--space-16) 0', maxWidth: 480 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-strong)' }}>
          Aucun partenaire ne correspond à ces filtres.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
          Retirez un critère pour élargir la recherche.
        </p>
      </div>
    ) : (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-8)',
        }}
      >
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} onPartnerClick={onPartnerClick} />
        ))}
      </div>
    )}
  </div>
)

export default PartnerList
