import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { selectAllProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { ProductDetail } from '../../components/organisms/ProductDetail'
import { Button } from '../../components/atoms/Button'

export default function ProductDetailPage({ productId, onBack }) {
  const products = useSelector(selectAllProducts)
  const dispatch = useDispatch()
  const product = products.find(p => p.id === productId)

  const handleAddToCart = ({ selectedSize, selectedColor, quantity }) => {
    dispatch(addToCart({ 
      product: {
        ...product,
        name: `${product.name}${selectedSize ? ` - Size ${selectedSize}` : ''}${selectedColor ? ` - ${selectedColor.name}` : ''}`
      }, 
      quantity 
    }))
  }

  if (!product) return null

  return (
    <Box>
      <Button onClick={onBack} mb={4}>← Back to Products</Button>
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </Box>
  )
}
