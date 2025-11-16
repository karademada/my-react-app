// Products domain logic
export const productsDomain = {
  filterByCategory: (products, category) =>
    category ? products.filter(p => p.category === category) : products,

  filterByPriceRange: (products, min, max) =>
    products.filter(p => p.price >= min && p.price <= max),

  searchByName: (products, query) =>
    products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())),

  sortByPrice: (products, ascending = true) =>
    [...products].sort((a, b) => ascending ? a.price - b.price : b.price - a.price),

  isInStock: (product) => product.stock > 0,

  canAddToCart: (product, quantity) =>
    productsDomain.isInStock(product) && quantity <= product.stock,
}