import { useParams, useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAllProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { ProductDetail } from '../../components/organisms/ProductDetail'
import { Button } from '../../components/atoms/Button'
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
          name: `${product.name}${selectedSize ? ` - Size ${selectedSize}` : ''}${selectedColor ? ` - ${selectedColor.name}` : ''}`,
        },
        quantity,
      }),
    )
  }

  if (!product) return null

  return (
    <Box>
      <Button onClick={() => navigate('/')} mb={4}>
        ← Back to Products
      </Button>
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </Box>
  )
}
