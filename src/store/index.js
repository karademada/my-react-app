import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import cartReducer from '../features/cart/cartSlice'
import productsReducer from '../features/products/productsSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    products: productsReducer,
  },
})

export default store