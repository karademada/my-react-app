import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectFilteredProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { ProductList as ProductListUI } from '../../components/organisms/ProductList'
import type { Product } from '../../types'

export default function ProductList() {
  const navigate = useNavigate()
  const products = useAppSelector(selectFilteredProducts)
  const dispatch = useAppDispatch()

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }))
  }

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`)
  }

  return (
    <ProductListUI
      products={products}
      onAddToCart={handleAddToCart}
      onProductClick={handleProductClick}
    />
  )
}
