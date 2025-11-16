import { Box, Flex, Heading, Text, HStack, Input } from '@chakra-ui/react'
import { Button } from '../atoms/Button'

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="sm">{item.name}</Heading>
          <Text color="gray.600">${item.price}</Text>
        </Box>
        <HStack gap={2}>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
            width="70px"
            min="0"
          />
          <Button variant="outline" colorScheme="red" onClick={() => onRemove(item.id)}>
            Remove
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}