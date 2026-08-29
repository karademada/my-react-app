import { describe, it, expect } from 'vitest'
import {
  computeCarbonFootprint,
  formatCarbon,
  haversineKm,
  roadKm,
  PORT_TOAMASINA,
  CITY_PARIS,
} from '../../../features/products/carbonDomain'

describe('carbonDomain', () => {
  describe('haversineKm', () => {
    it('returns 0 for identical points', () => {
      expect(haversineKm(PORT_TOAMASINA, PORT_TOAMASINA)).toBe(0)
    })

    it('computes a plausible France–Madagascar distance', () => {
      const km = haversineKm(PORT_TOAMASINA, CITY_PARIS)
      // ~8200 km orthodromique réelle.
      expect(km).toBeGreaterThan(7000)
      expect(km).toBeLessThan(9500)
    })

    it('is symmetric', () => {
      const a = haversineKm(PORT_TOAMASINA, CITY_PARIS)
      const b = haversineKm(CITY_PARIS, PORT_TOAMASINA)
      expect(a).toBeCloseTo(b, 6)
    })
  })

  describe('roadKm', () => {
    it('applies the detour factor on top of the geodesic', () => {
      const base = haversineKm(PORT_TOAMASINA, CITY_PARIS)
      expect(roadKm(PORT_TOAMASINA, CITY_PARIS)).toBeCloseTo(base * 1.35, 6)
    })
  })

  describe('computeCarbonFootprint', () => {
    it('returns zero total for a zero-weight product', () => {
      const fp = computeCarbonFootprint({ weightGrams: 0 })
      expect(fp.totalGrams).toBe(0)
      expect(fp.totalKm).toBeGreaterThan(0)
    })

    it('allocates all transport emissions to the sea leg (longest, cheapest per km)', () => {
      const fp = computeCarbonFootprint({ weightGrams: 1000 })
      expect(fp.breakdown.transportSea).toBeGreaterThan(fp.breakdown.transportLocal)
      expect(fp.breakdown.transportSea).toBeGreaterThan(fp.breakdown.delivery)
    })

    it('uses the port as fallback origin when none is provided', () => {
      const withOrigin = computeCarbonFootprint({
        weightGrams: 100,
        origin: PORT_TOAMASINA,
      })
      const without = computeCarbonFootprint({ weightGrams: 100 })
      // Sans origine on retombe sur Toamasina => transportLocal = 0.
      expect(without.breakdown.transportLocal).toBe(0)
      expect(withOrigin.breakdown.transportLocal).toBe(0)
      expect(without.totalGrams).toBeCloseTo(withOrigin.totalGrams, 6)
    })

    it('clamps negative weight to zero', () => {
      const fp = computeCarbonFootprint({ weightGrams: -50 })
      expect(fp.totalGrams).toBe(0)
    })

    it('scales linearly with weight', () => {
      const a = computeCarbonFootprint({ weightGrams: 100 })
      const b = computeCarbonFootprint({ weightGrams: 200 })
      // Toutes les branches sont linéaires en masse => doublement exact.
      expect(b.totalGrams).toBeCloseTo(a.totalGrams * 2, 6)
    })
  })

  describe('formatCarbon', () => {
    it('formats sub-kilogram values in grams', () => {
      expect(formatCarbon(340)).toBe('340 g')
    })
    it('formats kilogram values with 1 decimal', () => {
      expect(formatCarbon(1400)).toBe('1,4 kg')
    })
  })
})
