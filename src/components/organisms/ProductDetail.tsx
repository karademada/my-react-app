import { useState } from 'react'
import type { Color, Product } from '../../types'
import { Button } from '../atoms/Button'

export interface ProductDetailSelection {
  selectedSize: string | null
  selectedColor: Color | null
  quantity: number
}

export interface ProductDetailProps {
  product: Product
  onAddToCart: (payload: Product & ProductDetailSelection) => void
  onBuyNow?: (payload: Product & ProductDetailSelection) => void
}

const fmt = (n: number) => '€ ' + Number(n).toFixed(2).replace('.', ',')

export const ProductDetail = ({ product, onAddToCart, onBuyNow }: ProductDetailProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] ?? null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(product.colors?.[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const stock = product.stock ?? 0
  const unavailable = product.available === false
  const soldOut = stock === 0 || unavailable

  const handleAddToCart = () => {
    onAddToCart({ ...product, selectedSize, selectedColor, quantity })
  }

  const handleBuyNow = () => {
    onBuyNow?.({ ...product, selectedSize, selectedColor, quantity })
  }

  return (
    <div
      className="pk-pdp-grid"
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '40px var(--gutter-page) 96px',
      }}
    >
      <div
        style={{
          background: 'var(--paper-200)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          aspectRatio: '4 / 5',
          position: 'relative',
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-300)',
            }}
          >
            placekabar
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 12 }}>
        {product.category && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--moss-700)',
              fontWeight: 500,
            }}
          >
            {product.category} · Récolte 2025
          </span>
        )}

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4vw, 52px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--ink-900)',
            margin: 0,
          }}
        >
          {product.name}
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--ink-900)',
            margin: 0,
          }}
        >
          {fmt(product.price)}
        </p>

        {product.description && (
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              lineHeight: 1.6,
              color: 'var(--text-muted)',
              margin: 0,
              maxWidth: 480,
            }}
          >
            {product.description}
          </p>
        )}

        {product.colors && product.colors.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 10,
              }}
            >
              Couleur · {selectedColor?.name ?? '—'}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {product.colors.map((c) => {
                const active = selectedColor?.name === c.name
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    aria-label={c.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: c.hex,
                      border: '1px solid var(--line)',
                      outline: active ? '2px solid var(--ink-900)' : 'none',
                      outlineOffset: 2,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 10,
              }}
            >
              Taille
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.sizes.map((s) => {
                const active = selectedSize === s
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: active ? 'var(--paper-0)' : 'var(--ink-900)',
                      background: active ? 'var(--ink-900)' : 'var(--bg-surface)',
                      border: '1px solid ' + (active ? 'var(--ink-900)' : 'var(--line)'),
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      minWidth: 52,
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}
          >
            Quantité
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0,
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={{
                background: 'var(--bg-surface)',
                border: 'none',
                padding: '10px 16px',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 18,
                color: 'var(--ink-900)',
              }}
            >−</button>
            <span
              style={{
                padding: '10px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--ink-900)',
                minWidth: 40,
                textAlign: 'center',
                borderLeft: '1px solid var(--line)',
                borderRight: '1px solid var(--line)',
              }}
            >{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
              disabled={stock > 0 && quantity >= stock}
              style={{
                background: 'var(--bg-surface)',
                border: 'none',
                padding: '10px 16px',
                cursor: stock > 0 && quantity >= stock ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 18,
                color: 'var(--ink-900)',
              }}
            >+</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <Button
            colorScheme="ink"
            size="lg"
            uppercase
            disabled={soldOut}
            onClick={handleAddToCart}
          >
            {soldOut ? (unavailable ? 'Momentanément indisponible' : 'Épuisé') : 'Ajouter au panier'}
          </Button>
          <Button colorScheme="joy" size="lg" uppercase disabled={soldOut} onClick={handleBuyNow}>
            Acheter maintenant
          </Button>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: '14px 0 0',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
        >
          <span>Livraison neutre en carbone — gratuite dès 60 €.</span>
          <span>Sourcé sans intermédiaire · coopératives partenaires de Madagascar.</span>
          <span>Retours gratuits sous 30 jours.</span>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
