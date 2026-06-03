import { describe, it, expect } from 'vitest'
import productsReducer, {
  setCategory,
  setPriceRange,
  setSearchQuery,
  clearFilters,
} from '../../../features/products/productsSlice'
import type { ProductsState } from '../../../types'

describe('Products Slice', () => {
  const initialState: ProductsState = {
    items: [
      { id: 1, name: 'Laptop', price: 1000, category: 'electronics', stock: 5 },
    ],
    filters: {
      category: null,
      priceRange: { min: 0, max: Infinity },
      searchQuery: '',
    },
  }

  it('should set category filter', () => {
    const state = productsReducer(initialState, setCategory('electronics'))
    expect(state.filters.category).toBe('electronics')
  })

  it('should set price range filter', () => {
    const state = productsReducer(
      initialState,
      setPriceRange({ min: 100, max: 500 }),
    )
    expect(state.filters.priceRange).toEqual({ min: 100, max: 500 })
  })

  it('should set search query', () => {
    const state = productsReducer(initialState, setSearchQuery('laptop'))
    expect(state.filters.searchQuery).toBe('laptop')
  })

  it('should clear all filters', () => {
    const filteredState: ProductsState = {
      ...initialState,
      filters: {
        category: 'electronics',
        priceRange: { min: 100, max: 500 },
        searchQuery: 'test',
      },
    }
    const state = productsReducer(filteredState, clearFilters())
    expect(state.filters).toEqual(initialState.filters)
  })
})
