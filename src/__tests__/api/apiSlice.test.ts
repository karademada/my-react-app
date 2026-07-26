import { describe, it, expect, afterEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { api } from '../../api/apiSlice'
import cartReducer from '../../features/cart/cartSlice'
import productsReducer from '../../features/products/productsSlice'
import userReducer, { login, logout } from '../../features/user/userSlice'

function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      products: productsReducer,
      user: userReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  })
}

/** Captures the Request handed to fetch so header wiring can be asserted. */
function stubFetch(body: unknown = { data: [], meta: {} }) {
  const calls: Request[] = []
  const spy = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push(new Request(input as RequestInfo, init))
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', spy)
  return calls
}

describe('api base query auth headers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('omits Authorization when no user is signed in', async () => {
    const calls = stubFetch()
    const store = makeStore()

    await store.dispatch(api.endpoints.getProducts.initiate())

    expect(calls).toHaveLength(1)
    expect(calls[0].headers.get('Authorization')).toBeNull()
  })

  it('sends the signed-in user JWT as a bearer token', async () => {
    const calls = stubFetch()
    const store = makeStore()
    store.dispatch(
      login({ email: 'buyer@placekabar.test', token: 'jwt-123', roles: ['customer'] }),
    )

    await store.dispatch(api.endpoints.getProducts.initiate())

    expect(calls[0].headers.get('Authorization')).toBe('Bearer jwt-123')
  })

  it('authenticates the checkout session request', async () => {
    const calls = stubFetch({ url: 'https://checkout.stripe.test/session' })
    const store = makeStore()
    store.dispatch(
      login({ email: 'buyer@placekabar.test', token: 'jwt-456', roles: ['customer'] }),
    )

    await store.dispatch(
      api.endpoints.createCheckoutSession.initiate([{ id: 1, quantity: 2 }]),
    )

    expect(calls[0].headers.get('Authorization')).toBe('Bearer jwt-456')
  })

  it('drops the bearer token after logout', async () => {
    const calls = stubFetch()
    const store = makeStore()
    store.dispatch(
      login({ email: 'buyer@placekabar.test', token: 'jwt-789', roles: ['customer'] }),
    )
    store.dispatch(logout())

    await store.dispatch(api.endpoints.getProducts.initiate())

    expect(calls[0].headers.get('Authorization')).toBeNull()
  })
})
