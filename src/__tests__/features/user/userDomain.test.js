import { describe, it, expect } from 'vitest'
import { userDomain } from '../../../features/user/userDomain'

describe('User Domain Logic', () => {
  const mockUser = {
    id: 1,
    email: 'user@example.com',
    token: 'abc123',
    roles: ['customer'],
    loyaltyPoints: 100,
  }

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(userDomain.validateEmail('test@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(userDomain.validateEmail('invalid')).toBe(false)
      expect(userDomain.validateEmail('test@')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate password with 8+ characters', () => {
      expect(userDomain.validatePassword('password123')).toBe(true)
    })

    it('should reject short password', () => {
      expect(userDomain.validatePassword('pass')).toBe(false)
    })
  })

  describe('isAuthenticated', () => {
    it('should return true for authenticated user', () => {
      expect(userDomain.isAuthenticated(mockUser)).toBe(true)
    })

    it('should return false for null user', () => {
      expect(userDomain.isAuthenticated(null)).toBe(false)
    })

    it('should return false for user without token', () => {
      expect(userDomain.isAuthenticated({ ...mockUser, token: null })).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('should return true if user has role', () => {
      expect(userDomain.hasRole(mockUser, 'customer')).toBe(true)
    })

    it('should return false if user does not have role', () => {
      expect(userDomain.hasRole(mockUser, 'admin')).toBe(false)
    })

    it('should return false for null user', () => {
      expect(userDomain.hasRole(null, 'customer')).toBe(false)
    })
  })

  describe('canCheckout', () => {
    it('should return true for authenticated user with email', () => {
      expect(userDomain.canCheckout(mockUser)).toBe(true)
    })

    it('should return false for unauthenticated user', () => {
      expect(userDomain.canCheckout(null)).toBe(false)
    })

    it('should return false for user without email', () => {
      expect(userDomain.canCheckout({ ...mockUser, email: null })).toBe(false)
    })
  })

  describe('calculateLoyaltyPoints', () => {
    it('should calculate points from order total', () => {
      expect(userDomain.calculateLoyaltyPoints(100)).toBe(10)
    })

    it('should round down points', () => {
      expect(userDomain.calculateLoyaltyPoints(95)).toBe(9)
    })
  })

  describe('applyLoyaltyDiscount', () => {
    it('should calculate discount from points', () => {
      expect(userDomain.applyLoyaltyDiscount(100)).toBe(10)
    })

    it('should cap discount at 50', () => {
      expect(userDomain.applyLoyaltyDiscount(1000)).toBe(50)
    })
  })
})