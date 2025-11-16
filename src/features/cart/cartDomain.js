// Cart domain logic - pure business functions
export const cartDomain = {
  addItem: (items, product, quantity = 1) => {
    const existing = items.find(item => item.id === product.id)
    if (existing) {
      return items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    }
    return [...items, { ...product, quantity }]
  },

  removeItem: (items, productId) => items.filter(item => item.id !== productId),

  updateQuantity: (items, productId, quantity) => {
    if (quantity <= 0) return cartDomain.removeItem(items, productId)
    return items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
  },

  calculateTotal: (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  calculateItemCount: (items) =>
    items.reduce((sum, item) => sum + item.quantity, 0),

  applyDiscount: (total, discountPercent) =>
    total * (1 - discountPercent / 100),

  canCheckout: (items) => items.length > 0,
}