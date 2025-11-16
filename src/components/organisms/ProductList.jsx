import { Grid, Heading, Box } from '@chakra-ui/react'
import { ProductCard } from '../molecules/ProductCard'

export const ProductList = ({ products, onAddToCart }) => {
  return (
    <Box>
      <Heading size="lg" mb={4}>Products</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </Grid>
    </Box>
  )
}