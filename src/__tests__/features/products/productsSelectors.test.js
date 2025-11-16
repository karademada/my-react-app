import { describe, it, expect } from 'vitest'
import { selectAllProducts, selectFilters, selectFilteredProducts } from '../../../features/products/productsSelectors'

describe('Products Selectors', () => {
  const mockState = {
    products: {
      items: [
        { id: 1, name: 'Laptop', price: 1000, category: 'electronics', stock: 5 },
        { id: 2, name: 'Phone', price: 500, category: 'electronics', stock: 10 },
        { id: 3, name: 'Shirt', price: 50, category: 'clothing', stock: 20 },
      ],
      filters: {
        category: null,
        priceRange: { min: 0, max: Infinity },
        searchQuery: '',
      },
    },
  }

  it('should select all products', () => {
    expect(selectAllProducts(mockState)).toEqual(mockState.products.items)
  })

  it('should select filters', () => {
    expect(selectFilters(mockState)).toEqual(mockState.products.filters)
  })

  it('should filter products by category', () => {
    const state = {
      ...mockState,
      products: {
        ...mockState.products,
        filters: { ...mockState.products.filters, category: 'electronics' },
      },
    }
    const result = selectFilteredProducts(state)
    expect(result).toHaveLength(2)
    expect(result.every(p => p.category === 'electronics')).toBe(true)
  })

  it('should filter products by search query', () => {
    const state = {
      ...mockState,
      products: {
        ...mockState.products,
        filters: { ...mockState.products.filters, searchQuery: 'lap' },
      },
    }
    const result = selectFilteredProducts(state)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Laptop')
  })

  it('should filter products by price range', () => {
    const state = {
      ...mockState,
      products: {
        ...mockState.products,
        filters: { ...mockState.products.filters, priceRange: { min: 100, max: 600 } },
      },
    }
    const result = selectFilteredProducts(state)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Phone')
  })

  it('should apply multiple filters', () => {
    const state = {
      ...mockState,
      products: {
        ...mockState.products,
        filters: {
          category: 'electronics',
          priceRange: { min: 0, max: 600 },
          searchQuery: 'phone',
        },
      },
    }
    const result = selectFilteredProducts(state)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Phone')
  })
})