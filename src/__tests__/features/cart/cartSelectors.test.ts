import { describe, it, expect } from 'vitest'
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectFinalTotal,
  selectCanCheckout,
} from '../../../features/cart/cartSelectors'
import type { RootState } from '../../../store'

describe('Cart Selectors', () => {
  const mockState = {
    cart: {
      items: [
        { id: 1, name: 'Laptop', price: 1000, quantity: 2 },
        { id: 2, name: 'Phone', price: 500, quantity: 1 },
      ],
      discountPercent: 10,
    },
  } as unknown as RootState

  it('should select cart items', () => {
    expect(selectCartItems(mockState)).toEqual(mockState.cart.items)
  })

  it('should calculate cart total', () => {
    expect(selectCartTotal(mockState)).toBe(2500)
  })

  it('should calculate cart item count', () => {
    expect(selectCartItemCount(mockState)).toBe(3)
  })

  it('should calculate final total with discount', () => {
    expect(selectFinalTotal(mockState)).toBe(2250)
  })

  it('should check if can checkout', () => {
    expect(selectCanCheckout(mockState)).toBe(true)
  })

  it('should return false for empty cart checkout', () => {
    const emptyState = {
      cart: { items: [], discountPercent: 0 },
    } as unknown as RootState
    expect(selectCanCheckout(emptyState)).toBe(false)
  })
})
