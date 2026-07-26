import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetCommitmentsQuery, useGetPartnersQuery } from '../../api/partnersApi'
import { PartnerList } from '../../components/organisms/PartnerList'
import { partnersDomain } from './partnersDomain'
import type { PartnerFilters, PartnerKind } from '../../types/partner'

/**
 * Les filtres vivent dans l'URL plutot que dans Redux : une selection reste
 * partageable, revient au retour arriere, et sera indexable le jour du SSR.
 */
export default function PartnersPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const { data: partners = [], isLoading, isError, refetch } = useGetPartnersQuery()
  const { data: commitments = [] } = useGetCommitmentsQuery()

  const filters: PartnerFilters = {
    kind: (params.get('kind') as PartnerKind | null) ?? null,
    commitmentSlugs: params.getAll('commitment'),
  }

  const visible = partnersDomain.sortPartners(
    partnersDomain.applyFilters(partners, filters),
  )
  const regions = partnersDomain.listRegions(visible)

  const handleSelectKind = (kind: PartnerKind) => {
    const next = new URLSearchParams(params)
    if (filters.kind === kind) next.delete('kind')
    else next.set('kind', kind)
    setParams(next, { preventScrollReset: true })
  }

  const handleToggleCommitment = (slug: string) => {
    const next = new URLSearchParams(params)
    const current = next.getAll('commitment')
    next.delete('commitment')
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug]
    updated.forEach((s) => next.append('commitment', s))
    setParams(next, { preventScrollReset: true })
  }

  return (
    <PartnerList
      partners={visible}
      commitments={commitments}
      filters={filters}
      regions={regions}
      isLoading={isLoading}
      isError={isError}
      onSelectKind={handleSelectKind}
      onToggleCommitment={handleToggleCommitment}
      onPartnerClick={(slug) => navigate(`/partners/${slug}`)}
      onRetry={refetch}
    />
  )
}
