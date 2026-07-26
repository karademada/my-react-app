import type { Partner, PartnerFilters, PartnerKind } from '../../types/partner'

const filterByKind = (partners: Partner[], kind: PartnerKind | null): Partner[] =>
  kind ? partners.filter((p) => p.kind === kind) : partners

/** Un partenaire passe s'il porte au moins un des labels demandes. */
const filterByCommitments = (partners: Partner[], slugs: string[]): Partner[] =>
  slugs.length === 0
    ? partners
    : partners.filter((p) => p.commitments.some((c) => slugs.includes(c.slug)))

const applyFilters = (partners: Partner[], filters: PartnerFilters): Partner[] =>
  filterByCommitments(filterByKind(partners, filters.kind), filters.commitmentSlugs)

const hasCommitment = (partner: Partner, slug: string): boolean =>
  partner.commitments.some((c) => c.slug === slug)

const listRegions = (partners: Partner[]): string[] =>
  [...new Set(partners.map((p) => p.location?.region).filter((r): r is string => !!r))].sort()

const formatLocation = (partner: Partner): string =>
  [partner.location?.town, partner.location?.region].filter(Boolean).join(', ')

const countProducts = (partner: Partner): number => partner.products.length

const yearsOfPartnership = (partner: Partner, currentYear: number): number | null =>
  partner.partnerSince ? Math.max(0, currentYear - partner.partnerSince) : null

/** Mis en avant d'abord, puis rang manuel, puis alphabetique. */
const sortPartners = (partners: Partner[]): Partner[] =>
  [...partners].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.rank !== b.rank) return a.rank - b.rank
    return a.name.localeCompare(b.name, 'fr')
  })

export const partnersDomain = {
  filterByKind,
  filterByCommitments,
  applyFilters,
  hasCommitment,
  listRegions,
  formatLocation,
  countProducts,
  yearsOfPartnership,
  sortPartners,
}
