import { describe, it, expect } from 'vitest'
import { productsDomain } from '../../../features/products/productsDomain'
import type { Product } from '../../../types'

describe('Products Domain Logic', () => {
  const mockProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 1000, category: 'electronics', stock: 5 },
    { id: 2, name: 'Phone', price: 500, category: 'electronics', stock: 0 },
    { id: 3, name: 'Shirt', price: 50, category: 'clothing', stock: 10 },
  ]

  describe('filterByCategory', () => {
    it('should filter products by category', () => {
      const result = productsDomain.filterByCategory(mockProducts, 'electronics')
      expect(result).toHaveLength(2)
    })

    it('should return all products if no category', () => {
      const result = productsDomain.filterByCategory(mockProducts, null)
      expect(result).toHaveLength(3)
    })
  })

  describe('filterByPriceRange', () => {
    it('should filter products within price range', () => {
      const result = productsDomain.filterByPriceRange(mockProducts, 100, 600)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Phone')
    })
  })

  describe('searchByName', () => {
    it('should search products by name', () => {
      const result = productsDomain.searchByName(mockProducts, 'lap')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Laptop')
    })

    it('should be case insensitive', () => {
      const result = productsDomain.searchByName(mockProducts, 'PHONE')
      expect(result).toHaveLength(1)
    })
  })

  describe('sortByPrice', () => {
    it('should sort ascending by default', () => {
      const result = productsDomain.sortByPrice(mockProducts)
      expect(result[0].price).toBe(50)
      expect(result[2].price).toBe(1000)
    })

    it('should sort descending', () => {
      const result = productsDomain.sortByPrice(mockProducts, false)
      expect(result[0].price).toBe(1000)
      expect(result[2].price).toBe(50)
    })
  })

  describe('isInStock', () => {
    it('should return true if stock > 0', () => {
      expect(productsDomain.isInStock(mockProducts[0])).toBe(true)
    })

    it('should return false if stock = 0', () => {
      expect(productsDomain.isInStock(mockProducts[1])).toBe(false)
    })
  })

  describe('canAddToCart', () => {
    it('should return true if in stock and quantity available', () => {
      expect(productsDomain.canAddToCart(mockProducts[0], 3)).toBe(true)
    })

    it('should return false if out of stock', () => {
      expect(productsDomain.canAddToCart(mockProducts[1], 1)).toBe(false)
    })

    it('should return false if quantity exceeds stock', () => {
      expect(productsDomain.canAddToCart(mockProducts[0], 10)).toBe(false)
    })
  })
})
