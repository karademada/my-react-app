import type { Color, Product } from '../types'

export const BASE_URL = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'

type StrapiMedia = { url: string } | null
type StrapiCategory = { name: string; slug: string } | null
type StrapiPartnerOrigin = {
  id: number
  location?:
    | { latitude?: number | null; longitude?: number | null; town?: string | null; region?: string | null }
    | null
} | null

export type StrapiProduct = {
  id: number
  documentId: string
  name: string
  price: number | string
  stock: number | null
  available: boolean | null
  weightGrams: number | null
  description: string | null
  sizes: string[] | null
  colors: Color[] | null
  image: StrapiMedia
  imageUrl: string | null
  category: StrapiCategory
  partners: StrapiPartnerOrigin[] | null
}
export type StrapiListResponse<T> = {
  data: T[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}

function absoluteMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BASE_URL}${url}`
}

export function mapProduct(p: StrapiProduct): Product {
  // Premiere origine connue (partenaire) avec coordonnees => base du calcul carbone.
  const originPartner =
    p.partners?.find(
      (pa) => pa && pa.location && pa.location.latitude != null && pa.location.longitude != null,
    ) ?? null
  const origin =
    originPartner && originPartner.location
      ? {
          lat: originPartner.location.latitude!,
          lng: originPartner.location.longitude!,
        }
      : undefined

  return {
    id: p.id,
    name: p.name,
    price: typeof p.price === 'string' ? Number(p.price) : p.price,
    stock: p.stock ?? undefined,
    available: p.available ?? true,
    weightGrams: p.weightGrams ?? 0,
    carbonOrigin: origin,
    description: p.description ?? undefined,
    sizes: p.sizes ?? undefined,
    colors: p.colors ?? undefined,
    image: absoluteMediaUrl(p.image?.url) ?? p.imageUrl ?? undefined,
    category: p.category?.slug ?? undefined,
  }
}

export interface StrapiAuthUser {
  id: number
  username: string
  email: string
  confirmed: boolean
  blocked: boolean
}

export interface StrapiAuthResponse {
  jwt: string
  user: StrapiAuthUser
}

export interface StrapiErrorBody {
  error?: { message?: string; details?: { errors?: { message?: string }[] } }
}

async function parseAuthError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as StrapiErrorBody
    const detail = body.error?.details?.errors?.[0]?.message
    return detail ?? body.error?.message ?? `HTTP ${res.status}`
  } catch {
    return `HTTP ${res.status}`
  }
}

export async function authMe(jwt: string): Promise<StrapiAuthUser> {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  if (!res.ok) throw new Error(await parseAuthError(res))
  return (await res.json()) as StrapiAuthUser
}
