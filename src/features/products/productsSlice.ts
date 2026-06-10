import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PriceRange, ProductsState } from '../../types'
import { api } from '../../api/apiSlice'

const initialState: ProductsState = {
  items: [],
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
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload
    },
    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.filters.priceRange = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getProducts.matchFulfilled,
      (state, action) => {
        state.items = action.payload
      },
    )
  },
})

export const { setCategory, setPriceRange, setSearchQuery, clearFilters } =
  productsSlice.actions
export default productsSlice.reducer
