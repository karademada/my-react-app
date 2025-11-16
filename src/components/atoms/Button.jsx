import { Button as ChakraButton } from '@chakra-ui/react'

export const Button = ({ children, variant = 'solid', colorScheme = 'blue', ...props }) => {
  return (
    <ChakraButton variant={variant} colorPalette={colorScheme} {...props}>
      {children}
    </ChakraButton>
  )
}