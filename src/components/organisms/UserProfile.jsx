import { Box, Heading, Text, Stack, Input, HStack } from '@chakra-ui/react'
import { Button } from '../atoms/Button'

export const UserProfile = ({
  isAuthenticated,
  user,
  loyaltyPoints,
  loyaltyDiscount,
  onLogin,
  onLogout,
}) => {
  if (isAuthenticated) {
    return (
      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <Stack gap={3}>
          <Heading size="md">Welcome, {user.email}</Heading>
          <Text>Loyalty Points: {loyaltyPoints}</Text>
          <Text>Available Discount: ${loyaltyDiscount.toFixed(2)}</Text>
          <Button colorScheme="red" onClick={onLogout}>
            Logout
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <Stack gap={3}>
        <Heading size="md">Login</Heading>
        <Input placeholder="Email" type="email" id="login-email" />
        <Button colorScheme="blue" onClick={onLogin}>
          Login
        </Button>
      </Stack>
    </Box>
  )
}