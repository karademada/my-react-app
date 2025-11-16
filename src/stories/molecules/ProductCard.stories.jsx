import { ProductCard } from '../../components/molecules/ProductCard'

export default {
  title: 'Molecules/ProductCard',
  component: ProductCard,
}

const mockProduct = {
  id: 1,
  name: 'Laptop',
  price: 1000,
  category: 'electronics',
  stock: 5,
}

export const InStock = {
  args: {
    product: mockProduct,
    onAddToCart: (product) => console.log('Added to cart:', product),
  },
}

export const OutOfStock = {
  args: {
    product: { ...mockProduct, stock: 0 },
    onAddToCart: (product) => console.log('Added to cart:', product),
  },
}

export const Disabled = {
  args: {
    product: mockProduct,
    disabled: true,
    onAddToCart: (product) => console.log('Added to cart:', product),
  },
}