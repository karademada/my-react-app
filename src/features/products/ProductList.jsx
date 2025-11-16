import { useSelector, useDispatch } from 'react-redux'
import { selectFilteredProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { ProductList as ProductListUI } from '../../components/organisms/ProductList'

export default function ProductList({ onProductClick }) {
  const products = useSelector(selectFilteredProducts)
  const dispatch = useDispatch()

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }))
  }

  return <ProductListUI products={products} onAddToCart={handleAddToCart} onProductClick={onProductClick} />
}