import { createSelector } from '@reduxjs/toolkit'
import { productsDomain } from './productsDomain'
import type { RootState } from '../../store'

export const selectAllProducts = (state: RootState) => state.products.items
export const selectFilters = (state: RootState) => state.products.filters

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters],
  (products, filters) => {
    let filtered = products

    if (filters.category) {
      filtered = productsDomain.filterByCategory(filtered, filters.category)
    }

    if (
      filters.priceRange.min > 0 ||
      filters.priceRange.max < Infinity
    ) {
      filtered = productsDomain.filterByPriceRange(
        filtered,
        filters.priceRange.min,
        filters.priceRange.max,
      )
    }

    if (filters.searchQuery) {
      filtered = productsDomain.searchByName(filtered, filters.searchQuery)
    }

    return filtered
  },
)
