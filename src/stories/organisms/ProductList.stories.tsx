import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductList } from '../../components/organisms/ProductList'
import type { Product } from '../../types'

const meta: Meta<typeof ProductList> = {
  title: 'Organisms/ProductList',
  component: ProductList,
}

export default meta
type Story = StoryObj<typeof ProductList>

const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 1000, category: 'electronics', stock: 5 },
  { id: 2, name: 'Phone', price: 500, category: 'electronics', stock: 10 },
  { id: 3, name: 'Shirt', price: 50, category: 'clothing', stock: 0 },
]

export const Default: Story = {
  args: {
    products: mockProducts,
    onAddToCart: (product) => console.log('Added:', product),
  },
}

export const Empty: Story = {
  args: {
    products: [],
    onAddToCart: (product) => console.log('Added:', product),
  },
}
