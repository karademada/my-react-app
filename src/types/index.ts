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
  available?: boolean
  image?: string
  description?: string
  sizes?: string[]
  colors?: Color[]
  selectedSize?: string | null
  selectedColor?: Color | null
  /** Poids net unitaire (g) — base du calcul d'empreinte carbone. */
  weightGrams?: number
  /** Coordonnées du lieu de production (partenaire), si connues. */
  carbonOrigin?: { lat: number; lng: number }
}

export interface PartnerLocation {
  id?: number
  region?: string | null
  town?: string | null
  country?: string | null
  altitude?: number | null
}

export interface PartnerKeyFigure {
  id?: number
  value: string
  label: string
}

export interface PartnerProfile {
  id: number | null
  documentId: string
  name: string
  slug: string
  kind: string
  specialty: string
  tagline: string | null
  portrait: string | null
  gallery: string[]
  location: PartnerLocation | null
  keyFigures: PartnerKeyFigure[]
  commitments: { id: number | null; title: string }[]
  website: string | null
  email: string | null
  phone: string | null
  partnerSince: number | null
}

export interface PartnerProduct {
  id: number | null
  documentId: string
  name: string
  slug: string
  price: number | string
  stock: number
  available: boolean
  publishedAt: string | null
  updatedAt: string
  imageUrl: string | null
  image: string | null
  gallery: string[]
}

export interface PartnerSpacePayload {
  partner: PartnerProfile
  products: PartnerProduct[]
}

/** Payload PATCH du profil : le portrait/gallery partent en ids de fichiers. */
export interface PartnerProfilePatch {
  tagline?: string
  specialty?: string
  website?: string
  email?: string
  phone?: string
  partnerSince?: number
  portrait?: number
  gallery?: number[]
  location?: PartnerLocation | null
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

export interface CheckoutItemPayload {
  id: number
  quantity: number
  size?: string | null
  color?: string | null
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
