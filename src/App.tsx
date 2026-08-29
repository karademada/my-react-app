import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductList from './features/products/ProductList'
import ProductDetailPage from './features/products/ProductDetailPage'
import PartnersPage from './features/partners/PartnersPage'
import PartnerDetailPage from './features/partners/PartnerDetailPage'
import PartnerSpacePage from './features/partner/PartnerSpacePage'
import UserAuth from './features/user/UserAuth'
import LoginPage from './features/user/LoginPage'
import RegisterPage from './features/user/RegisterPage'
import ForgotPasswordPage from './features/user/ForgotPasswordPage'
import ResetPasswordPage from './features/user/ResetPasswordPage'
import ProtectedRoute from './features/user/ProtectedRoute'
import { Footer } from './components/organisms/Footer'
import CartPage from './components/organisms/CartPage'
import CheckoutSuccessPage from './components/organisms/CheckoutSuccessPage'
import { useAppDispatch } from './store/hooks'
import { useGetProductsQuery } from './api/apiSlice'
import { restoreSession } from './features/user/userSlice'

function App() {
  const dispatch = useAppDispatch()
  useGetProductsQuery()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
        <UserAuth />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/partners/:slug" element={<PartnerDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/espace-partenaire"
              element={
                <ProtectedRoute>
                  <PartnerSpacePage />
                </ProtectedRoute>
              }
            />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
