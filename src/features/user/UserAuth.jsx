import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, selectLoyaltyPoints, selectLoyaltyDiscount } from './userSelectors'
import { login, logout } from './userSlice'

export default function UserAuth() {
  const [email, setEmail] = useState('')
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loyaltyPoints = useSelector(selectLoyaltyPoints)
  const loyaltyDiscount = useSelector(selectLoyaltyDiscount)
  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(login({ email, token: 'token123', roles: ['customer'] }))
    setEmail('')
  }

  if (isAuthenticated) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
        <h3>Welcome, {currentUser.email}</h3>
        <p>Loyalty Points: {loyaltyPoints}</p>
        <p>Available Discount: ${loyaltyDiscount.toFixed(2)}</p>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>Login</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}