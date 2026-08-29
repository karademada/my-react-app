import { describe, it, expect } from 'vitest'
import {
  clampStock,
  parseStockInput,
  nextStock,
  validateProfile,
  buildProfilePayload,
  canSaveProduct,
  sortPartnerProducts,
  absoluteMediaUrl,
  productPhoto,
  availabilityLabel,
} from '../../../features/partner/partnerSpaceDomain'
import type { PartnerProduct, PartnerProfile } from '../../../types'

describe('partnerSpaceDomain — stock', () => {
  it('borne le stock entre 0 et MAX_STOCK', () => {
    expect(clampStock(-5)).toBe(0)
    expect(clampStock(42.9)).toBe(42)
    expect(clampStock(2_000_000)).toBe(1_000_000)
  })

  it('parse la saisie libre : vide → null, entier → valeur, invalide → null', () => {
    expect(parseStockInput('')).toBeNull()
    expect(parseStockInput('  17 ')).toBe(17)
    expect(parseStockInput('12abc')).toBeNull()
    expect(parseStockInput('-3')).toBeNull()
    expect(parseStockInput('3.7')).toBeNull()
  })

  it('nextStock décrémente sans passer sous zéro', () => {
    expect(nextStock(10, -3)).toBe(7)
    expect(nextStock(1, -1)).toBe(0)
    expect(nextStock(0, -1)).toBe(0)
    expect(nextStock(0, 5)).toBe(5)
  })

  it('canSaveProduct exige un stock entier valide', () => {
    expect(canSaveProduct('12', true)).toBe(true)
    expect(canSaveProduct('', false)).toBe(false)
    expect(canSaveProduct('abc', true)).toBe(false)
  })
})

describe('partnerSpaceDomain — profil', () => {
  const original: PartnerProfile = {
    id: 1,
    documentId: 'doc-1',
    name: 'Coopérative Soa Vanilla',
    slug: 'cooperative-soa-vanilla',
    kind: 'cooperative',
    specialty: 'Vanille Bourbon',
    tagline: null,
    portrait: null,
    gallery: [],
    location: null,
    keyFigures: [],
    commitments: [],
    website: null,
    email: null,
    phone: null,
    partnerSince: null,
  }

  it('valide le brouillon : champs vides → pas d‘erreur hors spécialité', () => {
    const errors = validateProfile({
      tagline: '',
      specialty: 'Vanille Bourbon',
      website: '',
      email: '',
      phone: '',
      partnerSince: '',
    })
    expect(errors).toEqual({})
  })

  it('rejette une URL sans protocole et un e-mail invalide', () => {
    const errors = validateProfile({
      tagline: 'x'.repeat(201),
      specialty: 'ok',
      website: 'soavanilla.mg',
      email: 'pas-un-email',
      phone: '',
      partnerSince: '1850',
    })
    expect(Object.keys(errors)).toEqual(['tagline', 'website', 'email', 'partnerSince'])
  })

  it('ne construit le payload qu‘avec les champs réellement modifiés', () => {
    const draft = {
      tagline: 'Nouvelle signature',
      specialty: 'Vanille Bourbon',
      website: 'https://soavanilla.mg',
      email: '',
      phone: '+261 32 00',
      partnerSince: '2018',
    }
    const payload = buildProfilePayload(original, draft)
    expect(payload).toEqual({
      tagline: 'Nouvelle signature',
      website: 'https://soavanilla.mg',
      phone: '+261 32 00',
      partnerSince: 2018,
    })
    expect(payload.specialty).toBeUndefined()
    expect(payload.email).toBeUndefined()
  })
})

describe('partnerSpaceDomain — produits', () => {
  const makeProduct = (over: Partial<PartnerProduct>): PartnerProduct => ({
    id: 1,
    documentId: 'd1',
    name: 'Vanille',
    slug: 'vanille',
    price: 10,
    stock: 5,
    available: true,
    publishedAt: '2026-01-01',
    updatedAt: '2026-01-01',
    imageUrl: null,
    image: null,
    gallery: [],
    ...over,
  })

  it('trie : publiés d‘abord, puis alphabétique', () => {
    const sorted = sortPartnerProducts([
      makeProduct({ name: 'Braises', publishedAt: null }),
      makeProduct({ name: 'Ambre', documentId: 'd2' }),
      makeProduct({ name: 'Cèdre', publishedAt: null, documentId: 'd3' }),
    ])
    expect(sorted.map((p: PartnerProduct) => p.name)).toEqual(['Ambre', 'Braises', 'Cèdre'])
  })

  it('absolutise les URLs média relatives', () => {
    expect(absoluteMediaUrl('/uploads/a.png', 'http://localhost:1337/')).toBe(
      'http://localhost:1337/uploads/a.png',
    )
    expect(absoluteMediaUrl('https://cdn.exemple/a.png', 'http://localhost:1337')).toBe(
      'https://cdn.exemple/a.png',
    )
    expect(absoluteMediaUrl(null, 'http://localhost:1337')).toBeNull()
  })

  it('productPhoto préfère le média uploadé à l‘URL brute', () => {
    expect(productPhoto(makeProduct({ image: '/uploads/v.png' }), 'http://s')).toBe(
      'http://s/uploads/v.png',
    )
    expect(
      productPhoto(makeProduct({ image: null, imageUrl: 'https://cdn/v.png' }), 'http://s'),
    ).toBe('https://cdn/v.png')
    expect(productPhoto(makeProduct({}), 'http://s')).toBeNull()
  })

  it('availabilityLabel reflète le état marchand', () => {
    expect(availabilityLabel({ stock: 12, available: true })).toBe('12 en stock')
    expect(availabilityLabel({ stock: 12, available: false })).toBe(
      'Momentanément indisponible',
    )
    expect(availabilityLabel({ stock: 0, available: true })).toBe('Épuisé')
  })
})