import type { Meta, StoryObj } from '@storybook/react-vite'
import { PasswordField } from '../../components/molecules/PasswordField'

const meta: Meta<typeof PasswordField> = {
  title: 'Molecules/PasswordField',
  component: PasswordField,
}

export default meta
type Story = StoryObj<typeof PasswordField>

export const Default: Story = {
  args: {
    id: 'story-password',
    label: 'Mot de passe',
    value: 'motdepasse',
    onChange: (value) => console.log('change:', value),
    hint: '8 caractères minimum',
  },
}

export const Erreur: Story = {
  args: {
    id: 'story-password-error',
    label: 'Mot de passe',
    value: 'court',
    onChange: () => {},
    error: '8 caractères minimum',
  },
}