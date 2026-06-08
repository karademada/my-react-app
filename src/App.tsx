import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import ProductList from './features/products/ProductList'
import ProductDetailPage from './features/products/ProductDetailPage'
import UserAuth from './features/user/UserAuth'
import { Footer } from './components/organisms/Footer'
import { useAppDispatch } from './store/hooks'
import { fetchProducts } from './features/products/productsSlice'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Box minH="100vh" display="flex" flexDirection="column">
        <UserAuth />
        <Container maxW="container.xl" py={6} flex="1">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </BrowserRouter>
  )
}

export default App
