import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetPartnerMeQuery, useUpdatePartnerMeMutation, useUpdatePartnerProductMutation, useUploadPartnerAssetMutation } from '../../api/apiSlice'
import { useAppSelector } from '../../store/hooks'
import { selectIsAuthenticated } from '../user/userSelectors'
import { sortPartnerProducts } from './partnerSpaceDomain'
import { PartnerProfileForm } from '../../components/organisms/PartnerProfileForm'
import { PartnerProductRow } from '../../components/molecules/PartnerProductRow'
import type { PartnerProfilePatch } from '../../types'

const sectionTitle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--moss-700)',
  margin: '40px 0 16px',
} as const

const KIND_LABELS: Record<string, string> = {
  farmer: 'Fermier',
  producer: 'Producteur',
  collector: 'Collecteur',
  cooperative: 'Coopérative',
  processor: 'Transformateur',
  artisan: 'Artisan',
}

const handleUpload = async (
  file: File,
  uploadAsset: ReturnType<typeof useUploadPartnerAssetMutation>[0],
) => {
  const form = new FormData()
  form.append('file', file)
  try {
    const result = await uploadAsset(form).unwrap()
    return result
  } catch {
    return null
  }
}

export default function PartnerSpacePage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const { data, isLoading, isError, error } = useGetPartnerMeQuery(undefined, {
    skip: !isAuthenticated,
  })
  const [updateMe] = useUpdatePartnerMeMutation()
  const [updateProduct] = useUpdatePartnerProductMutation()
  const [uploadAsset] = useUploadPartnerAssetMutation()
  const [saveError, setSaveError] = useState<string | null>(null)

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 720, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>Espace partenaire</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          <Link to="/login">Connectez-vous</Link> pour accéder à votre espace.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: 720, margin: '120px auto', padding: '0 24px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        Chargement de l’espace…
      </div>
    )
  }

  if (isError || !data) {
    const status = (error as { status?: number } | null)?.status
    const notPartner = status === 403
    return (
      <div style={{ maxWidth: 720, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>Espace partenaire</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {notPartner
            ? 'Ce compte n’est pas lié à un partenaire. Si vous gérez une coopérative, contactez l’équipe place·kabar pour activer votre accès.'
            : 'Impossible de charger votre espace pour le moment. Réessayez dans un instant.'}
        </p>
      </div>
    )
  }

  const { partner, products } = data
  const sorted = sortPartnerProducts(products)

  const handleSaveProfile = async (payload: PartnerProfilePatch) => {
    setSaveError(null)
    try {
      await updateMe(payload).unwrap()
    } catch (e) {
      setSaveError((e as { data?: { error?: { message?: string } } })?.data?.error?.message ?? 'Échec de l’enregistrement')
    }
  }

  const handleSaveProduct = async (payload: {
    documentId: string
    stock?: number
    available?: boolean
    image?: number
  }) => {
    setSaveError(null)
    try {
      await updateProduct(payload).unwrap()
    } catch (e) {
      setSaveError((e as { data?: { error?: { message?: string } } })?.data?.error?.message ?? 'Échec de l’enregistrement')
    }
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px 80px' }}>
      <header style={{ marginBottom: 8 }}>
        <span style={{ ...sectionTitle, margin: '0 0 8px' }}>Espace partenaire</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display-md)', fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>
          {partner.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: '6px 0 0' }}>
          {KIND_LABELS[partner.kind] ?? partner.kind}
          {partner.location?.region ? ` · ${partner.location.region}` : ''}
          {partner.partnerSince ? ` · partenaire depuis ${partner.partnerSince}` : ''}
        </p>
      </header>

      <PartnerProfileForm
        partner={partner}
        saving={false}
        error={saveError}
        onSave={handleSaveProfile}
        onUpload={(file) => handleUpload(file, uploadAsset)}
      />

      <h2 style={sectionTitle}>Mes produits ({sorted.length})</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {sorted.map((product) => (
          <PartnerProductRow
            key={product.documentId}
            product={product}
            saving={false}
            error={null}
            onSave={handleSaveProduct}
            onUpload={(file) => handleUpload(file, uploadAsset)}
          />
        ))}
        {sorted.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>
            Aucun produit n’est encore rattaché à votre fiche. L’équipe place·kabar peut les associer pour vous.
          </p>
        )}
      </div>
    </div>
  )
}