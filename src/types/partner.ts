export type PartnerKind =
  | 'farmer'
  | 'producer'
  | 'collector'
  | 'cooperative'
  | 'processor'
  | 'artisan'

export type CommitmentCategory =
  | 'bio'
  | 'fair-trade'
  | 'social'
  | 'ecological'
  | 'responsible'

/** Le back stocke des cles, le front decide des mots affiches. */
export const PARTNER_KIND_LABELS: Record<PartnerKind, string> = {
  farmer: 'Fermier',
  producer: 'Producteur',
  collector: 'Collecteur',
  cooperative: 'Coopérative',
  processor: 'Transformateur',
  artisan: 'Artisan',
}

export const COMMITMENT_CATEGORY_LABELS: Record<CommitmentCategory, string> = {
  bio: 'Bio',
  'fair-trade': 'Équitable',
  social: 'Social',
  ecological: 'Écologique',
  responsible: 'Responsable',
}

export interface Commitment {
  id: number
  name: string
  slug: string
  category: CommitmentCategory
  description?: string
  certifier?: string
  rank: number
}

export interface PartnerLocation {
  region: string
  town?: string
  country: string
  altitude?: number
  latitude?: number
  longitude?: number
}

export interface KeyFigure {
  id: number
  value: string
  label: string
}

/** Produit vu depuis une fiche partenaire : assez pour lier, pas plus. */
export interface PartnerProduct {
  id: number
  name: string
  price: number
  image?: string
}

/** Sous-ensemble du format blocks de Strapi 5, suffisant pour un recit editorial. */
export interface StoryChild {
  type: 'text' | 'link'
  text?: string
  url?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  children?: StoryChild[]
}

export interface StoryBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'list' | 'list-item'
  level?: number
  format?: 'ordered' | 'unordered'
  children: StoryChild[]
}

export interface Partner {
  id: number
  documentId: string
  name: string
  slug: string
  kind: PartnerKind
  specialty: string
  tagline?: string
  story?: StoryBlock[]
  portrait?: string
  gallery?: string[]
  location?: PartnerLocation
  keyFigures?: KeyFigure[]
  commitments: Commitment[]
  products: PartnerProduct[]
  partnerSince?: number
  website?: string
  featured: boolean
  rank: number
}

export interface PartnerFilters {
  kind: PartnerKind | null
  commitmentSlugs: string[]
}

export const EMPTY_PARTNER_FILTERS: PartnerFilters = {
  kind: null,
  commitmentSlugs: [],
}
