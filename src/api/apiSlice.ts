import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CheckoutItemPayload,
  PartnerProfilePatch,
  PartnerProduct,
  PartnerSpacePayload,
  Product,
} from '../types'
import {
  BASE_URL,
  mapProduct,
  type StrapiAuthResponse,
  type StrapiListResponse,
  type StrapiProduct,
} from './strapi'

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

/** Minimal shape of the root state this slice reads — avoids a circular import on `RootState`. */
type StateWithUser = { user: { currentUser: { token: string | null } | null } }

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`,
    // Pas de spinner infini : tout appel qui ne répond pas en 15 s échoue
    // proprement (l'upload partenaire, plus lourd, a son propre délai).
    timeout: 15000,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithUser).user.currentUser?.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Products', 'Partner'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => 'products?populate=*&pagination[pageSize]=100',
      transformResponse: (res: StrapiListResponse<StrapiProduct>) =>
        res.data.map(mapProduct),
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product | null, number>({
      query: (id) => `products?populate=*&filters[id][$eq]=${id}`,
      transformResponse: (res: StrapiListResponse<StrapiProduct>) => {
        const first = res.data[0]
        return first ? mapProduct(first) : null
      },
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
    login: builder.mutation<StrapiAuthResponse, LoginRequest>({
      query: (body) => ({ url: 'auth/local', method: 'POST', body }),
    }),
    register: builder.mutation<StrapiAuthResponse, RegisterRequest>({
      query: (body) => ({ url: 'auth/local/register', method: 'POST', body }),
    }),
    createCheckoutSession: builder.mutation<{ url: string }, CheckoutItemPayload[]>({
      query: (items) => ({
        url: 'orders/checkout-session',
        method: 'POST',
        body: { items },
      }),
    }),
    // ── Espace partenaire ────────────────────────────────────────────────
    getPartnerMe: builder.query<PartnerSpacePayload, void>({
      query: () => 'partners/me',
      providesTags: ['Partner'],
    }),
    updatePartnerMe: builder.mutation<{ ok: boolean; portrait: string | null }, PartnerProfilePatch>({
      query: (body) => ({
        url: 'partners/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),
    updatePartnerProduct: builder.mutation<
      { ok: boolean; product: PartnerProduct },
      { documentId: string; stock?: number; available?: boolean; image?: number; gallery?: number[] }
    >({
      query: ({ documentId, ...body }) => ({
        url: `partners/me/products/${documentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Partner', 'Products'],
    }),
    uploadPartnerAsset: builder.mutation<{ id: number; url: string; name: string }, FormData>({
      query: (body) => ({
        url: 'partners/me/upload',
        method: 'POST',
        body,
        // Photos : le délai global de 15 s ne suffit pas toujours.
        timeout: 60000,
      }),
    }),
    // ── Mot de passe oublié (Strapi users-permissions) ───────────────────
    forgotPassword: builder.mutation<{ ok: boolean }, { email: string }>({
      query: (body) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<
      { ok: boolean },
      { code: string; password: string; passwordConfirmation: string }
    >({
      query: (body) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useLoginMutation,
  useRegisterMutation,
  useCreateCheckoutSessionMutation,
  useGetPartnerMeQuery,
  useUpdatePartnerMeMutation,
  useUpdatePartnerProductMutation,
  useUploadPartnerAssetMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = api
