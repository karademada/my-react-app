import { describe, it, expect } from 'vitest'
import { partnersDomain } from '../../../features/partners/partnersDomain'
import type { Commitment, Partner } from '../../../types/partner'

const bio: Commitment = { id: 1, name: 'Bio', slug: 'bio', category: 'bio', rank: 0 }
const fair: Commitment = {
  id: 2,
  name: 'Équitable',
  slug: 'equitable',
  category: 'fair-trade',
  rank: 1,
}

const base = {
  documentId: 'doc',
  specialty: 'Vanille',
  commitments: [],
  products: [],
  featured: false,
  rank: 0,
} satisfies Partial<Partner>

describe('Partners Domain Logic', () => {
  const mockPartners: Partner[] = [
    {
      ...base,
      id: 1,
      name: 'Coopérative Sambava',
      slug: 'cooperative-sambava',
      kind: 'cooperative',
      commitments: [bio, fair],
      products: [{ id: 10, name: 'Vanille', price: 24 }],
      location: { region: 'Sava', town: 'Sambava', country: 'Madagascar' },
      partnerSince: 2019,
      featured: true,
    },
    {
      ...base,
      id: 2,
      name: 'Ferme Antalaha',
      slug: 'ferme-antalaha',
      kind: 'farmer',
      commitments: [bio],
      location: { region: 'Sava', country: 'Madagascar' },
      rank: 2,
    },
    {
      ...base,
      id: 3,
      name: 'Atelier Toamasina',
      slug: 'atelier-toamasina',
      kind: 'processor',
      location: { region: 'Atsinanana', country: 'Madagascar' },
      rank: 1,
    },
  ]

  describe('filterByKind', () => {
    it('should filter partners by kind', () => {
      expect(partnersDomain.filterByKind(mockPartners, 'farmer')).toHaveLength(1)
    })

    it('should return all partners if no kind', () => {
      expect(partnersDomain.filterByKind(mockPartners, null)).toHaveLength(3)
    })
  })

  describe('filterByCommitments', () => {
    it('should keep partners holding at least one of the slugs', () => {
      expect(partnersDomain.filterByCommitments(mockPartners, ['bio'])).toHaveLength(2)
    })

    it('should union multiple slugs rather than intersect them', () => {
      const result = partnersDomain.filterByCommitments(mockPartners, ['bio', 'equitable'])
      expect(result).toHaveLength(2)
    })

    it('should return all partners when no slug is selected', () => {
      expect(partnersDomain.filterByCommitments(mockPartners, [])).toHaveLength(3)
    })
  })

  describe('applyFilters', () => {
    it('should combine kind and commitments', () => {
      const result = partnersDomain.applyFilters(mockPartners, {
        kind: 'cooperative',
        commitmentSlugs: ['equitable'],
      })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Coopérative Sambava')
    })

    it('should return an empty list when nothing matches', () => {
      const result = partnersDomain.applyFilters(mockPartners, {
        kind: 'processor',
        commitmentSlugs: ['bio'],
      })
      expect(result).toHaveLength(0)
    })
  })

  describe('hasCommitment', () => {
    it('should detect a commitment by slug', () => {
      expect(partnersDomain.hasCommitment(mockPartners[0], 'bio')).toBe(true)
      expect(partnersDomain.hasCommitment(mockPartners[2], 'bio')).toBe(false)
    })
  })

  describe('listRegions', () => {
    it('should return unique sorted regions', () => {
      expect(partnersDomain.listRegions(mockPartners)).toEqual(['Atsinanana', 'Sava'])
    })
  })

  describe('formatLocation', () => {
    it('should join town and region', () => {
      expect(partnersDomain.formatLocation(mockPartners[0])).toBe('Sambava, Sava')
    })

    it('should fall back to region alone', () => {
      expect(partnersDomain.formatLocation(mockPartners[1])).toBe('Sava')
    })
  })

  describe('countProducts', () => {
    it('should count linked products', () => {
      expect(partnersDomain.countProducts(mockPartners[0])).toBe(1)
      expect(partnersDomain.countProducts(mockPartners[1])).toBe(0)
    })
  })

  describe('yearsOfPartnership', () => {
    it('should compute elapsed years', () => {
      expect(partnersDomain.yearsOfPartnership(mockPartners[0], 2026)).toBe(7)
    })

    it('should return null without a start year', () => {
      expect(partnersDomain.yearsOfPartnership(mockPartners[1], 2026)).toBeNull()
    })
  })

  describe('sortPartners', () => {
    it('should put featured first, then rank, then name', () => {
      const result = partnersDomain.sortPartners(mockPartners)
      expect(result.map((p) => p.id)).toEqual([1, 3, 2])
    })

    it('should not mutate the input array', () => {
      const input = [...mockPartners]
      partnersDomain.sortPartners(input)
      expect(input.map((p) => p.id)).toEqual([1, 2, 3])
    })
  })
})
