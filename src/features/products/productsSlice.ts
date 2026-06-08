import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PriceRange, Product, ProductsState } from '../../types'
import { fetchProducts as apiFetchProducts } from '../../api/strapi'

const initialState: ProductsState = {
  items: [],
  filters: {
    category: null,
    priceRange: { min: 0, max: Infinity },
    searchQuery: '',
  },
}

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetch',
  async () => {
    return apiFetchProducts()
  },
)

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
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.items = action.payload
    })
  },
})

export const { setCategory, setPriceRange, setSearchQuery, clearFilters } =
  productsSlice.actions
export default productsSlice.reducer
