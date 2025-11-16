import { describe, it, expect } from 'vitest'
import cartReducer, { addToCart, removeFromCart, updateCartQuantity, applyDiscount, clearCart } from '../../../features/cart/cartSlice'

describe('Cart Slice', () => {
  const initialState = { items: [], discountPercent: 0 }
  const mockProduct = { id: 1, name: 'Product 1', price: 10 }

  it('should handle addToCart', () => {
    const state = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(1)
  })

  it('should handle addToCart with size variant', () => {
    const productWithSize = { ...mockProduct, selectedSize: 'M' }
    const state = cartReducer(initialState, addToCart({ product: productWithSize, quantity: 1 }))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].selectedSize).toBe('M')
  })

  it('should handle addToCart with color variant', () => {
    const productWithColor = { ...mockProduct, selectedColor: { name: 'Red', hex: '#FF0000' } }
    const state = cartReducer(initialState, addToCart({ product: productWithColor, quantity: 1 }))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].selectedColor.name).toBe('Red')
  })

  it('should treat same product with different variants as separate items', () => {
    let state = cartReducer(initialState, addToCart({ product: { ...mockProduct, selectedSize: 'M' }, quantity: 1 }))
    state = cartReducer(state, addToCart({ product: { ...mockProduct, selectedSize: 'L' }, quantity: 1 }))
    expect(state.items).toHaveLength(2)
  })

  it('should handle removeFromCart', () => {
    const state = { items: [{ ...mockProduct, quantity: 1 }], discountPercent: 0 }
    const newState = cartReducer(state, removeFromCart(1))
    expect(newState.items).toHaveLength(0)
  })

  it('should handle updateCartQuantity', () => {
    const state = { items: [{ ...mockProduct, quantity: 1 }], discountPercent: 0 }
    const newState = cartReducer(state, updateCartQuantity({ productId: 1, quantity: 5 }))
    expect(newState.items[0].quantity).toBe(5)
  })

  it('should handle applyDiscount', () => {
    const state = cartReducer(initialState, applyDiscount(10))
    expect(state.discountPercent).toBe(10)
  })

  it('should handle clearCart', () => {
    const state = { items: [{ ...mockProduct, quantity: 1 }], discountPercent: 10 }
    const newState = cartReducer(state, clearCart())
    expect(newState.items).toHaveLength(0)
    expect(newState.discountPercent).toBe(0)
  })
})