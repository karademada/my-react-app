import { cartDomain } from './cartDomain'
import type { RootState } from '../../store'

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) =>
  cartDomain.calculateTotal(state.cart.items)
export const selectCartItemCount = (state: RootState) =>
  cartDomain.calculateItemCount(state.cart.items)
export const selectDiscountPercent = (state: RootState) =>
  state.cart.discountPercent
export const selectFinalTotal = (state: RootState) => {
  const total = cartDomain.calculateTotal(state.cart.items)
  return cartDomain.applyDiscount(total, state.cart.discountPercent)
}
export const selectCanCheckout = (state: RootState) =>
  cartDomain.canCheckout(state.cart.items)
export const selectCheckoutStatus = (state: RootState) =>
  state.cart.checkoutStatus
export const selectCheckoutError = (state: RootState) =>
  state.cart.checkoutError
