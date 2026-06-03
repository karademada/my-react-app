import { Input as ChakraInput } from '@chakra-ui/react'
import type { InputProps as ChakraInputProps } from '@chakra-ui/react'

export interface InputProps extends ChakraInputProps {
  placeholder?: string
  type?: string
}

export const Input = ({ placeholder, type = 'text', ...props }: InputProps) => {
  return <ChakraInput placeholder={placeholder} type={type} {...props} />
}
