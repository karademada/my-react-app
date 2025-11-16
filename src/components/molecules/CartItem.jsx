import { Box, Flex, Heading, Text, HStack, Input, Image } from '@chakra-ui/react'
import { Button } from '../atoms/Button'

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Flex gap={3} align="center">
        <Image
          src={item.image || `https://via.placeholder.com/80?text=${item.name}`}
          alt={item.name}
          boxSize="80px"
          objectFit="cover"
          borderRadius="md"
        />
        <Box flex={1} minW="0">
          <Heading size="sm" noOfLines={2} wordBreak="break-word">{item.name}</Heading>
          <Text color="gray.600">${item.price}</Text>
        </Box>
        <Flex direction="column" gap={2} align="flex-end" minW="120px">
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
            width="70px"
            min="0"
          />
          <Button variant="outline" colorScheme="red" onClick={() => onRemove(item.id)} size="sm" width="100%">
            Remove
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}