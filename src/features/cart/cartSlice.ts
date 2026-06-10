import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { cartDomain } from './cartDomain'
import type { CartState, Product } from '../../types'

const initialState: CartState = {
  items: [],
  discountPercent: 0,
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) => {
      const { product, quantity } = action.payload
      state.items = cartDomain.addItem(state.items, product, quantity)
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = cartDomain.removeItem(state.items, action.payload)
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload
      state.items = cartDomain.updateQuantity(state.items, productId, quantity)
    },
    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discountPercent = action.payload
    },
    clearCart: (state) => {
      state.items = []
      state.discountPercent = 0
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  applyDiscount,
  clearCart,
} = cartSlice.actions
export default cartSlice.reducer
