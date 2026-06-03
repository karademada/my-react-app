import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShoppingCart } from '../../components/organisms/ShoppingCart'
import type { CartItem } from '../../types'

const meta: Meta<typeof ShoppingCart> = {
  title: 'Organisms/ShoppingCart',
  component: ShoppingCart,
}

export default meta
type Story = StoryObj<typeof ShoppingCart>

const mockItems: CartItem[] = [
  { id: 1, name: 'Laptop', price: 1000, quantity: 2 },
  { id: 2, name: 'Phone', price: 500, quantity: 1 },
]

export const WithItems: Story = {
  args: {
    items: mockItems,
    total: 2500,
    discount: 10,
    finalTotal: 2250,
    onUpdateQuantity: (id, quantity) => console.log('Update:', id, quantity),
    onRemove: (id) => console.log('Remove:', id),
    onApplyDiscount: (d) => console.log('Discount:', d),
    onClearCart: () => console.log('Clear cart'),
  },
}

export const Empty: Story = {
  args: {
    items: [],
    total: 0,
    discount: 0,
    finalTotal: 0,
    onUpdateQuantity: (id, quantity) => console.log('Update:', id, quantity),
    onRemove: (id) => console.log('Remove:', id),
    onApplyDiscount: (d) => console.log('Discount:', d),
    onClearCart: () => console.log('Clear cart'),
  },
}
