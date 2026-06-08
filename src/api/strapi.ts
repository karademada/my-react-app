import type { Color, Product } from '../types'

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
