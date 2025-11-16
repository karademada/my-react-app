import { createSlice } from '@reduxjs/toolkit'
import { cartDomain } from './cartDomain'

const initialState = {
  items: [],
  discountPercent: 0,
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload
      state.items = cartDomain.addItem(state.items, product, quantity)
    },
    removeFromCart: (state, action) => {
      state.items = cartDomain.removeItem(state.items, action.payload)
    },
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      state.items = cartDomain.updateQuantity(state.items, productId, quantity)
    },
    applyDiscount: (state, action) => {
      state.discountPercent = action.payload
    },
    clearCart: (state) => {
      state.items = []
      state.discountPercent = 0
    },
  },
})

export const { addToCart, removeFromCart, updateCartQuantity, applyDiscount, clearCart } = cartSlice.actions
export default cartSlice.reducer