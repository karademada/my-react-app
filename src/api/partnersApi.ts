import { api } from './apiSlice'
import type { StrapiListResponse } from './strapi'
import {
  buildPartnersQuery,
  mapCommitment,
  mapPartner,
  type StrapiCommitment,
  type StrapiPartner,
} from './strapiPartners'
import type { Commitment, Partner, PartnerFilters } from '../types/partner'

/**
 * On injecte dans le slice existant plutot que d'en creer un second :
 * un seul reducerPath, un seul middleware, un cache partage.
 */
const partnersApi = api
  .enhanceEndpoints({ addTagTypes: ['Partners', 'Commitments'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getPartners: builder.query<Partner[], Partial<PartnerFilters> | void>({
        query: (filters) => `partners?${buildPartnersQuery(filters ?? {})}`,
        transformResponse: (res: StrapiListResponse<StrapiPartner>) =>
          res.data.map(mapPartner),
        providesTags: ['Partners'],
      }),

      getPartnerBySlug: builder.query<Partner | null, string>({
        query: (slug) => `partners?filters[slug][$eq]=${encodeURIComponent(slug)}`,
        transformResponse: (res: StrapiListResponse<StrapiPartner>) => {
          const first = res.data[0]
          return first ? mapPartner(first) : null
        },
        providesTags: (_result, _error, slug) => [{ type: 'Partners', id: slug }],
      }),

      getCommitments: builder.query<Commitment[], void>({
        query: () => 'commitments?sort[0]=rank:asc&sort[1]=name:asc',
        transformResponse: (res: StrapiListResponse<StrapiCommitment>) =>
          res.data.map(mapCommitment),
        providesTags: ['Commitments'],
      }),

      /** Alimente le bloc « Cultive par » sur la fiche produit. */
      getPartnersByProductId: builder.query<Partner[], number>({
        query: (productId) => `partners?filters[products][id][$eq]=${productId}`,
        transformResponse: (res: StrapiListResponse<StrapiPartner>) =>
          res.data.map(mapPartner),
        providesTags: (_result, _error, id) => [{ type: 'Partners', id: `product-${id}` }],
      }),
    }),
  })

export const {
  useGetPartnersQuery,
  useGetPartnerBySlugQuery,
  useGetCommitmentsQuery,
  useGetPartnersByProductIdQuery,
} = partnersApi

export default partnersApi
