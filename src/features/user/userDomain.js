// User domain logic
export const userDomain = {
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  validatePassword: (password) => password.length >= 8,

  isAuthenticated: (user) => user !== null && user.token !== null,

  hasRole: (user, role) => user?.roles?.includes(role) ?? false,

  canCheckout: (user) => userDomain.isAuthenticated(user) && !!user.email,

  calculateLoyaltyPoints: (orderTotal) => Math.floor(orderTotal / 10),

  applyLoyaltyDiscount: (points) => Math.min(points * 0.1, 50),
}