import { useSelector, useDispatch } from 'react-redux'
import { selectFilteredProducts } from './productsSelectors'
import { addToCart } from '../cart/cartSlice'
import { productsDomain } from './productsDomain'

export default function ProductList() {
  const products = useSelector(selectFilteredProducts)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Products</h2>
      {products.map(product => (
        <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.stock}</p>
          <button
            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
            disabled={!productsDomain.isInStock(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )
}