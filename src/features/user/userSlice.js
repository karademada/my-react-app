import { createSlice } from '@reduxjs/toolkit'
import { userDomain } from './userDomain'

const initialState = {
  currentUser: null,
  loyaltyPoints: 0,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, token, roles } = action.payload
      if (userDomain.validateEmail(email)) {
        state.currentUser = { email, token, roles }
      }
    },
    logout: (state) => {
      state.currentUser = null
    },
    addLoyaltyPoints: (state, action) => {
      state.loyaltyPoints += userDomain.calculateLoyaltyPoints(action.payload)
    },
    redeemLoyaltyPoints: (state, action) => {
      const points = action.payload
      if (state.loyaltyPoints >= points) {
        state.loyaltyPoints -= points
      }
    },
  },
})

export const { login, logout, addLoyaltyPoints, redeemLoyaltyPoints } = userSlice.actions
export default userSlice.reducer