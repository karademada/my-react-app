import { useState } from 'react'
import { Box, Flex, Heading, Text, Image, Grid, Stack } from '@chakra-ui/react'
import { Button } from '../atoms/Button'

export const ProductDetail = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    })
  }

  return (
    <Box maxW="1200px" mx="auto" p={6}>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Box>
          <Image
            src={product.image}
            alt={product.name}
            width="100%"
            borderRadius="lg"
            objectFit="cover"
          />
        </Box>
        
        <Stack gap={4}>
          <Heading size="lg">{product.name}</Heading>
          <Text fontSize="2xl" fontWeight="bold" color="orange.500">
            ${product.price}
          </Text>
          <Text color="gray.600">{product.description}</Text>

          {product.colors && product.colors.length > 0 && (
            <Box>
              <Text fontWeight="bold" mb={2}>Color: {selectedColor?.name}</Text>
              <Flex gap={2} flexWrap="wrap">
                {product.colors.map((color) => (
                  <Box
                    key={color.name}
                    width="40px"
                    height="40px"
                    bg={color.hex}
                    borderRadius="md"
                    border={selectedColor?.name === color.name ? '3px solid black' : '1px solid gray'}
                    cursor="pointer"
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </Flex>
            </Box>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <Box>
              <Text fontWeight="bold" mb={2}>Size</Text>
              <Flex gap={2} flexWrap="wrap">
                {product.sizes.map((size) => (
                  <Box
                    key={size}
                    px={4}
                    py={2}
                    border="1px solid"
                    borderColor={selectedSize === size ? 'black' : 'gray.300'}
                    bg={selectedSize === size ? 'black' : 'white'}
                    color={selectedSize === size ? 'white' : 'black'}
                    borderRadius="md"
                    cursor="pointer"
                    fontWeight={selectedSize === size ? 'bold' : 'normal'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Box>
                ))}
              </Flex>
            </Box>
          )}

          <Box>
            <Text fontWeight="bold" mb={2}>Quantity</Text>
            <Flex gap={2} align="center">
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <Text px={4} fontWeight="bold">{quantity}</Text>
              <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
            </Flex>
          </Box>

          <Button
            colorScheme="orange"
            size="lg"
            width="100%"
            onClick={handleAddToCart}
          >
            Add to Basket
          </Button>
        </Stack>
      </Grid>
    </Box>
  )
}
