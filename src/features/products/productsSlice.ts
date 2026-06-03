import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PriceRange, ProductsState } from '../../types'

const initialState: ProductsState = {
  items: [
    {
      id: 1,
      name: 'Laptop',
      price: 1000,
      category: 'electronics',
      stock: 5,
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300',
      description: 'High-performance laptop for work and gaming',
    },
    {
      id: 2,
      name: 'Phone',
      price: 500,
      category: 'electronics',
      stock: 10,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      description: 'Latest smartphone with advanced features',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue', hex: '#0000FF' },
      ],
    },
    {
      id: 3,
      name: 'Shirt',
      price: 50,
      category: 'clothing',
      stock: 20,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
      description: 'Comfortable cotton shirt',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#001F3F' },
      ],
    },
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
})

export const { setCategory, setPriceRange, setSearchQuery, clearFilters } =
  productsSlice.actions
export default productsSlice.reducer
