import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { PartnerProfile, PartnerProfilePatch } from '../../types'
import {
  absoluteMediaUrl,
  buildProfilePayload,
  validateProfile,
} from '../../features/partner/partnerSpaceDomain'
import { BASE_URL } from '../../api/strapi'
import { Button } from '../atoms/Button'

export interface PartnerProfileFormProps {
  partner: PartnerProfile
  saving: boolean
  error: string | null
  /** Le parent décide de la persistance (RTK Query) — le composant valide. */
  onSave: (payload: PartnerProfilePatch) => void
  onUpload: (file: File) => Promise<{ id: number; url: string } | null>
}

interface ProfileDraft {
  tagline: string
  specialty: string
  website: string
  email: string
  phone: string
  partnerSince: string
}

const draftOf = (p: PartnerProfile): ProfileDraft => ({
  tagline: p.tagline ?? '',
  specialty: p.specialty ?? '',
  website: p.website ?? '',
  email: p.email ?? '',
  phone: p.phone ?? '',
  partnerSince: p.partnerSince != null ? String(p.partnerSince) : '',
})

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-muted)',
}

const inputStyle = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--ink-900)',
  background: 'var(--bg-canvas)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-md)',
  padding: '10px 14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const fieldErrorStyle = { marginTop: 4, fontSize: 12, color: '#b04a2f' }

export const PartnerProfileForm = ({
  partner,
  saving,
  error,
  onSave,
  onUpload,
}: PartnerProfileFormProps) => {
  const [draft, setDraft] = useState<ProfileDraft>(() => draftOf(partner))
  const [portraitId, setPortraitId] = useState<number | null>(null)
  const [portraitPreview, setPortraitPreview] = useState<string | null>(
    absoluteMediaUrl(partner.portrait, BASE_URL),
  )
  const [uploading, setUploading] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  const errors = useMemo(
    () => validateProfile(draft),
    [draft],
  )
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(draftOf(partner)), [draft, partner])

  const set = (field: keyof ProfileDraft) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((d) => ({ ...d, [field]: e.target.value }))

  const handlePortrait = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const uploaded = await onUpload(file)
    setUploading(false)
    if (uploaded) {
      setPortraitId(uploaded.id)
      setPortraitPreview(absoluteMediaUrl(uploaded.url, BASE_URL))
    }
    e.target.value = ''
  }

  const handleSave = () => {
    if (Object.keys(errors).length > 0) return
    const payload = buildProfilePayload(partner, draft)
    if (portraitId) payload.portrait = portraitId
    onSave(payload)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2500)
  }

  return (
    <section
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 36px',
        marginBottom: 32,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--moss-700)',
          margin: '0 0 24px',
        }}
      >
        Profil public
      </h2>

      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 160px' }}>
          <span style={labelStyle}>Portrait</span>
          <label
            htmlFor="partner-portrait"
            style={{
              display: 'block',
              width: 160,
              height: 160,
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--line)',
              cursor: uploading ? 'wait' : 'pointer',
              overflow: 'hidden',
              background: 'var(--bg-canvas)',
              textAlign: 'center',
            }}
          >
            {portraitPreview ? (
              <img
                src={portraitPreview}
                alt={partner.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 62,
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}
              >
                {uploading ? 'Envoi…' : 'Choisir une photo'}
              </span>
            )}
          </label>
          <input
            id="partner-portrait"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePortrait}
          />
        </div>

        <div style={{ flex: '1 1 320px', display: 'grid', gap: 16 }}>
          <div>
            <label style={labelStyle} htmlFor="partner-tagline">
              Signature (max. 200)
            </label>
            <textarea
              id="partner-tagline"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
              value={draft.tagline}
              onChange={set('tagline')}
            />
            {errors.tagline && <div style={fieldErrorStyle}>{errors.tagline}</div>}
          </div>

          <div>
            <label style={labelStyle} htmlFor="partner-specialty">
              Spécialité
            </label>
            <input id="partner-specialty" style={inputStyle} value={draft.specialty} onChange={set('specialty')} />
            {errors.specialty && <div style={fieldErrorStyle}>{errors.specialty}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle} htmlFor="partner-website">
                Site web
              </label>
              <input id="partner-website" style={inputStyle} value={draft.website} onChange={set('website')} placeholder="https://…" />
              {errors.website && <div style={fieldErrorStyle}>{errors.website}</div>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="partner-email">
                E-mail public
              </label>
              <input id="partner-email" style={inputStyle} value={draft.email} onChange={set('email')} />
              {errors.email && <div style={fieldErrorStyle}>{errors.email}</div>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="partner-phone">
                Téléphone
              </label>
              <input id="partner-phone" style={inputStyle} value={draft.phone} onChange={set('phone')} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="partner-since">
                Partenaire depuis (année)
              </label>
              <input id="partner-since" inputMode="numeric" style={inputStyle} value={draft.partnerSince} onChange={set('partnerSince')} placeholder="2018" />
              {errors.partnerSince && <div style={fieldErrorStyle}>{errors.partnerSince}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <Button colorScheme="joy" disabled={saving || uploading || Object.keys(errors).length > 0} onClick={handleSave}>
              {saving ? 'Enregistrement…' : 'Enregistrer le profil'}
            </Button>
            {!dirty && savedFlash && !error && <span style={{ fontSize: 13, color: 'var(--moss-600)' }}>✓ Enregistré</span>}
            {error && <span style={fieldErrorStyle}>{error}</span>}
          </div>
        </div>
      </div>
    </section>
  )
}

