export interface Color {
  name: string
  hex: string
}

export interface Product {
  id: number
  name: string
  price: number
  category?: string
  stock?: number
  image?: string
  description?: string
  sizes?: string[]
  colors?: Color[]
  selectedSize?: string | null
  selectedColor?: Color | null
}

export interface CartItem extends Product {
  cartKey?: string
  quantity: number
}

export interface User {
  email: string | null
  token: string | null
  username?: string
  roles?: string[]
}

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface PriceRange {
  min: number
  max: number
}

export interface ProductFilters {
  category: string | null
  priceRange: PriceRange
  searchQuery: string
}

export interface CartState {
  items: CartItem[]
  discountPercent: number
}

export interface ProductsState {
  items: Product[]
  filters: ProductFilters
}

export interface UserState {
  currentUser: User | null
  loyaltyPoints: number
  status: AuthStatus
  error: string | null
}
