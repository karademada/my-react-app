import { Box, Flex, Heading, HStack, Input, Text, Badge, Drawer, Select, InputGroup } from '@chakra-ui/react'
import { Button } from '../atoms/Button'

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
}) => {
  return (
    <>
      <Box bg="gray.900" color="white">
        {/* Top bar */}
        <Box px={8} py={3}>
          <Flex justify="space-between" align="center" gap={4}>
            <Heading size="md" minW="150px">Redux Shop</Heading>
            
            {/* Search bar */}
            <Flex flex={1} maxW="800px" gap={0}>
              <Select
                value={selectedCategory || 'all'}
                onChange={(e) => onCategoryChange(e.target.value === 'all' ? null : e.target.value)}
                bg="gray.100"
                color="black"
                borderRightRadius="0"
                width="150px"
              >
                <option value="all">All</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              <InputGroup flex={1}>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  bg="white"
                  color="black"
                  borderRadius="0"
                />
                <Button
                  colorScheme="orange"
                  borderLeftRadius="0"
                  px={6}
                >
                  🔍
                </Button>
              </InputGroup>
            </Flex>

            {/* Right section */}
            <HStack gap={4}>
              {isAuthenticated ? (
                <Box textAlign="right" cursor="pointer">
                  <Text fontSize="xs">Hello, {user.email.split('@')[0]}</Text>
                  <Text fontSize="sm" fontWeight="bold" onClick={onLogout}>Logout</Text>
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
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorPalette="orange"
                    borderRadius="full"
                    px={2}
                  >
                    {cartItemCount}
                  </Badge>
                )}
                <Text fontSize="xs" fontWeight="bold">Basket</Text>
              </Box>
            </HStack>
          </Flex>
        </Box>

        {/* Category nav */}
        <Box bg="gray.800" px={8} py={2}>
          <HStack gap={4} fontSize="sm">
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }} onClick={() => onCategoryChange(null)}>All</Text>
            {categories.map(cat => (
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
              <Text fontSize="xs" ml="auto">Loyalty Points: {loyaltyPoints}</Text>
            )}
          </HStack>
        </Box>
      </Box>

      <Drawer.Root open={isCartOpen} onOpenChange={onCartToggle} placement="end" size="md">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Shopping Cart</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>{cartContent}</Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  )
}