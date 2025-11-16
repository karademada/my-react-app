// Cart domain logic - pure business functions
export const cartDomain = {
  getCartItemKey: (product) => {
    const parts = [product.id]
    if (product.selectedSize) parts.push(product.selectedSize)
    if (product.selectedColor?.name) parts.push(product.selectedColor.name)
    return parts.join('-')
  },

  addItem: (items, product, quantity = 1) => {
    const cartKey = cartDomain.getCartItemKey(product)
    const existing = items.find(item => cartDomain.getCartItemKey(item) === cartKey)
    if (existing) {
      return items.map(item =>
        cartDomain.getCartItemKey(item) === cartKey
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    }
    return [...items, { ...product, cartKey, quantity }]
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