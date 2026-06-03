import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/atoms/Button'

const meta: Meta<typeof Button> = {
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

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'solid',
    colorScheme: 'blue',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    colorScheme: 'blue',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    colorScheme: 'blue',
  },
}
