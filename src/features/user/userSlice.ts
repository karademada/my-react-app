import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { userDomain } from './userDomain'
import type { UserState } from '../../types'

interface LoginPayload {
  email: string
  token: string
  roles: string[]
}

const initialState: UserState = {
  currentUser: null,
  loyaltyPoints: 0,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { email, token, roles } = action.payload
      if (userDomain.validateEmail(email)) {
        state.currentUser = { email, token, roles }
      }
    },
    logout: (state) => {
      state.currentUser = null
    },
    addLoyaltyPoints: (state, action: PayloadAction<number>) => {
      state.loyaltyPoints += userDomain.calculateLoyaltyPoints(action.payload)
    },
    redeemLoyaltyPoints: (state, action: PayloadAction<number>) => {
      const points = action.payload
      if (state.loyaltyPoints >= points) {
        state.loyaltyPoints -= points
      }
    },
  },
})

export const { login, logout, addLoyaltyPoints, redeemLoyaltyPoints } =
  userSlice.actions
export default userSlice.reducer
