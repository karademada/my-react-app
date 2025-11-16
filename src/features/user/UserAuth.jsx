import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, selectLoyaltyPoints } from './userSelectors'
import { selectCartItemCount } from '../cart/cartSelectors'
import { login, logout } from './userSlice'
import { Header } from '../../components/organisms/Header'
import Cart from '../cart/Cart'

export default function UserAuth() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loyaltyPoints = useSelector(selectLoyaltyPoints)
  const cartItemCount = useSelector(selectCartItemCount)
  const dispatch = useDispatch()

  const handleLogin = () => {
    const email = document.getElementById('header-email').value
    dispatch(login({ email, token: 'token123', roles: ['customer'] }))
  }

  return (
    <Header
      isAuthenticated={isAuthenticated}
      user={currentUser}
      loyaltyPoints={loyaltyPoints}
      cartItemCount={cartItemCount}
      isCartOpen={isCartOpen}
      onLogin={handleLogin}
      onLogout={() => dispatch(logout())}
      onCartToggle={() => setIsCartOpen(!isCartOpen)}
      cartContent={<Cart />}
    />
  )
}