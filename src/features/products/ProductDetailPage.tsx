import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAllProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { useGetProductsQuery } from '../../api/apiSlice'
import { ProductDetail } from '../../components/organisms/ProductDetail'
import { RouteSkeleton } from '../../components/molecules/RouteSkeleton'
import type { Color, Product } from '../../types'

interface ProductSelection {
  selectedSize?: string | null
  selectedColor?: Color | null
  quantity: number
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const products = useAppSelector(selectAllProducts)
  const dispatch = useAppDispatch()
  // RTK Query dedupes this with the App-level fetch — it only adds the
  // loading signal needed for direct links to /product/:id.
  const { isLoading } = useGetProductsQuery()
  const product: Product | undefined = products.find(
    (p) => p.id === parseInt(id ?? '', 10),
  )

  const handleAddToCart = ({
    selectedSize,
    selectedColor,
    quantity,
  }: ProductSelection) => {
    if (!product) return
    dispatch(
      addToCart({
        product: {
          ...product,
          selectedSize,
          selectedColor,
          name: `${product.name}${selectedSize ? ` — ${selectedSize}` : ''}${selectedColor ? ` · ${selectedColor.name}` : ''}`,
        },
        quantity,
      }),
    )
  }

  const handleBuyNow = (selection: ProductSelection) => {
    handleAddToCart(selection)
    navigate('/cart')
  }

  if (!product) {
    if (isLoading) return <RouteSkeleton />
    return (
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '120px 24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--ink-900)',
            margin: '0 0 10px',
          }}
        >
          Produit introuvable.
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text-muted)', margin: '0 0 32px' }}>
          Ce produit n'existe pas ou n'est plus disponible.
        </p>
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--joy-600)',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
          }}
        >
          Retour à la boutique
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 0' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          ← Retour à la collection
        </button>
      </div>
      <ProductDetail
        product={product}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  )
}
