import { Button as ChakraButton } from '@chakra-ui/react'
import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export interface ButtonProps extends Omit<ChakraButtonProps, 'colorPalette'> {
  children?: ReactNode
  variant?: ChakraButtonProps['variant']
  colorScheme?: ChakraButtonProps['colorPalette']
}

export const Button = ({
  children,
  variant = 'solid',
  colorScheme = 'blue',
  ...props
}: ButtonProps) => {
  return (
    <ChakraButton variant={variant} colorPalette={colorScheme} {...props}>
      {children}
    </ChakraButton>
  )
}
