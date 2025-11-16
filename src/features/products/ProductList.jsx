import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectFilteredProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { ProductList as ProductListUI } from '../../components/organisms/ProductList'

export default function ProductList() {
  const navigate = useNavigate()
  const products = useSelector(selectFilteredProducts)
  const dispatch = useDispatch()

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }))
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  return <ProductListUI products={products} onAddToCart={handleAddToCart} onProductClick={handleProductClick} />
}