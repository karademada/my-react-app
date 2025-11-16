import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    { id: 1, name: 'Laptop', price: 1000, category: 'electronics', stock: 5, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300' },
    { id: 2, name: 'Phone', price: 500, category: 'electronics', stock: 10, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300' },
    { id: 3, name: 'Shirt', price: 50, category: 'clothing', stock: 20, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300' },
  ],
  filters: {
    category: null,
    priceRange: { min: 0, max: Infinity },
    searchQuery: '',
  },
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload
    },
    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { setCategory, setPriceRange, setSearchQuery, clearFilters } = productsSlice.actions
export default productsSlice.reducer