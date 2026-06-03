import { Box, Heading, Stack, Text, Flex, Input, HStack } from '@chakra-ui/react'
import { CartItem } from '../molecules/CartItem'
import { Button } from '../atoms/Button'
import type { CartItem as CartItemType } from '../../types'

export interface ShoppingCartProps {
  items: CartItemType[]
  total: number
  discount: number
  finalTotal: number
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  onApplyDiscount: (discount: number) => void
  onClearCart: () => void
}

export const ShoppingCart = ({
  items,
  total,
  discount,
  finalTotal,
  onUpdateQuantity,
  onRemove,
  onApplyDiscount,
  onClearCart,
}: ShoppingCartProps) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <Heading size="lg" mb={4}>
        Shopping Cart ({items.reduce((sum, item) => sum + item.quantity, 0)}{' '}
        items)
      </Heading>
      <Stack gap={3}>
        {items.length === 0 ? (
          <Text color="gray.500">Your cart is empty</Text>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))
        )}
      </Stack>
      {items.length > 0 && (
        <Box mt={4}>
          <Text fontSize="lg">Subtotal: ${total.toFixed(2)}</Text>
          <HStack mt={2}>
            <Input
              type="number"
              placeholder="Discount %"
              value={discount}
              onChange={(e) =>
                onApplyDiscount(parseInt(e.target.value, 10) || 0)
              }
              width="150px"
            />
          </HStack>
          <Text fontSize="xl" fontWeight="bold" mt={2}>
            Total: ${finalTotal.toFixed(2)}
          </Text>
          <Flex gap={2} mt={4}>
            <Button colorScheme="blue" flex={1}>
              Checkout
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={onClearCart}
            >
              Clear Cart
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  )
}
