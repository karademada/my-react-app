import type { Partner } from '../../types/partner'
import { PARTNER_KIND_LABELS } from '../../types/partner'
import { CommitmentMarkList } from '../atoms/CommitmentMark'
import { StoryBlocks } from '../molecules/StoryBlocks'

const fmtPrice = (n: number) => '€ ' + Number(n).toFixed(2).replace('.', ',')

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-label-sm)',
  fontWeight: 500,
  letterSpacing: 'var(--ls-label)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
}

/** Une ligne du releve de tracabilite : libelle a gauche, valeur a droite, filet dessous. */
const LedgerRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 16,
      padding: '12px 0',
      borderBottom: '1px solid var(--line)',
    }}
  >
    <span style={labelStyle}>{label}</span>
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        color: 'var(--text-strong)',
        textAlign: 'right',
      }}
    >
      {value}
    </span>
  </div>
)

export interface PartnerDetailProps {
  partner: Partner
  onProductClick?: (productId: number) => void
  onBack?: () => void
}

export const PartnerDetail = ({ partner, onProductClick, onBack }: PartnerDetailProps) => {
  const { location: place, keyFigures, commitments, products, gallery } = partner

  return (
    <div
      style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '0 var(--gutter) var(--space-24)',
      }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            ...labelStyle,
            background: 'none',
            border: 'none',
            padding: 'var(--space-8) 0 0',
            cursor: 'pointer',
          }}
        >
          ← Tous les partenaires
        </button>
      )}

      <header
        style={{
          padding: 'var(--space-10) 0 var(--space-10)',
          maxWidth: 'var(--container-text)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <span style={labelStyle}>
          {PARTNER_KIND_LABELS[partner.kind]}
          {place?.region ? ` · ${place.region}` : ''}
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-display-md)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: 'var(--ls-display)',
            color: 'var(--text-strong)',
          }}
        >
          {partner.name}
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--accent)',
          }}
        >
          {partner.specialty}
        </p>
        {partner.tagline && (
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: 17,
              lineHeight: 1.7,
              color: 'var(--text-muted)',
            }}
          >
            {partner.tagline}
          </p>
        )}
      </header>

      {partner.portrait && (
        <img
          src={partner.portrait}
          alt={`Portrait de ${partner.name}`}
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-16)',
          }}
        />
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-16)',
          alignItems: 'start',
        }}
      >
        <div style={{ minWidth: 0 }}>
          {partner.story && <StoryBlocks blocks={partner.story} />}

          {gallery && gallery.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 'var(--space-4)',
                marginTop: 'var(--space-12)',
              }}
            >
              {gallery.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={partner.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '3 / 4',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: 'var(--radius-md)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Le releve de tracabilite : ce qui distingue cette page d'une page « equipe ». */}
        <aside style={{ maxWidth: 380 }}>
          <span style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>Traçabilité</span>
          <div style={{ borderTop: '1.5px solid var(--text-strong)' }}>
            {place?.town && <LedgerRow label="Commune" value={place.town} />}
            {place?.region && <LedgerRow label="Région" value={place.region} />}
            {place?.country && <LedgerRow label="Pays" value={place.country} />}
            {place?.altitude != null && <LedgerRow label="Altitude" value={`${place.altitude} m`} />}
            {partner.partnerSince && (
              <LedgerRow label="Partenaire depuis" value={partner.partnerSince} />
            )}
            {keyFigures?.map((f) => <LedgerRow key={f.id} label={f.label} value={f.value} />)}
            {partner.website && (
              <LedgerRow
                label="Site"
                value={
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ color: 'var(--accent)', textUnderlineOffset: 3 }}
                  >
                    Consulter
                  </a>
                }
              />
            )}
          </div>

          {commitments.length > 0 && (
            <div style={{ marginTop: 'var(--space-10)' }}>
              <span style={{ ...labelStyle, display: 'block', marginBottom: 14 }}>Engagements</span>
              <CommitmentMarkList commitments={commitments} size="md" />
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {commitments
                  .filter((c) => c.description)
                  .map((c) => (
                    <div key={c.id}>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {c.description}
                      </p>
                      {c.certifier && (
                        <p style={{ ...labelStyle, margin: '6px 0 0' }}>Certifié par {c.certifier}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {products.length > 0 && (
        <section
          style={{
            marginTop: 'var(--space-20)',
            paddingTop: 'var(--space-12)',
            borderTop: '1px solid var(--line)',
          }}
        >
          <h2
            style={{
              margin: '0 0 var(--space-8)',
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-strong)',
            }}
          >
            Ce que {partner.name} nous fournit
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onProductClick?.(product.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  cursor: onProductClick ? 'pointer' : 'default',
                }}
              >
                <div
                  style={{
                    aspectRatio: '1 / 1',
                    background: 'var(--paper-200)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: 10,
                  }}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--text-strong)',
                  }}
                >
                  {product.name}
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    color: 'var(--text-muted)',
                  }}
                >
                  {fmtPrice(product.price)}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default PartnerDetail
