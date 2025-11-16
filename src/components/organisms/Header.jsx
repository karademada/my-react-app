import { Box, Flex, Heading, HStack, Input, Text, Badge, Drawer } from '@chakra-ui/react'
import { Button } from '../atoms/Button'

export const Header = ({
  isAuthenticated,
  user,
  loyaltyPoints,
  cartItemCount,
  isCartOpen,
  onLogin,
  onLogout,
  onCartToggle,
  cartContent,
}) => {
  return (
    <>
      <Box bg="blue.600" color="white" px={8} py={4} mb={6}>
        <Flex justify="space-between" align="center">
          <Heading size="lg">Redux Ecommerce</Heading>
          <HStack gap={4}>
            <Box position="relative" cursor="pointer" onClick={onCartToggle}>
              <Text fontSize="2xl">🛒</Text>
              {cartItemCount > 0 && (
                <Badge
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  colorPalette="red"
                  borderRadius="full"
                  px={2}
                >
                  {cartItemCount}
                </Badge>
              )}
            </Box>
            {isAuthenticated ? (
              <HStack gap={4}>
                <Box textAlign="right">
                  <Text fontSize="sm">{user.email}</Text>
                  <Text fontSize="xs">Points: {loyaltyPoints}</Text>
                </Box>
                <Button colorScheme="red" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </HStack>
            ) : (
              <HStack gap={2}>
                <Input
                  placeholder="Email"
                  type="email"
                  id="header-email"
                  size="sm"
                  bg="white"
                  color="black"
                  width="200px"
                />
                <Button colorScheme="green" size="sm" onClick={onLogin}>
                  Login
                </Button>
              </HStack>
            )}
          </HStack>
        </Flex>
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