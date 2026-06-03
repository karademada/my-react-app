import type { Product } from '../../types'

const filterByCategory = (products: Product[], category: string | null): Product[] =>
  category ? products.filter((p) => p.category === category) : products

const filterByPriceRange = (
  products: Product[],
  min: number,
  max: number,
): Product[] => products.filter((p) => p.price >= min && p.price <= max)

const searchByName = (products: Product[], query: string): Product[] =>
  products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  )

const sortByPrice = (products: Product[], ascending = true): Product[] =>
  [...products].sort((a, b) =>
    ascending ? a.price - b.price : b.price - a.price,
  )

const isInStock = (product: Product): boolean => (product.stock ?? 0) > 0

const canAddToCart = (product: Product, quantity: number): boolean =>
  isInStock(product) && quantity <= (product.stock ?? 0)

export const productsDomain = {
  filterByCategory,
  filterByPriceRange,
  searchByName,
  sortByPrice,
  isInStock,
  canAddToCart,
}
