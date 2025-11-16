import Counter from './features/counter/Counter'
import ProductList from './features/products/ProductList'
import Cart from './features/cart/Cart'

function App() {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div>
        <h1>Redux Ecommerce</h1>
        <Counter />
        <ProductList />
      </div>
      <div>
        <Cart />
      </div>
    </div>
  )
}

export default App