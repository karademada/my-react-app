import { describe, it, expect } from 'vitest'
import {
  selectCurrentUser,
  selectLoyaltyPoints,
  selectIsAuthenticated,
  selectCanCheckout,
  selectLoyaltyDiscount,
} from '../../../features/user/userSelectors'
import type { RootState } from '../../../store'

describe('User Selectors', () => {
  const mockState = {
    user: {
      currentUser: {
        email: 'user@example.com',
        token: 'abc123',
        roles: ['customer'],
      },
      loyaltyPoints: 150,
    },
  } as unknown as RootState

  it('should select current user', () => {
    expect(selectCurrentUser(mockState)).toEqual(mockState.user.currentUser)
  })

  it('should select loyalty points', () => {
    expect(selectLoyaltyPoints(mockState)).toBe(150)
  })

  it('should check if user is authenticated', () => {
    expect(selectIsAuthenticated(mockState)).toBe(true)
  })

  it('should return false for unauthenticated user', () => {
    const state = {
      user: { currentUser: null, loyaltyPoints: 0 },
    } as unknown as RootState
    expect(selectIsAuthenticated(state)).toBe(false)
  })

  it('should check if user can checkout', () => {
    expect(selectCanCheckout(mockState)).toBe(true)
  })

  it('should calculate loyalty discount', () => {
    expect(selectLoyaltyDiscount(mockState)).toBe(15)
  })

  it('should cap loyalty discount at 50', () => {
    const state = {
      user: { currentUser: null, loyaltyPoints: 1000 },
    } as unknown as RootState
    expect(selectLoyaltyDiscount(state)).toBe(50)
  })
})
