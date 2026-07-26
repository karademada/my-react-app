import { BASE_URL } from './strapi'
import type {
  Commitment,
  CommitmentCategory,
  KeyFigure,
  Partner,
  PartnerFilters,
  PartnerKind,
  PartnerLocation,
  PartnerProduct,
  StoryBlock,
} from '../types/partner'

type StrapiMedia = { url: string } | null

export interface StrapiCommitment {
  id: number
  documentId: string
  name: string
  slug: string
  category: CommitmentCategory
  description: string | null
  certifier: string | null
  rank: number | null
}

export interface StrapiPartnerProduct {
  id: number
  documentId: string
  name: string
  price: number | string
  image: StrapiMedia
}

export interface StrapiPartner {
  id: number
  documentId: string
  name: string
  slug: string
  kind: PartnerKind
  specialty: string
  tagline: string | null
  story: StoryBlock[] | null
  portrait: StrapiMedia
  gallery: { url: string }[] | null
  location: PartnerLocation | null
  keyFigures: KeyFigure[] | null
  commitments: StrapiCommitment[] | null
  products: StrapiPartnerProduct[] | null
  partnerSince: number | null
  website: string | null
  featured: boolean | null
  rank: number | null
}

function absoluteMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BASE_URL}${url}`
}

export function mapCommitment(c: StrapiCommitment): Commitment {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    category: c.category,
    description: c.description ?? undefined,
    certifier: c.certifier ?? undefined,
    rank: c.rank ?? 0,
  }
}

function mapPartnerProduct(p: StrapiPartnerProduct): PartnerProduct {
  return {
    id: p.id,
    name: p.name,
    price: typeof p.price === 'string' ? Number(p.price) : p.price,
    image: absoluteMediaUrl(p.image?.url),
  }
}

export function mapPartner(p: StrapiPartner): Partner {
  return {
    id: p.id,
    documentId: p.documentId,
    name: p.name,
    slug: p.slug,
    kind: p.kind,
    specialty: p.specialty,
    tagline: p.tagline ?? undefined,
    story: p.story ?? undefined,
    portrait: absoluteMediaUrl(p.portrait?.url),
    gallery: p.gallery?.map((g) => absoluteMediaUrl(g.url)).filter((u): u is string => !!u),
    location: p.location ?? undefined,
    keyFigures: p.keyFigures ?? undefined,
    commitments: (p.commitments ?? []).map(mapCommitment),
    products: (p.products ?? []).map(mapPartnerProduct),
    partnerSince: p.partnerSince ?? undefined,
    website: p.website ?? undefined,
    featured: p.featured ?? false,
    rank: p.rank ?? 0,
  }
}

/**
 * Le populate est gere cote Strapi par le middleware `default-populate`,
 * donc on n'envoie ici que le filtrage et le tri.
 */
export function buildPartnersQuery(filters: Partial<PartnerFilters>): string {
  const params = new URLSearchParams()

  if (filters.kind) {
    params.set('filters[kind][$eq]', filters.kind)
  }
  filters.commitmentSlugs?.forEach((slug, i) => {
    params.set(`filters[commitments][slug][$in][${i}]`, slug)
  })

  params.set('sort[0]', 'featured:desc')
  params.set('sort[1]', 'rank:asc')
  params.set('sort[2]', 'name:asc')
  params.set('pagination[pageSize]', '100')

  return params.toString()
}
