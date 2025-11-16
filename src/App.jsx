import { useState } from 'react'
import { Box, Container } from '@chakra-ui/react'
import ProductList from './features/products/ProductList'
import ProductDetailPage from './features/products/ProductDetailPage'
import UserAuth from './features/user/UserAuth'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <Box>
      <UserAuth />
      <Container maxW="container.xl" py={6}>
        {selectedProduct ? (
          <ProductDetailPage 
            productId={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
          />
        ) : (
          <ProductList onProductClick={setSelectedProduct} />
        )}
      </Container>
    </Box>
  )
}

export default App