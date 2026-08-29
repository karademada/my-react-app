import type { PartnerProfilePatch, PartnerProduct, PartnerProfile } from '../../types'

/**
 * Domaine de l'espace partenaire — fonctions pures, sans side effect.
 * La validation et la normalisation vivent ici ; les composants ne font
 * que présenter et déléguer.
 */

export const MAX_STOCK = 1_000_000

/** Borne un stock saisi à l'intervalle accepté par l'API (0..MAX_STOCK). */
export function clampStock(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(MAX_STOCK, Math.max(0, Math.floor(value)))
}

/**
 * Parse la saisie libre du champ stock : chaîne vide → null (pas de
 * changement), sinon entier positif. Retourne null si invalide.
 */
export function parseStockInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  if (!/^\d+$/.test(trimmed)) return null
  return clampStock(Number(trimmed))
}

/** Incrément/décrément garanti cohérent pour le stepper de stock. */
export function nextStock(current: number, delta: number): number {
  return clampStock(current + delta)
}

export interface ProfileDraft {
  tagline: string
  specialty: string
  website: string
  email: string
  phone: string
  partnerSince: string
}

/** Erreurs de validation par champ — vide si le brouillon est valide. */
export function validateProfile(draft: ProfileDraft): Record<string, string> {
  const errors: Record<string, string> = {}
  if (draft.tagline.length > 200) errors.tagline = '200 caractères maximum'
  if (draft.specialty.trim() === '') errors.specialty = 'La spécialité est requise'
  if (draft.specialty.length > 120) errors.specialty = '120 caractères maximum'
  if (draft.website !== '' && !/^https?:\/\/.+/.test(draft.website)) {
    errors.website = 'L‘URL doit commencer par http:// ou https://'
  }
  if (draft.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
    errors.email = 'Adresse e-mail invalide'
  }
  if (draft.partnerSince.trim() !== '') {
    const year = Number(draft.partnerSince)
    if (!Number.isInteger(year) || year < 1950 || year > 2100) {
      errors.partnerSince = 'Année entre 1950 et 2100'
    }
  }
  return errors
}

/**
 * Construit le payload PATCH du profil à partir du brouillon : seuls les
 * champs modifiés partent vers l'API (la liste blanche est côté serveur).
 */
export function buildProfilePayload(
  original: PartnerProfile,
  draft: ProfileDraft,
): PartnerProfilePatch {
  const payload: PartnerProfilePatch = {}
  if (draft.tagline !== (original.tagline ?? '')) payload.tagline = draft.tagline.trim()
  if (draft.specialty !== (original.specialty ?? '')) payload.specialty = draft.specialty.trim()
  if (draft.website !== (original.website ?? '')) payload.website = draft.website.trim()
  if (draft.email !== (original.email ?? '')) payload.email = draft.email.trim()
  if (draft.phone !== (original.phone ?? '')) payload.phone = draft.phone.trim()
  if (draft.partnerSince.trim() !== '' && Number(draft.partnerSince) !== (original.partnerSince ?? -1)) {
    payload.partnerSince = Number(draft.partnerSince)
  }
  return payload
}

/** Un produit peut être enregistré si le stock affiché est un entier valide. */
export function canSaveProduct(stockInput: string, _available: boolean): boolean {
  const stock = parseStockInput(stockInput)
  return stock !== null
}

/** Produits publiés d'abord, puis par ordre alphabétique. */
export function sortPartnerProducts(products: PartnerProduct[]): PartnerProduct[] {
  return [...products].sort((a, b) => {
    const aPub = a.publishedAt ? 1 : 0
    const bPub = b.publishedAt ? 1 : 0
    if (aPub !== bPub) return bPub - aPub
    return a.name.localeCompare(b.name, 'fr')
  })
}

/** Les URLs média de Strapi sont relatives — on les absolutise pour <img>. */
export function absoluteMediaUrl(url: string | null | undefined, baseUrl: string): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl.replace(/\/$/, '')}${url}`
}

/** Photo principale d'un produit partenaire (média uploadé ou URL). */
export function productPhoto(product: PartnerProduct, baseUrl: string): string | null {
  return (
    absoluteMediaUrl(product.image, baseUrl) ??
    absoluteMediaUrl(product.imageUrl, baseUrl)
  )
}

/** État marchand affiché sur une ligne produit de l'espace partenaire. */
export function availabilityLabel(product: Pick<PartnerProduct, 'stock' | 'available'>): string {
  if (!product.available) return 'Momentanément indisponible'
  if (product.stock === 0) return 'Épuisé'
  return `${product.stock} en stock`
}