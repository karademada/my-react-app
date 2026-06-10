import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { cartDomain } from './cartDomain'
import { createCheckoutSession } from '../../api/strapi'
import type { CartItem, CartState, Product } from '../../types'

const initialState: CartState = {
  items: [],
  discountPercent: 0,
  checkoutStatus: 'idle',
  checkoutError: null,
}

export const startCheckout = createAsyncThunk(
  'cart/startCheckout',
  async (items: CartItem[]) => {
    const url = await createCheckoutSession(cartDomain.toCheckoutPayload(items))
    window.location.assign(url)
  },
)

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
  extraReducers: (builder) => {
    builder
      .addCase(startCheckout.pending, (state) => {
        state.checkoutStatus = 'loading'
        state.checkoutError = null
      })
      .addCase(startCheckout.fulfilled, (state) => {
        // Stay in loading: the browser is being redirected to Stripe Checkout.
        state.checkoutStatus = 'loading'
      })
      .addCase(startCheckout.rejected, (state) => {
        state.checkoutStatus = 'failed'
        state.checkoutError =
          'Le paiement est indisponible pour le moment. Réessayez dans un instant.'
      })
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
