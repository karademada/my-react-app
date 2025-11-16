import { fn } from 'storybook/test'
import { ProductDetail } from '../../components/organisms/ProductDetail'

export default {
  title: 'Organisms/ProductDetail',
  component: ProductDetail,
  tags: ['autodocs'],
  args: {
    onAddToCart: fn(),
  },
}

export const AdidasShoes = {
  args: {
    product: {
      id: 1,
      name: 'adidas Women\'s Barreda Shoes',
      price: 89.99,
      description: 'Comfortable and stylish running shoes with excellent support. Perfect for daily wear and light exercise.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      sizes: ['36', '37', '38', '39', '40', '41', '42'],
      colors: [
        { name: 'Wonder Beige', hex: '#D4C5B9' },
        { name: 'Core Black', hex: '#000000' },
        { name: 'Cloud White', hex: '#F5F5F5' },
        { name: 'Navy Blue', hex: '#1E3A8A' },
      ],
    },
  },
}

export const WithoutOptions = {
  args: {
    product: {
      id: 2,
      name: 'Simple Product',
      price: 49.99,
      description: 'A simple product without size or color options.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
  },
}
