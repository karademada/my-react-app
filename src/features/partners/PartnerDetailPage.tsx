import { useNavigate, useParams } from 'react-router-dom'
import { useGetPartnerBySlugQuery } from '../../api/partnersApi'
import { PartnerDetail } from '../../components/organisms/PartnerDetail'

const centered: React.CSSProperties = {
  maxWidth: 'var(--container-text)',
  margin: '0 auto',
  padding: 'var(--space-24) var(--gutter)',
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-muted)',
}

export default function PartnerDetailPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { data: partner, isLoading, isError } = useGetPartnerBySlugQuery(slug, { skip: !slug })

  if (isLoading) {
    return <p style={centered}>Chargement…</p>
  }

  if (isError || !partner) {
    return (
      <div style={centered}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--text-strong)',
            margin: '0 0 12px',
          }}
        >
          Ce partenaire n'existe pas ou n'est plus publié.
        </h1>
        <button
          type="button"
          onClick={() => navigate('/partners')}
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
          Voir tous les partenaires
        </button>
      </div>
    )
  }

  return (
    <PartnerDetail
      partner={partner}
      onProductClick={(id) => navigate(`/product/${id}`)}
      onBack={() => navigate('/partners')}
    />
  )
}
