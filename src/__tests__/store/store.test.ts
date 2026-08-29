import { describe, it, expect, vi, afterEach } from 'vitest'
import { store } from '../../store'
import { api } from '../../api/apiSlice'
import type { StrapiListResponse, StrapiProduct } from '../../api/strapi'

describe('Redux Store', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    store.dispatch(api.util.resetApiState())
  })

  it('should have all reducers configured', () => {
    const state = store.getState()
    expect(state).toHaveProperty('cart')
    expect(state).toHaveProperty('products')
    expect(state).toHaveProperty('user')
  })

  it('should have initial state for cart', () => {
    const state = store.getState()
    expect(state.cart.items).toEqual([])
    expect(state.cart.discountPercent).toBe(0)
  })

  it('should have initial state for user', () => {
    const state = store.getState()
    expect(state.user.currentUser).toBeNull()
    expect(state.user.loyaltyPoints).toBe(0)
  })

  it('should start with no products — they are fetched via RTK Query', () => {
    const state = store.getState()
    expect(state.products.items).toEqual([])
  })

  it('should have default product filters', () => {
    const state = store.getState()
    expect(state.products.filters.category).toBeNull()
    expect(state.products.filters.searchQuery).toBe('')
  })

  it('should register the RTK Query api reducer', () => {
    const state = store.getState()
    expect(state).toHaveProperty('api')
  })

  it('should populate products when the products query succeeds', async () => {
    const payload: StrapiListResponse<StrapiProduct> = {
      data: [
        {
          id: 1,
          documentId: 'doc1',
          name: 'Vanille Bourbon',
          price: 24.9,
          stock: 10,
          available: true,
          weightGrams: 6,
          description: null,
          sizes: null,
          colors: null,
          image: null,
          imageUrl: null,
          category: null,
          partners: null,
        },
      ],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    await store.dispatch(api.endpoints.getProducts.initiate())
    const state = store.getState()
    expect(state.products.items).toHaveLength(1)
    expect(state.products.items[0].name).toBe('Vanille Bourbon')
    expect(state.products.items[0].price).toBe(24.9)
  })
})
