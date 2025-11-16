import { ProductList } from '../../components/organisms/ProductList'

export default {
  title: 'Organisms/ProductList',
  component: ProductList,
}

const mockProducts = [
  { id: 1, name: 'Laptop', price: 1000, category: 'electronics', stock: 5 },
  { id: 2, name: 'Phone', price: 500, category: 'electronics', stock: 10 },
  { id: 3, name: 'Shirt', price: 50, category: 'clothing', stock: 0 },
]

export const Default = {
  args: {
    products: mockProducts,
    onAddToCart: (product) => console.log('Added:', product),
  },
}

export const Empty = {
  args: {
    products: [],
    onAddToCart: (product) => console.log('Added:', product),
  },
}