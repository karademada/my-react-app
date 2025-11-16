import { Box, Flex, Text, HStack } from '@chakra-ui/react'

export const Footer = () => {
  return (
    <Box bg="gray.900" color="white" py={8} mt={12}>
      <Flex direction="column" align="center" gap={4}>
        <HStack gap={6}>
          <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>About</Text>
          <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Contact</Text>
          <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Privacy</Text>
          <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Terms</Text>
        </HStack>
        <Text fontSize="sm" color="gray.400">© 2025 Redux Shop. All rights reserved.</Text>
      </Flex>
    </Box>
  )
}
