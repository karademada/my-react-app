import { ShoppingCart } from '../../components/organisms/ShoppingCart'

export default {
  title: 'Organisms/ShoppingCart',
  component: ShoppingCart,
}

const mockItems = [
  { id: 1, name: 'Laptop', price: 1000, quantity: 2 },
  { id: 2, name: 'Phone', price: 500, quantity: 1 },
]

export const WithItems = {
  args: {
    items: mockItems,
    total: 2500,
    discount: 10,
    finalTotal: 2250,
    onUpdateQuantity: (id, quantity) => console.log('Update:', id, quantity),
    onRemove: (id) => console.log('Remove:', id),
    onApplyDiscount: (discount) => console.log('Discount:', discount),
    onClearCart: () => console.log('Clear cart'),
  },
}

export const Empty = {
  args: {
    items: [],
    total: 0,
    discount: 0,
    finalTotal: 0,
    onUpdateQuantity: (id, quantity) => console.log('Update:', id, quantity),
    onRemove: (id) => console.log('Remove:', id),
    onApplyDiscount: (discount) => console.log('Discount:', discount),
    onClearCart: () => console.log('Clear cart'),
  },
}