import { UserProfile } from '../../components/organisms/UserProfile'

export default {
  title: 'Organisms/UserProfile',
  component: UserProfile,
}

export const LoggedOut = {
  args: {
    isAuthenticated: false,
    user: null,
    loyaltyPoints: 0,
    loyaltyDiscount: 0,
    onLogin: () => console.log('Login'),
    onLogout: () => console.log('Logout'),
  },
}

export const LoggedIn = {
  args: {
    isAuthenticated: true,
    user: { email: 'user@example.com' },
    loyaltyPoints: 150,
    loyaltyDiscount: 15,
    onLogin: () => console.log('Login'),
    onLogout: () => console.log('Logout'),
  },
}