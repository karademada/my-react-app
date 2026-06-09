import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

class MemoryStorage {
  private store = new Map<string, string>()
  getItem(k: string) { return this.store.get(k) ?? null }
  setItem(k: string, v: string) { this.store.set(k, String(v)) }
  removeItem(k: string) { this.store.delete(k) }
  clear() { this.store.clear() }
  key(i: number) { return Array.from(this.store.keys())[i] ?? null }
  get length() { return this.store.size }
}

if (typeof globalThis.window === 'undefined') {
  ;(globalThis as { window?: unknown }).window = { localStorage: new MemoryStorage() }
}

import userReducer, {
  login,
  logout,
  clearAuthError,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  loginUser,
  registerUser,
  restoreSession,
} from '../../../features/user/userSlice'
import type { UserState } from '../../../types'

const initialState: UserState = {
  currentUser: null,
  loyaltyPoints: 0,
  status: 'idle',
  error: null,
}

const STORAGE_KEY = 'pk_auth_jwt'

function makeStore() {
  return configureStore({ reducer: { user: userReducer } })
}

describe('User Slice — sync reducers', () => {
  describe('login', () => {
    it('should login user with valid email', () => {
      const state = userReducer(
        initialState,
        login({
          email: 'user@example.com',
          token: 'abc123',
          roles: ['customer'],
        }),
      )
      expect(state.currentUser).toEqual({
        email: 'user@example.com',
        token: 'abc123',
        roles: ['customer'],
      })
    })

    it('should not login with invalid email', () => {
      const state = userReducer(
        initialState,
        login({
          email: 'invalid',
          token: 'abc123',
          roles: ['customer'],
        }),
      )
      expect(state.currentUser).toBeNull()
    })
  })

  describe('logout', () => {
    it('clears user and resets status', () => {
      const loggedIn: UserState = {
        currentUser: { email: 'user@example.com', token: 'abc123' },
        loyaltyPoints: 100,
        status: 'succeeded',
        error: null,
      }
      const state = userReducer(loggedIn, logout())
      expect(state.currentUser).toBeNull()
      expect(state.status).toBe('idle')
      expect(state.error).toBeNull()
    })
  })

  describe('clearAuthError', () => {
    it('resets error and moves failed → idle', () => {
      const failed: UserState = {
        ...initialState,
        status: 'failed',
        error: 'Bad credentials',
      }
      const state = userReducer(failed, clearAuthError())
      expect(state.error).toBeNull()
      expect(state.status).toBe('idle')
    })

    it('keeps non-failed status', () => {
      const succeeded: UserState = { ...initialState, status: 'succeeded' }
      const state = userReducer(succeeded, clearAuthError())
      expect(state.status).toBe('succeeded')
    })
  })

  describe('loyalty', () => {
    it('addLoyaltyPoints accumulates', () => {
      let state = userReducer(initialState, addLoyaltyPoints(100))
      state = userReducer(state, addLoyaltyPoints(50))
      expect(state.loyaltyPoints).toBe(15)
    })

    it('redeemLoyaltyPoints rejects if insufficient', () => {
      const state: UserState = { ...initialState, loyaltyPoints: 10 }
      const next = userReducer(state, redeemLoyaltyPoints(50))
      expect(next.loyaltyPoints).toBe(10)
    })
  })
})

describe('User Slice — async thunks', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    if (typeof window !== 'undefined') window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loginUser.fulfilled stores user, succeeded status, persists jwt', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        jwt: 'jwt-token-xyz',
        user: {
          id: 1,
          username: 'alice',
          email: 'alice@example.com',
          confirmed: true,
          blocked: false,
        },
      }),
    })

    const store = makeStore()
    await store.dispatch(
      loginUser({ identifier: 'alice@example.com', password: 'password123' }),
    )

    const state = store.getState().user
    expect(state.status).toBe('succeeded')
    expect(state.currentUser?.email).toBe('alice@example.com')
    expect(state.currentUser?.token).toBe('jwt-token-xyz')
    expect(state.currentUser?.username).toBe('alice')
    expect(state.error).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('jwt-token-xyz')
  })

  it('loginUser.rejected sets failed status with Strapi error message', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: { message: 'Invalid identifier or password' },
      }),
    })

    const store = makeStore()
    await store.dispatch(
      loginUser({ identifier: 'alice@example.com', password: 'wrong' }),
    )

    const state = store.getState().user
    expect(state.status).toBe('failed')
    expect(state.currentUser).toBeNull()
    expect(state.error).toBe('Invalid identifier or password')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('registerUser.fulfilled stores user and jwt', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        jwt: 'new-jwt',
        user: {
          id: 2,
          username: 'bob',
          email: 'bob@example.com',
          confirmed: false,
          blocked: false,
        },
      }),
    })

    const store = makeStore()
    await store.dispatch(
      registerUser({
        username: 'bob',
        email: 'bob@example.com',
        password: 'password123',
      }),
    )

    const state = store.getState().user
    expect(state.status).toBe('succeeded')
    expect(state.currentUser?.email).toBe('bob@example.com')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('new-jwt')
  })

  it('restoreSession returns null when no jwt stored', async () => {
    const store = makeStore()
    await store.dispatch(restoreSession())
    const state = store.getState().user
    expect(state.currentUser).toBeNull()
    expect(state.status).toBe('succeeded')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('restoreSession with valid jwt re-hydrates user via /users/me', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'existing-jwt')
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 3,
        username: 'carol',
        email: 'carol@example.com',
        confirmed: true,
        blocked: false,
      }),
    })

    const store = makeStore()
    await store.dispatch(restoreSession())

    const state = store.getState().user
    expect(state.currentUser?.email).toBe('carol@example.com')
    expect(state.currentUser?.token).toBe('existing-jwt')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/me'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer existing-jwt' }),
      }),
    )
  })

  it('restoreSession with bad jwt clears storage and stays idle', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'stale-jwt')
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Unauthorized' } }),
    })

    const store = makeStore()
    await store.dispatch(restoreSession())

    const state = store.getState().user
    expect(state.currentUser).toBeNull()
    expect(state.status).toBe('idle')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
