import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import ProductList from './features/products/ProductList'
import ProductDetailPage from './features/products/ProductDetailPage'
import UserAuth from './features/user/UserAuth'

function App() {
  return (
    <BrowserRouter>
      <Box>
        <UserAuth />
        <Container maxW="container.xl" py={6}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  )
}

export default App