import { describe, it, expect } from 'vitest'
import { cartDomain } from '../../../features/cart/cartDomain'

describe('Cart Domain Logic', () => {
  const mockProduct = { id: 1, name: 'Product 1', price: 10 }
  const mockProduct2 = { id: 2, name: 'Product 2', price: 20 }

  describe('getCartItemKey', () => {
    it('should generate key for product without variants', () => {
      expect(cartDomain.getCartItemKey(mockProduct)).toBe('1')
    })

    it('should generate key with size', () => {
      expect(cartDomain.getCartItemKey({ ...mockProduct, selectedSize: 'M' })).toBe('1-M')
    })

    it('should generate key with color', () => {
      expect(cartDomain.getCartItemKey({ ...mockProduct, selectedColor: { name: 'Red' } })).toBe('1-Red')
    })

    it('should generate key with size and color', () => {
      expect(cartDomain.getCartItemKey({ ...mockProduct, selectedSize: 'L', selectedColor: { name: 'Blue' } })).toBe('1-L-Blue')
    })
  })

  describe('addItem', () => {
    it('should add new item to empty cart', () => {
      const result = cartDomain.addItem([], mockProduct, 1)
      expect(result).toEqual([{ ...mockProduct, cartKey: '1', quantity: 1 }])
    })

    it('should increment quantity if item exists', () => {
      const items = [{ ...mockProduct, cartKey: '1', quantity: 1 }]
      const result = cartDomain.addItem(items, mockProduct, 2)
      expect(result[0].quantity).toBe(3)
    })

    it('should add multiple different items', () => {
      const items = [{ ...mockProduct, cartKey: '1', quantity: 1 }]
      const result = cartDomain.addItem(items, mockProduct2, 1)
      expect(result).toHaveLength(2)
    })

    it('should treat same product with different sizes as separate items', () => {
      const productSizeM = { ...mockProduct, selectedSize: 'M' }
      const productSizeL = { ...mockProduct, selectedSize: 'L' }
      const items = cartDomain.addItem([], productSizeM, 1)
      const result = cartDomain.addItem(items, productSizeL, 1)
      expect(result).toHaveLength(2)
    })

    it('should treat same product with different colors as separate items', () => {
      const productRed = { ...mockProduct, selectedColor: { name: 'Red' } }
      const productBlue = { ...mockProduct, selectedColor: { name: 'Blue' } }
      const items = cartDomain.addItem([], productRed, 1)
      const result = cartDomain.addItem(items, productBlue, 1)
      expect(result).toHaveLength(2)
    })

    it('should increment quantity for same product with same variants', () => {
      const productSizeM = { ...mockProduct, selectedSize: 'M', selectedColor: { name: 'Red' } }
      const items = cartDomain.addItem([], productSizeM, 1)
      const result = cartDomain.addItem(items, productSizeM, 2)
      expect(result).toHaveLength(1)
      expect(result[0].quantity).toBe(3)
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const items = [{ ...mockProduct, cartKey: '1', quantity: 1 }]
      const result = cartDomain.removeItem(items, 1)
      expect(result).toEqual([])
    })

    it('should not affect other items', () => {
      const items = [
        { ...mockProduct, cartKey: '1', quantity: 1 },
        { ...mockProduct2, cartKey: '2', quantity: 1 }
      ]
      const result = cartDomain.removeItem(items, 1)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(2)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const items = [{ ...mockProduct, quantity: 1 }]
      const result = cartDomain.updateQuantity(items, 1, 5)
      expect(result[0].quantity).toBe(5)
    })

    it('should remove item if quantity is 0', () => {
      const items = [{ ...mockProduct, quantity: 1 }]
      const result = cartDomain.updateQuantity(items, 1, 0)
      expect(result).toEqual([])
    })
  })

  describe('calculateTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(cartDomain.calculateTotal([])).toBe(0)
    })

    it('should calculate total for single item', () => {
      const items = [{ ...mockProduct, quantity: 2 }]
      expect(cartDomain.calculateTotal(items)).toBe(20)
    })

    it('should calculate total for multiple items', () => {
      const items = [
        { ...mockProduct, quantity: 2 },
        { ...mockProduct2, quantity: 1 }
      ]
      expect(cartDomain.calculateTotal(items)).toBe(40)
    })
  })

  describe('calculateItemCount', () => {
    it('should return 0 for empty cart', () => {
      expect(cartDomain.calculateItemCount([])).toBe(0)
    })

    it('should count total items', () => {
      const items = [
        { ...mockProduct, quantity: 2 },
        { ...mockProduct2, quantity: 3 }
      ]
      expect(cartDomain.calculateItemCount(items)).toBe(5)
    })
  })

  describe('applyDiscount', () => {
    it('should apply discount percentage', () => {
      expect(cartDomain.applyDiscount(100, 10)).toBe(90)
    })

    it('should handle 0 discount', () => {
      expect(cartDomain.applyDiscount(100, 0)).toBe(100)
    })
  })

  describe('canCheckout', () => {
    it('should return false for empty cart', () => {
      expect(cartDomain.canCheckout([])).toBe(false)
    })

    it('should return true for cart with items', () => {
      const items = [{ ...mockProduct, quantity: 1 }]
      expect(cartDomain.canCheckout(items)).toBe(true)
    })
  })
})