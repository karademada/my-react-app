import type { CheckoutItemPayload, Color, Product } from '../types'

const BASE_URL = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'

type StrapiMedia = { url: string } | null
type StrapiCategory = { name: string; slug: string } | null
type StrapiProduct = {
  id: number
  documentId: string
  name: string
  price: number | string
  stock: number | null
  description: string | null
  sizes: string[] | null
  colors: Color[] | null
  image: StrapiMedia
  imageUrl: string | null
  category: StrapiCategory
}
type StrapiListResponse<T> = {
  data: T[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}

function absoluteMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BASE_URL}${url}`
}

function mapProduct(p: StrapiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: typeof p.price === 'string' ? Number(p.price) : p.price,
    stock: p.stock ?? undefined,
    description: p.description ?? undefined,
    sizes: p.sizes ?? undefined,
    colors: p.colors ?? undefined,
    image: absoluteMediaUrl(p.image?.url) ?? p.imageUrl ?? undefined,
    category: p.category?.slug ?? undefined,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products?populate=*&pagination[pageSize]=100`)
  if (!res.ok) throw new Error(`Strapi /api/products failed: ${res.status}`)
  const json = (await res.json()) as StrapiListResponse<StrapiProduct>
  return json.data.map(mapProduct)
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const res = await fetch(
    `${BASE_URL}/api/products?populate=*&filters[id][$eq]=${id}`,
  )
  if (!res.ok) throw new Error(`Strapi /api/products/${id} failed: ${res.status}`)
  const json = (await res.json()) as StrapiListResponse<StrapiProduct>
  const first = json.data[0]
  return first ? mapProduct(first) : null
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

interface StrapiErrorBody {
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

export async function authLogin(
  identifier: string,
  password: string,
): Promise<StrapiAuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  })
  if (!res.ok) throw new Error(await parseAuthError(res))
  return (await res.json()) as StrapiAuthResponse
}

export async function authRegister(
  username: string,
  email: string,
  password: string,
): Promise<StrapiAuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  if (!res.ok) throw new Error(await parseAuthError(res))
  return (await res.json()) as StrapiAuthResponse
}

export async function authMe(jwt: string): Promise<StrapiAuthUser> {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  if (!res.ok) throw new Error(await parseAuthError(res))
  return (await res.json()) as StrapiAuthUser
}

export async function createCheckoutSession(
  items: CheckoutItemPayload[],
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/orders/checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error(await parseAuthError(res))
  const json = (await res.json()) as { url: string }
  return json.url
}
