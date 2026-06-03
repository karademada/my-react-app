import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductCard } from '../../components/molecules/ProductCard'
import type { Product } from '../../types'

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
}

export default meta
type Story = StoryObj<typeof ProductCard>

const mockProduct: Product = {
  id: 1,
  name: 'Laptop',
  price: 1000,
  category: 'electronics',
  stock: 5,
}

export const InStock: Story = {
  args: {
    product: mockProduct,
    onAddToCart: (product) => console.log('Added to cart:', product),
  },
}

export const OutOfStock: Story = {
  args: {
    product: { ...mockProduct, stock: 0 },
    onAddToCart: (product) => console.log('Added to cart:', product),
  },
}

export const Disabled: Story = {
  args: {
    product: mockProduct,
    disabled: true,
    onAddToCart: (product) => console.log('Added to cart:', product),
  },
}
