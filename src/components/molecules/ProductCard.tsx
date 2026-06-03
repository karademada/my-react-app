import { Box, Image, Stack, Heading, Text } from '@chakra-ui/react'
import { Button } from '../atoms/Button'
import type { Product } from '../../types'

export interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onProductClick?: (productId: number) => void
  disabled?: boolean
}

export const ProductCard = ({
  product,
  onAddToCart,
  onProductClick,
  disabled,
}: ProductCardProps) => {
  const stock = product.stock ?? 0
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image
        src={product.image || `https://via.placeholder.com/300x200?text=${product.name}`}
        alt={product.name}
        width="100%"
        height="200px"
        objectFit="cover"
        cursor="pointer"
        onClick={() => onProductClick?.(product.id)}
      />
      <Stack gap={3} p={4}>
        <Heading
          size="md"
          cursor="pointer"
          onClick={() => onProductClick?.(product.id)}
        >
          {product.name}
        </Heading>
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          ${product.price}
        </Text>
        <Text color="gray.600">Stock: {stock}</Text>
        <Text fontSize="sm" color="gray.500">
          {product.category}
        </Text>
        <Button
          onClick={() => onAddToCart(product)}
          disabled={disabled || stock === 0}
          colorScheme={stock > 0 ? 'blue' : 'gray'}
        >
          {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </Stack>
    </Box>
  )
}
