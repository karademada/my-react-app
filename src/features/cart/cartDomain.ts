import type { CartItem, CheckoutItemPayload, Product } from '../../types'

const getCartItemKey = (product: Product | CartItem): string => {
  const parts: (string | number)[] = [product.id]
  if (product.selectedSize) parts.push(product.selectedSize)
  if (product.selectedColor?.name) parts.push(product.selectedColor.name)
  return parts.join('-')
}

const addItem = (items: CartItem[], product: Product, quantity = 1): CartItem[] => {
  const qty = Math.max(1, Math.floor(quantity))
  const cartKey = getCartItemKey(product)
  const existing = items.find((item) => getCartItemKey(item) === cartKey)
  if (existing) {
    return items.map((item) =>
      getCartItemKey(item) === cartKey
        ? { ...item, quantity: item.quantity + qty }
        : item,
    )
  }
  return [...items, { ...product, cartKey, quantity: qty }]
}

// Variants of the same product share the same `id` but have distinct
// `cartKey` values (id + size + color). Removal and quantity updates must
// key on `cartKey` — keying on `id` alone would mutate/remove every variant.
const removeItem = (items: CartItem[], cartKey: string): CartItem[] =>
  items.filter((item) => getCartItemKey(item) !== cartKey)

const updateQuantity = (
  items: CartItem[],
  cartKey: string,
  quantity: number,
): CartItem[] => {
  if (quantity <= 0) return removeItem(items, cartKey)
  return items.map((item) =>
    getCartItemKey(item) === cartKey ? { ...item, quantity } : item,
  )
}

const calculateTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const calculateItemCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0)

const clampDiscount = (discountPercent: number): number =>
  Math.min(100, Math.max(0, discountPercent))

const applyDiscount = (total: number, discountPercent: number): number =>
  total * (1 - clampDiscount(discountPercent) / 100)

const canCheckout = (items: CartItem[]): boolean => items.length > 0

const toCheckoutPayload = (items: CartItem[]): CheckoutItemPayload[] =>
  items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    size: item.selectedSize ?? null,
    color: item.selectedColor?.name ?? null,
  }))

export const cartDomain = {
  getCartItemKey,
  addItem,
  removeItem,
  updateQuantity,
  calculateTotal,
  calculateItemCount,
  applyDiscount,
  canCheckout,
  toCheckoutPayload,
}
