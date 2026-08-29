import { useState } from 'react'
import type { Product } from '../../types'
import { Button } from '../atoms/Button'

export interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onProductClick?: (productId: number) => void
  disabled?: boolean
}

const fmt = (n: number) => '€ ' + Number(n).toFixed(2).replace('.', ',')

export const ProductCard = ({ product, onAddToCart, onProductClick, disabled }: ProductCardProps) => {
  const stock = product.stock ?? 0
  const unavailable = product.available === false
  const soldOut = stock === 0 || unavailable
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 240ms, box-shadow 240ms',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      }}
    >
      <div
        onClick={() => onProductClick?.(product.id)}
        style={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', background: 'var(--paper-200)', cursor: onProductClick ? 'pointer' : 'default' }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform 480ms', transform: hover ? 'scale(1.04)' : 'scale(1)',
              filter: soldOut ? 'grayscale(0.6) opacity(0.7)' : 'none',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-300)' }}>placekabar</div>
        )}
        {soldOut && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--berry-600)', color: 'var(--paper-0)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-pill)' }}>{unavailable ? 'Indisponible' : 'Épuisé'}</span>
        )}
      </div>

      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        {product.category && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{product.category}</span>
        )}
        <h3
          onClick={() => onProductClick?.(product.id)}
          style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.015em', color: 'var(--text-strong)', margin: 0, cursor: onProductClick ? 'pointer' : 'default' }}
        >{product.name}</h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 600, color: 'var(--ink-900)' }}>{fmt(product.price)}</span>
          <Button
            colorScheme="ink"
            size="sm"
            disabled={disabled || soldOut}
            onClick={() => onAddToCart(product)}
          >
            {soldOut ? (unavailable ? 'Indisponible' : 'Épuisé') : 'Ajouter'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
