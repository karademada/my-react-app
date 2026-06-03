import { Text as ChakraText } from '@chakra-ui/react'
import type { TextProps as ChakraTextProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export interface TextProps extends Omit<ChakraTextProps, 'textStyle'> {
  children?: ReactNode
  size?: ChakraTextProps['textStyle']
}

export const Text = ({ children, size = 'md', ...props }: TextProps) => {
  return (
    <ChakraText textStyle={size} {...props}>
      {children}
    </ChakraText>
  )
}
