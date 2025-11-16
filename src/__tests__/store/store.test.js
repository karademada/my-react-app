import { describe, it, expect } from 'vitest'
import { store } from '../../store'

describe('Redux Store', () => {
  it('should have all reducers configured', () => {
    const state = store.getState()
    expect(state).toHaveProperty('cart')
    expect(state).toHaveProperty('products')
    expect(state).toHaveProperty('user')
  })

  it('should have initial state for cart', () => {
    const state = store.getState()
    expect(state.cart.items).toEqual([])
    expect(state.cart.discountPercent).toBe(0)
  })

  it('should have initial state for user', () => {
    const state = store.getState()
    expect(state.user.currentUser).toBeNull()
    expect(state.user.loyaltyPoints).toBe(0)
  })

  it('should have initial products', () => {
    const state = store.getState()
    expect(state.products.items.length).toBeGreaterThan(0)
  })
})