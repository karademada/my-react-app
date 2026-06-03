import type { User } from '../../types'

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validatePassword = (password: string): boolean => password.length >= 8

const isAuthenticated = (user: User | null): boolean =>
  user !== null && user.token !== null

const hasRole = (user: User | null, role: string): boolean =>
  user?.roles?.includes(role) ?? false

const canCheckout = (user: User | null): boolean =>
  isAuthenticated(user) && !!user?.email

const calculateLoyaltyPoints = (orderTotal: number): number =>
  Math.floor(orderTotal / 10)

const applyLoyaltyDiscount = (points: number): number =>
  Math.min(points * 0.1, 50)

export const userDomain = {
  validateEmail,
  validatePassword,
  isAuthenticated,
  hasRole,
  canCheckout,
  calculateLoyaltyPoints,
  applyLoyaltyDiscount,
}
