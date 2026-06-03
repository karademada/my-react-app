import { Box, Heading, Text, Stack, Input } from '@chakra-ui/react'
import { Button } from '../atoms/Button'
import type { User } from '../../types'

export interface UserProfileProps {
  isAuthenticated: boolean
  user: User | null
  loyaltyPoints: number
  loyaltyDiscount: number
  onLogin: () => void
  onLogout: () => void
}

export const UserProfile = ({
  isAuthenticated,
  user,
  loyaltyPoints,
  loyaltyDiscount,
  onLogin,
  onLogout,
}: UserProfileProps) => {
  if (isAuthenticated && user) {
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
