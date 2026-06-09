import { userDomain } from './userDomain'
import type { RootState } from '../../store'

export const selectCurrentUser = (state: RootState) => state.user.currentUser
export const selectLoyaltyPoints = (state: RootState) => state.user.loyaltyPoints
export const selectIsAuthenticated = (state: RootState) =>
  userDomain.isAuthenticated(state.user.currentUser)
export const selectCanCheckout = (state: RootState) =>
  userDomain.canCheckout(state.user.currentUser)
export const selectLoyaltyDiscount = (state: RootState) =>
  userDomain.applyLoyaltyDiscount(state.user.loyaltyPoints)
export const selectAuthStatus = (state: RootState) => state.user.status
export const selectAuthError = (state: RootState) => state.user.error
export const selectIsAuthLoading = (state: RootState) =>
  state.user.status === 'loading'
