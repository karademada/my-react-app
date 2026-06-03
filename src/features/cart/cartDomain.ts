import type { CartItem, Product } from '../../types'

const getCartItemKey = (product: Product | CartItem): string => {
  const parts: (string | number)[] = [product.id]
  if (product.selectedSize) parts.push(product.selectedSize)
  if (product.selectedColor?.name) parts.push(product.selectedColor.name)
  return parts.join('-')
}

const addItem = (items: CartItem[], product: Product, quantity = 1): CartItem[] => {
  const cartKey = getCartItemKey(product)
  const existing = items.find((item) => getCartItemKey(item) === cartKey)
  if (existing) {
    return items.map((item) =>
      getCartItemKey(item) === cartKey
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    )
  }
  return [...items, { ...product, cartKey, quantity }]
}

const removeItem = (items: CartItem[], productId: number): CartItem[] =>
  items.filter((item) => item.id !== productId)

const updateQuantity = (
  items: CartItem[],
  productId: number,
  quantity: number,
): CartItem[] => {
  if (quantity <= 0) return removeItem(items, productId)
  return items.map((item) =>
    item.id === productId ? { ...item, quantity } : item,
  )
}

const calculateTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const calculateItemCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0)

const applyDiscount = (total: number, discountPercent: number): number =>
  total * (1 - discountPercent / 100)

const canCheckout = (items: CartItem[]): boolean => items.length > 0

export const cartDomain = {
  getCartItemKey,
  addItem,
  removeItem,
  updateQuantity,
  calculateTotal,
  calculateItemCount,
  applyDiscount,
  canCheckout,
}
