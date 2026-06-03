import { Box, Flex, Heading, Text, Input, Image } from '@chakra-ui/react'
import { Button } from '../atoms/Button'
import type { CartItem as CartItemType } from '../../types'

export interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
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
          <Heading size="sm" wordBreak="break-word">
            {item.name}
          </Heading>
          {item.selectedSize && (
            <Text fontSize="xs" color="gray.500">
              Size: {item.selectedSize}
            </Text>
          )}
          {item.selectedColor && (
            <Flex align="center" gap={1}>
              <Box
                width="12px"
                height="12px"
                bg={item.selectedColor.hex}
                borderRadius="sm"
                border="1px solid"
                borderColor="gray.300"
              />
              <Text fontSize="xs" color="gray.500">
                {item.selectedColor.name}
              </Text>
            </Flex>
          )}
          <Text color="gray.600">${item.price}</Text>
        </Box>
        <Flex direction="column" gap={2} align="flex-end" minW="120px">
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) =>
              onUpdateQuantity(item.id, parseInt(e.target.value, 10))
            }
            width="70px"
            min="0"
          />
          <Button
            variant="outline"
            colorScheme="red"
            onClick={() => onRemove(item.id)}
            size="sm"
            width="100%"
          >
            Remove
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
