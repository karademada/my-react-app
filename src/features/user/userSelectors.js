import { userDomain } from './userDomain'

export const selectCurrentUser = (state) => state.user.currentUser
export const selectLoyaltyPoints = (state) => state.user.loyaltyPoints
export const selectIsAuthenticated = (state) => userDomain.isAuthenticated(state.user.currentUser)
export const selectCanCheckout = (state) => userDomain.canCheckout(state.user.currentUser)
export const selectLoyaltyDiscount = (state) => userDomain.applyLoyaltyDiscount(state.user.loyaltyPoints)