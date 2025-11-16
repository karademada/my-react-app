import { CartItem } from '../../components/molecules/CartItem'

export default {
  title: 'Molecules/CartItem',
  component: CartItem,
}

const mockItem = {
  id: 1,
  name: 'Laptop',
  price: 1000,
  quantity: 2,
}

export const Default = {
  args: {
    item: mockItem,
    onUpdateQuantity: (id, quantity) => console.log('Update:', id, quantity),
    onRemove: (id) => console.log('Remove:', id),
  },
}