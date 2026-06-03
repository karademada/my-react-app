import { describe, it, expect } from 'vitest'
import userReducer, {
  login,
  logout,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
} from '../../../features/user/userSlice'
import type { UserState } from '../../../types'

describe('User Slice', () => {
  const initialState: UserState = { currentUser: null, loyaltyPoints: 0 }

  describe('login', () => {
    it('should login user with valid email', () => {
      const state = userReducer(
        initialState,
        login({
          email: 'user@example.com',
          token: 'abc123',
          roles: ['customer'],
        }),
      )
      expect(state.currentUser).toEqual({
        email: 'user@example.com',
        token: 'abc123',
        roles: ['customer'],
      })
    })

    it('should not login with invalid email', () => {
      const state = userReducer(
        initialState,
        login({
          email: 'invalid',
          token: 'abc123',
          roles: ['customer'],
        }),
      )
      expect(state.currentUser).toBeNull()
    })
  })

  describe('logout', () => {
    it('should logout user', () => {
      const loggedInState: UserState = {
        currentUser: { email: 'user@example.com', token: 'abc123' },
        loyaltyPoints: 100,
      }
      const state = userReducer(loggedInState, logout())
      expect(state.currentUser).toBeNull()
    })
  })

  describe('addLoyaltyPoints', () => {
    it('should add loyalty points based on order total', () => {
      const state = userReducer(initialState, addLoyaltyPoints(100))
      expect(state.loyaltyPoints).toBe(10)
    })

    it('should accumulate points', () => {
      let state = userReducer(initialState, addLoyaltyPoints(100))
      state = userReducer(state, addLoyaltyPoints(50))
      expect(state.loyaltyPoints).toBe(15)
    })
  })

  describe('redeemLoyaltyPoints', () => {
    it('should redeem points if available', () => {
      const state: UserState = { currentUser: null, loyaltyPoints: 100 }
      const newState = userReducer(state, redeemLoyaltyPoints(50))
      expect(newState.loyaltyPoints).toBe(50)
    })

    it('should not redeem if insufficient points', () => {
      const state: UserState = { currentUser: null, loyaltyPoints: 10 }
      const newState = userReducer(state, redeemLoyaltyPoints(50))
      expect(newState.loyaltyPoints).toBe(10)
    })
  })
})
