import { useEffect, useRef } from 'react'
import { Grid, Heading, Box } from '@chakra-ui/react'
import { ProductCard } from '../molecules/ProductCard'
import gsap from 'gsap'

export const ProductList = ({ products, onAddToCart, onProductClick }) => {
  const gridRef = useRef(null)

  useEffect(() => {
    const cards = gridRef.current?.children
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      )
    }
  }, [products])

  return (
    <Box>
      <Heading size="lg" mb={4}>Products</Heading>
      <Grid ref={gridRef} templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        ))}
      </Grid>
    </Box>
  )
}