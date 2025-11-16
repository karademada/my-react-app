import { Text as ChakraText } from '@chakra-ui/react'

export const Text = ({ children, size = 'md', ...props }) => {
  return (
    <ChakraText textStyle={size} {...props}>
      {children}
    </ChakraText>
  )
}