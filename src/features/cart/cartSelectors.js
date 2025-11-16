import { cartDomain } from './cartDomain'

export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => cartDomain.calculateTotal(state.cart.items)
export const selectCartItemCount = (state) => cartDomain.calculateItemCount(state.cart.items)
export const selectDiscountPercent = (state) => state.cart.discountPercent
export const selectFinalTotal = (state) => {
  const total = cartDomain.calculateTotal(state.cart.items)
  return cartDomain.applyDiscount(total, state.cart.discountPercent)
}
export const selectCanCheckout = (state) => cartDomain.canCheckout(state.cart.items)