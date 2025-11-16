import { Input as ChakraInput } from '@chakra-ui/react'

export const Input = ({ placeholder, type = 'text', ...props }) => {
  return <ChakraInput placeholder={placeholder} type={type} {...props} />
}