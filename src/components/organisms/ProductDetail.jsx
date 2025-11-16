import { useState, useEffect, useRef } from 'react'
import { Box, Flex, Heading, Text, Image, Grid, Stack } from '@chakra-ui/react'
import { Button } from '../atoms/Button'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const ProductDetail = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  
  const imageRef = useRef(null)
  const headingRef = useRef(null)
  const priceRef = useRef(null)
  const descRef = useRef(null)
  const colorRef = useRef(null)
  const sizeRef = useRef(null)
  const quantityRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const elements = [
      { ref: imageRef, x: -50, delay: 0 },
      { ref: headingRef, x: 50, delay: 0.1 },
      { ref: priceRef, x: 50, delay: 0.2 },
      { ref: descRef, x: 50, delay: 0.3 },
      { ref: colorRef, x: 50, delay: 0.4 },
      { ref: sizeRef, x: 50, delay: 0.5 },
      { ref: quantityRef, x: 50, delay: 0.6 },
      { ref: buttonRef, x: 50, delay: 0.7 },
    ]

    elements.forEach(({ ref, x, delay }) => {
      if (ref.current) {
        gsap.fromTo(ref.current,
          { opacity: 0, x },
          { opacity: 1, x: 0, duration: 0.8, delay, ease: 'power2.out' }
        )

        gsap.to(ref.current, {
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: -30,
        })
      }
    })
  }, [product])

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
        <Box ref={imageRef}>
          <Image
            src={product.image}
            alt={product.name}
            width="100%"
            borderRadius="lg"
            objectFit="cover"
          />
        </Box>
        
        <Stack gap={4}>
          <Heading ref={headingRef} size="lg">{product.name}</Heading>
          <Text ref={priceRef} fontSize="2xl" fontWeight="bold" color="orange.500">
            ${product.price}
          </Text>
          <Text ref={descRef} color="gray.600">{product.description}</Text>

          {product.colors && product.colors.length > 0 && (
            <Box ref={colorRef}>
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
            <Box ref={sizeRef}>
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

          <Box ref={quantityRef}>
            <Text fontWeight="bold" mb={2}>Quantity</Text>
            <Flex gap={2} align="center">
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <Text px={4} fontWeight="bold">{quantity}</Text>
              <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
            </Flex>
          </Box>

          <Box ref={buttonRef}>
            <Button
              colorScheme="orange"
              size="lg"
              width="100%"
              onClick={handleAddToCart}
            >
              Add to Basket
            </Button>
          </Box>
        </Stack>
      </Grid>
    </Box>
  )
}
