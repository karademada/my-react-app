import type { Meta, StoryObj } from '@storybook/react-vite'
import { CartItem } from '../../components/molecules/CartItem'
import type { CartItem as CartItemType } from '../../types'

const meta: Meta<typeof CartItem> = {
  title: 'Molecules/CartItem',
  component: CartItem,
}

export default meta
type Story = StoryObj<typeof CartItem>

const mockItem: CartItemType = {
  id: 1,
  name: 'Laptop',
  price: 1000,
  quantity: 2,
}

export const Default: Story = {
  args: {
    item: mockItem,
    onUpdateQuantity: (id, quantity) => console.log('Update:', id, quantity),
    onRemove: (id) => console.log('Remove:', id),
  },
}
