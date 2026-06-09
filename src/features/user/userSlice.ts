import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { userDomain } from './userDomain'
import { authLogin, authMe, authRegister } from '../../api/strapi'
import type { StrapiAuthResponse, StrapiAuthUser } from '../../api/strapi'
import type { User, UserState } from '../../types'

const STORAGE_KEY = 'pk_auth_jwt'

interface LoginPayload {
  email: string
  token: string
  roles: string[]
}

interface LoginThunkArg {
  identifier: string
  password: string
}

interface RegisterThunkArg {
  username: string
  email: string
  password: string
}

function persistJwt(jwt: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (jwt) window.localStorage.setItem(STORAGE_KEY, jwt)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage disabled — silently ignore
  }
}

function readJwt(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function toUser(res: StrapiAuthResponse): User {
  return {
    email: res.user.email,
    token: res.jwt,
    username: res.user.username,
    roles: ['customer'],
  }
}

function fromMe(jwt: string, me: StrapiAuthUser): User {
  return {
    email: me.email,
    token: jwt,
    username: me.username,
    roles: ['customer'],
  }
}

export const loginUser = createAsyncThunk<User, LoginThunkArg, { rejectValue: string }>(
  'user/login',
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const res = await authLogin(identifier, password)
      persistJwt(res.jwt)
      return toUser(res)
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Login failed')
    }
  },
)

export const registerUser = createAsyncThunk<User, RegisterThunkArg, { rejectValue: string }>(
  'user/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await authRegister(username, email, password)
      persistJwt(res.jwt)
      return toUser(res)
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Register failed')
    }
  },
)

export const restoreSession = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'user/restore',
  async (_, { rejectWithValue }) => {
    const jwt = readJwt()
    if (!jwt) return null
    try {
      const me = await authMe(jwt)
      return fromMe(jwt, me)
    } catch (e) {
      persistJwt(null)
      return rejectWithValue(e instanceof Error ? e.message : 'Session expired')
    }
  },
)

const initialState: UserState = {
  currentUser: null,
  loyaltyPoints: 0,
  status: 'idle',
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { email, token, roles } = action.payload
      if (userDomain.validateEmail(email)) {
        state.currentUser = { email, token, roles }
      }
    },
    logout: (state) => {
      state.currentUser = null
      state.status = 'idle'
      state.error = null
      persistJwt(null)
    },
    clearAuthError: (state) => {
      state.error = null
      if (state.status === 'failed') state.status = 'idle'
    },
    addLoyaltyPoints: (state, action: PayloadAction<number>) => {
      state.loyaltyPoints += userDomain.calculateLoyaltyPoints(action.payload)
    },
    redeemLoyaltyPoints: (state, action: PayloadAction<number>) => {
      const points = action.payload
      if (state.loyaltyPoints >= points) {
        state.loyaltyPoints -= points
      }
    },
  },
  extraReducers: (builder) => {
    const pending = (state: UserState) => {
      state.status = 'loading'
      state.error = null
    }
    const fulfilled = (state: UserState, action: PayloadAction<User | null>) => {
      state.status = 'succeeded'
      state.error = null
      state.currentUser = action.payload
    }
    const rejected = (
      state: UserState,
      action: { payload?: string; error: { message?: string } },
    ) => {
      state.status = 'failed'
      state.error = action.payload ?? action.error.message ?? 'Authentication failed'
      state.currentUser = null
    }

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected)
      .addCase(restoreSession.pending, pending)
      .addCase(restoreSession.fulfilled, fulfilled)
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'idle'
        state.error = null
        state.currentUser = null
      })
  },
})

export const {
  login,
  logout,
  clearAuthError,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
} = userSlice.actions
export default userSlice.reducer
