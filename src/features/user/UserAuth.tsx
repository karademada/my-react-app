import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectLoyaltyPoints,
} from './userSelectors'
import { selectCartItemCount } from '../cart/cartSelectors'
import {
  selectFilters,
  selectAllProducts,
} from '../products/productsSelectors'
import { setCategory, setSearchQuery } from '../products/productsSlice'
import { login, logout } from './userSlice'
import { Header } from '../../components/organisms/Header'
import Cart from '../cart/Cart'

export default function UserAuth() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const currentUser = useAppSelector(selectCurrentUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const loyaltyPoints = useAppSelector(selectLoyaltyPoints)
  const cartItemCount = useAppSelector(selectCartItemCount)
  const filters = useAppSelector(selectFilters)
  const products = useAppSelector(selectAllProducts)
  const dispatch = useAppDispatch()

  const categories = [
    ...new Set(
      products
        .map((p) => p.category)
        .filter((c): c is string => Boolean(c)),
    ),
  ]

  const handleLogin = () => {
    const input = document.getElementById('header-email') as HTMLInputElement | null
    const email = input?.value ?? ''
    dispatch(login({ email, token: 'token123', roles: ['customer'] }))
  }

  return (
    <Header
      isAuthenticated={isAuthenticated}
      user={currentUser}
      loyaltyPoints={loyaltyPoints}
      cartItemCount={cartItemCount}
      isCartOpen={isCartOpen}
      searchQuery={filters.searchQuery}
      selectedCategory={filters.category}
      categories={categories}
      onLogin={handleLogin}
      onLogout={() => dispatch(logout())}
      onCartToggle={() => setIsCartOpen(!isCartOpen)}
      onSearchChange={(query) => dispatch(setSearchQuery(query))}
      onCategoryChange={(category) => dispatch(setCategory(category))}
      cartContent={<Cart />}
    />
  )
}
