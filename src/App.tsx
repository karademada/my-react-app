import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductList from './features/products/ProductList'
import ProductDetailPage from './features/products/ProductDetailPage'
import UserAuth from './features/user/UserAuth'
import { Footer } from './components/organisms/Footer'
import CartPage from './components/organisms/CartPage'
import { useAppDispatch } from './store/hooks'
import { fetchProducts } from './features/products/productsSlice'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
        <UserAuth />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
