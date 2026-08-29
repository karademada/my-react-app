/**
 * carbonDomain — calcul d'empreinte carbone d'un produit (fonctions pures).
 *
 * Approche ACV-simplifiée et transparente, calibree sur les ordres de
 * grandeur usuels (gCO2e) :
 *
 *   total = production + transport_local + transport_maritime
 *           + livraison_finale + emballage
 *
 * Les etapes de transport sont calculees a partir du lieu de production
 * (coordonnees du partenaire) jusqu'au client (Paris) :
 *
 *   1. Route partenaire -> port d'embarquement de Toamasina (detour routier).
 *   2. Mer  Toamasina -> Le Havre (distance geographique maritime).
 *   3. Route Le Havre -> Paris (dernier kilometre).
 *
 * Facteurs d'emission (gCO2e par kg transporte et par km) :
 *   - route  : ~62 g/t.km  -> 0.062 g/kg.km (camion moyen europeen)
 *   - mer    : ~15 g/t.km  -> 0.015 g/kg.km (fret maritime lourd)
 * Production et emballage sont exprimables en gCO2e/kg.
 */

export interface GeoPoint {
  lat: number
  lng: number
}

export interface CarbonFootprint {
  /** Total en gCO2e (equivalent CO2) pour une unite du produit. */
  totalGrams: number
  /** Ventilation par poste, en gCO2e. */
  breakdown: {
    production: number
    transportLocal: number
    transportSea: number
    delivery: number
    packaging: number
  }
  /** Distance totale parcourue (km). */
  totalKm: number
}

export const PORT_TOAMASINA: GeoPoint = { lat: -18.1667, lng: 49.3833 }
export const PORT_LE_HAVRE: GeoPoint = { lat: 49.49, lng: 0.1078 }
export const CITY_PARIS: GeoPoint = { lat: 48.8566, lng: 2.3522 }

/** gCO2e / (kg · km) */
export const FACTOR_ROAD_G_PER_KG_KM = 0.062
export const FACTOR_SEA_G_PER_KG_KM = 0.015

/** gCO2e / kg */
export const EMISSION_PRODUCTION_G_PER_KG = 600
export const EMISSION_PACKAGING_G_PER_KG = 120

/** Detour routier typique vs distance orthodromique (etat des pistes). */
export const ROAD_DETOUR_FACTOR = 1.35

const R_EARTH_KM = 6371

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Distance orthodromique (haversine) entre deux points, en km. */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const la1 = toRad(a.lat)
  const la2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R_EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Distance routiere (detour inclus) entre deux points, en km. */
export function roadKm(a: GeoPoint, b: GeoPoint): number {
  return haversineKm(a, b) * ROAD_DETOUR_FACTOR
}

/** Distance maritime Toamasina -> Le Havre (~12 500 km reels). */
export function seaKm(): number {
  return haversineKm(PORT_TOAMASINA, PORT_LE_HAVRE) * 1.28
}

export interface CarbonInput {
  /** Poids net unitaire en grammes. */
  weightGrams: number
  /** Coordonnees du lieu de production (partenaire). Peut etre absent. */
  origin?: GeoPoint | null
}

/**
 * Calcule l'empreinte carbone d'une unite du produit.
 * Si l'origine manque, on retombe sur un itineraire par defaut depuis
 * le port de Toamasina (production cote Madagascar, sans coordonnees).
 */
export function computeCarbonFootprint(input: CarbonInput): CarbonFootprint {
  const weightKg = Math.max(0, input.weightGrams) / 1000
  const origin: GeoPoint = input.origin ?? PORT_TOAMASINA

  // 1) Route partenaire -> Toamasina.
  const localKm = roadKm(origin, PORT_TOAMASINA)
  // 2) Mer Toamasina -> Le Havre.
  const sea = seaKm()
  // 3) Route Le Havre -> Paris.
  const deliveryKm = roadKm(PORT_LE_HAVRE, CITY_PARIS)

  const transportLocal = weightKg * localKm * FACTOR_ROAD_G_PER_KG_KM
  const transportSea = weightKg * sea * FACTOR_SEA_G_PER_KG_KM
  const delivery = weightKg * deliveryKm * FACTOR_ROAD_G_PER_KG_KM
  const production = weightKg * EMISSION_PRODUCTION_G_PER_KG
  const packaging = weightKg * EMISSION_PACKAGING_G_PER_KG

  const totalGrams =
    production + transportLocal + transportSea + delivery + packaging

  return {
    totalGrams,
    breakdown: {
      production,
      transportLocal,
      transportSea,
      delivery,
      packaging,
    },
    totalKm: Math.round(localKm + sea + deliveryKm),
  }
}

/** Formate en g ou kg CO2e (ex. "85 g", "1,4 kg") pour l'affichage. */
export function formatCarbon(grams: number): string {
  if (grams < 1000) return `${Math.round(grams)} g`
  return `${(grams / 1000).toFixed(1).replace('.', ',')} kg`
}

/** Arrondi d'affichage (gCO2e a la dizaine). */
export function roundCarbonGrams(grams: number): number {
  return Math.round(grams / 10) * 10
}
