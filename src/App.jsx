import { Box, Container } from '@chakra-ui/react'
import ProductList from './features/products/ProductList'
import UserAuth from './features/user/UserAuth'

function App() {
  return (
    <Box>
      <UserAuth />
      <Container maxW="container.xl" py={6}>
        <ProductList />
      </Container>
    </Box>
  )
}

export default App