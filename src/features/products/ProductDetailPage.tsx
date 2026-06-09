import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAllProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { ProductDetail } from '../../components/organisms/ProductDetail'
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

  if (!product) return null

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
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </div>
  )
}
