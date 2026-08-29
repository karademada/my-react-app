import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { PartnerProduct } from '../../types'
import {
  availabilityLabel,
  canSaveProduct,
  nextStock,
  parseStockInput,
  productPhoto,
} from '../../features/partner/partnerSpaceDomain'
import { BASE_URL } from '../../api/strapi'
import { Button } from '../atoms/Button'

export interface PartnerProductRowProps {
  product: PartnerProduct
  saving: boolean
  error: string | null
  onSave: (payload: {
    documentId: string
    stock?: number
    available?: boolean
    image?: number
  }) => void
  onUpload: (file: File) => Promise<{ id: number; url: string } | null>
}

const labelStyle = {
  display: 'block',
  marginBottom: 4,
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-muted)',
}

export const PartnerProductRow = ({
  product,
  saving,
  error,
  onSave,
  onUpload,
}: PartnerProductRowProps) => {
  const [stockInput, setStockInput] = useState(String(product.stock))
  const [available, setAvailable] = useState(product.available)
  const [imageId, setImageId] = useState<number | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(productPhoto(product, BASE_URL))
  const [uploading, setUploading] = useState(false)

  const initialPhoto = productPhoto(product, BASE_URL)
  const dirty =
    stockInput !== String(product.stock) ||
    available !== product.available ||
    (imageId !== null && photoPreview !== initialPhoto)

  const setStock = (value: string) => {
    // Refuse ce qui n'est pas des chiffres : la validation fine reste au blur/save.
    if (value !== '' && !/^\d*$/.test(value)) return
    setStockInput(value)
  }

  const step = (delta: number) =>
    setStockInput(String(nextStock(parseStockInput(stockInput) ?? product.stock, delta)))

  const handlePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const uploaded = await onUpload(file)
    setUploading(false)
    if (uploaded) {
      setImageId(uploaded.id)
      setPhotoPreview(`${BASE_URL}${uploaded.url}`)
    }
    e.target.value = ''
  }

  const handleSave = () => {
    const stock = parseStockInput(stockInput)
    if (stock === null) return
    onSave({
      documentId: product.documentId,
      ...(stock !== product.stock ? { stock } : {}),
      ...(available !== product.available ? { available } : {}),
      ...(imageId !== null ? { image: imageId } : {}),
    })
  }

  return (
    <article
      style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        padding: '18px 20px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        flexWrap: 'wrap',
      }}
    >
      <label
        htmlFor={`photo-${product.documentId}`}
        style={{
          flex: '0 0 64px',
          width: 64,
          height: 64,
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--line)',
          cursor: uploading ? 'wait' : 'pointer',
          overflow: 'hidden',
          background: 'var(--bg-canvas)',
          textAlign: 'center',
        }}
      >
        {photoPreview ? (
          <img
            src={photoPreview}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: '64px' }}>＋</span>
        )}
      </label>
      <input
        id={`photo-${product.documentId}`}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhoto}
      />

      <div style={{ flex: '1 1 200px', minWidth: 180 }}>
        <div style={{ fontWeight: 600, color: 'var(--ink-900)', marginBottom: 2 }}>{product.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {Number(product.price).toFixed(2)} € · {availabilityLabel({ stock: parseStockInput(stockInput) ?? product.stock, available })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={labelStyle}>Stock</span>
        <button
          type="button"
          aria-label="Diminuer le stock"
          onClick={() => step(-1)}
          style={{
            width: 30,
            height: 34,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
            background: 'var(--bg-canvas)',
            cursor: 'pointer',
            fontSize: 16,
            color: 'var(--ink-900)',
          }}
        >
          −
        </button>
        <input
          inputMode="numeric"
          value={stockInput}
          onChange={(e) => setStock(e.target.value)}
          style={{
            width: 64,
            height: 34,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: 'var(--ink-900)',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
          }}
        />
        <button
          type="button"
          aria-label="Augmenter le stock"
          onClick={() => step(1)}
          style={{
            width: 30,
            height: 34,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
            background: 'var(--bg-canvas)',
            cursor: 'pointer',
            fontSize: 16,
            color: 'var(--ink-900)',
          }}
        >
          +
        </button>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={available}
        aria-label={available ? 'Produit disponible' : 'Produit indisponible'}
        onClick={() => setAvailable((v) => !v)}
        style={{
          flex: '0 0 auto',
          height: 28,
          width: 52,
          borderRadius: 14,
          border: '1px solid var(--line)',
          background: available ? 'var(--moss-600)' : 'var(--bg-canvas)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: available ? 27 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: 'var(--shadow-sm)',
            transition: 'left 0.15s ease',
          }}
        />
      </button>

      <Button colorScheme="joy" disabled={saving || uploading || !dirty || !canSaveProduct(stockInput, available)} onClick={handleSave}>
        {saving ? '…' : 'Enregistrer'}
      </Button>
      {error && <span style={{ fontSize: 12, color: '#b04a2f', flexBasis: '100%' }}>{error}</span>}
    </article>
  )
}