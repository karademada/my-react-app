import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserProfile } from '../../components/organisms/UserProfile'

const meta: Meta<typeof UserProfile> = {
  title: 'Organisms/UserProfile',
  component: UserProfile,
}

export default meta
type Story = StoryObj<typeof UserProfile>

export const LoggedOut: Story = {
  args: {
    isAuthenticated: false,
    user: null,
    loyaltyPoints: 0,
    loyaltyDiscount: 0,
    onLogin: () => console.log('Login'),
    onLogout: () => console.log('Logout'),
  },
}

export const LoggedIn: Story = {
  args: {
    isAuthenticated: true,
    user: { email: 'user@example.com', token: 'token123' },
    loyaltyPoints: 150,
    loyaltyDiscount: 15,
    onLogin: () => console.log('Login'),
    onLogout: () => console.log('Logout'),
  },
}
