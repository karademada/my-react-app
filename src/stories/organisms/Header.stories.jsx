import { useState } from 'react'
import { Header } from '../../components/organisms/Header'
import { ShoppingCart } from '../../components/organisms/ShoppingCart'

export default {
  title: 'Organisms/Header',
  component: Header,
}

const mockItems = [
  { id: 1, name: 'Laptop', price: 1000, quantity: 2 },
  { id: 2, name: 'Phone', price: 500, quantity: 1 },
]

export const LoggedOut = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState(null)
    return (
      <Header
        isAuthenticated={false}
        user={null}
        loyaltyPoints={0}
        cartItemCount={0}
        isCartOpen={isOpen}
        searchQuery={search}
        selectedCategory={category}
        categories={['electronics', 'clothing', 'books']}
        onLogin={() => console.log('Login')}
        onLogout={() => console.log('Logout')}
        onCartToggle={() => setIsOpen(!isOpen)}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        cartContent={<div>Empty cart</div>}
      />
    )
  },
}

export const LoggedInWithCart = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState(null)
    return (
      <Header
        isAuthenticated={true}
        user={{ email: 'user@example.com' }}
        loyaltyPoints={150}
        cartItemCount={3}
        isCartOpen={isOpen}
        searchQuery={search}
        selectedCategory={category}
        categories={['electronics', 'clothing', 'books']}
        onLogin={() => console.log('Login')}
        onLogout={() => console.log('Logout')}
        onCartToggle={() => setIsOpen(!isOpen)}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        cartContent={
          <ShoppingCart
            items={mockItems}
            total={2500}
            discount={10}
            finalTotal={2250}
            onUpdateQuantity={(id, qty) => console.log('Update:', id, qty)}
            onRemove={(id) => console.log('Remove:', id)}
            onApplyDiscount={(d) => console.log('Discount:', d)}
            onClearCart={() => console.log('Clear')}
          />
        }
      />
    )
  },
}