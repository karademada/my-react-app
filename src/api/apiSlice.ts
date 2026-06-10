import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CheckoutItemPayload, Product } from '../types'
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

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/` }),
  tagTypes: ['Products'],
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
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useLoginMutation,
  useRegisterMutation,
  useCreateCheckoutSessionMutation,
} = api
