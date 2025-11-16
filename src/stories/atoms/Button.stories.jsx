import { Button } from '../../components/atoms/Button'

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
    colorScheme: {
      control: 'select',
      options: ['blue', 'green', 'red', 'teal'],
    },
  },
}

export const Primary = {
  args: {
    children: 'Primary Button',
    variant: 'solid',
    colorScheme: 'blue',
  },
}

export const Outline = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    colorScheme: 'blue',
  },
}

export const Ghost = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    colorScheme: 'blue',
  },
}