import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ProductCard } from '../molecules/ProductCard'
import type { Product } from '../../types'

export interface ProductListProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onProductClick?: (productId: number) => void
}

export const ProductList = ({
  products,
  onAddToCart,
  onProductClick,
}: ProductListProps) => {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // HTMLCollection vide reste truthy : tester la longueur, sinon GSAP
    // reçoit 0 cible et log "GSAP target ... not found" sur liste vide.
    const cards = gridRef.current ? Array.from(gridRef.current.children) : []
    if (cards.length === 0) return

    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
    )
    return () => {
      tween.kill()
    }
  }, [products])

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px 24px' }}>
      <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
          Récolte 2025 · Madagascar
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4.6vw, 52px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            color: 'var(--ink-900)',
            margin: 0,
          }}
        >
          Le geste juste, <span style={{ color: 'var(--text-muted)' }}>de la terre à vous.</span>
        </h1>
      </div>

      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 24,
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductList
