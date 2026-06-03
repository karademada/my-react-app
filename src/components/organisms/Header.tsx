import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Box, Flex, Heading, HStack, Input, Text, chakra } from '@chakra-ui/react'

const SelectBox = chakra('select')
import { Button } from '../atoms/Button'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { User } from '../../types'

gsap.registerPlugin(ScrollTrigger)

export interface HeaderProps {
  isAuthenticated: boolean
  user: User | null
  loyaltyPoints: number
  cartItemCount: number
  isCartOpen: boolean
  searchQuery: string
  selectedCategory: string | null
  categories: string[]
  onLogin: () => void
  onLogout: () => void
  onCartToggle: () => void
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string | null) => void
  cartContent?: ReactNode
}

export const Header = ({
  isAuthenticated,
  user,
  loyaltyPoints,
  cartItemCount,
  isCartOpen,
  searchQuery,
  selectedCategory,
  categories,
  onLogin,
  onLogout,
  onCartToggle,
  onSearchChange,
  onCategoryChange,
  cartContent,
}: HeaderProps) => {
  const cartRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const topBarRef = useRef<HTMLDivElement>(null)
  const categoryNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCartOpen) {
      gsap.fromTo(
        cartRef.current,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
      )
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      )
    }
  }, [isCartOpen])

  useEffect(() => {
    gsap.fromTo(
      topBarRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
    )
    gsap.fromTo(
      categoryNavRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' },
    )

    gsap.to(headerRef.current, {
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '+=300',
        scrub: 1,
      },
      y: -50,
      opacity: 0.8,
    })
  }, [])

  return (
    <>
      <Box ref={headerRef} bg="gray.900" color="white">
        <Box ref={topBarRef} px={8} py={3}>
          <Flex justify="space-between" align="center" gap={4}>
            <Heading size="md" minW="150px">
              Redux Shop
            </Heading>

            <Flex flex={1} maxW="800px" gap={0}>
              <SelectBox
                value={selectedCategory ?? 'all'}
                onChange={(e) =>
                  onCategoryChange(
                    e.target.value === 'all' ? null : e.target.value,
                  )
                }
                bg="gray.100"
                color="black"
                borderRightRadius="0"
                width="150px"
                px={3}
                py={2}
                border="none"
              >
                <option value="all">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </SelectBox>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                bg="white"
                color="black"
                borderRadius="0"
                flex={1}
              />
              <Button colorScheme="orange" borderLeftRadius="0" px={6}>
                🔍
              </Button>
            </Flex>

            <HStack gap={4}>
              {isAuthenticated && user ? (
                <Box textAlign="right" cursor="pointer">
                  <Text fontSize="xs">
                    Hello, {user.email?.split('@')[0] ?? ''}
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" onClick={onLogout}>
                    Logout
                  </Text>
                </Box>
              ) : (
                <HStack gap={2}>
                  <Input
                    placeholder="Email"
                    type="email"
                    id="header-email"
                    size="sm"
                    bg="white"
                    color="black"
                    width="150px"
                  />
                  <Button colorScheme="orange" size="sm" onClick={onLogin}>
                    Login
                  </Button>
                </HStack>
              )}

              <Box position="relative" cursor="pointer" onClick={onCartToggle}>
                <Text fontSize="2xl">🛒</Text>
                {cartItemCount > 0 && (
                  <Box
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    bg="orange.500"
                    color="white"
                    borderRadius="full"
                    px={2}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {cartItemCount}
                  </Box>
                )}
                <Text fontSize="xs" fontWeight="bold">
                  Basket
                </Text>
              </Box>
            </HStack>
          </Flex>
        </Box>

        <Box ref={categoryNavRef} bg="gray.800" px={8} py={2}>
          <HStack gap={4} fontSize="sm">
            <Text
              cursor="pointer"
              _hover={{ textDecoration: 'underline' }}
              onClick={() => onCategoryChange(null)}
            >
              All
            </Text>
            {categories.map((cat) => (
              <Text
                key={cat}
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
                onClick={() => onCategoryChange(cat)}
                fontWeight={selectedCategory === cat ? 'bold' : 'normal'}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            ))}
            {isAuthenticated && (
              <Text fontSize="xs" ml="auto">
                Loyalty Points: {loyaltyPoints}
              </Text>
            )}
          </HStack>
        </Box>
      </Box>

      {isCartOpen && (
        <Box
          ref={cartRef}
          position="fixed"
          top="0"
          right="0"
          width="400px"
          height="100vh"
          bg="white"
          boxShadow="-2px 0 8px rgba(0,0,0,0.1)"
          zIndex="1000"
          overflowY="auto"
        >
          <Box p={4} borderBottom="1px solid" borderColor="gray.200">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold" color="black">
                Shopping Cart
              </Text>
              <Text
                cursor="pointer"
                onClick={onCartToggle}
                fontSize="xl"
                color="black"
              >
                ×
              </Text>
            </Flex>
          </Box>
          <Box p={4}>{cartContent}</Box>
        </Box>
      )}
      {isCartOpen && (
        <Box
          ref={backdropRef}
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="blackAlpha.600"
          zIndex="999"
          onClick={onCartToggle}
        />
      )}
    </>
  )
}
