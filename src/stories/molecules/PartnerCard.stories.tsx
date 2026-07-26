import type { Meta, StoryObj } from '@storybook/react-vite'
import { PartnerCard } from '../../components/molecules/PartnerCard'
import type { Commitment, Partner } from '../../types/partner'

const meta: Meta<typeof PartnerCard> = {
  title: 'Molecules/PartnerCard',
  component: PartnerCard,
}

export default meta
type Story = StoryObj<typeof PartnerCard>

const bio: Commitment = {
  id: 1,
  name: 'Bio',
  slug: 'bio',
  category: 'bio',
  rank: 0,
  certifier: 'Ecocert',
}

const fairTrade: Commitment = {
  id: 2,
  name: 'Équitable',
  slug: 'equitable',
  category: 'fair-trade',
  rank: 1,
}

const mockPartner: Partner = {
  id: 1,
  documentId: 'p1',
  name: 'Coopérative Sambava',
  slug: 'cooperative-sambava',
  kind: 'cooperative',
  specialty: 'Vanille bourbon et poivre sauvage',
  tagline: '42 familles réunies autour d’une même parcelle depuis 2019.',
  location: { region: 'Sava', town: 'Sambava', country: 'Madagascar', altitude: 120 },
  commitments: [bio, fairTrade],
  products: [
    { id: 10, name: 'Vanille bourbon', price: 24 },
    { id: 11, name: 'Poivre sauvage', price: 12 },
  ],
  partnerSince: 2019,
  featured: true,
  rank: 0,
}

export const Default: Story = {
  args: {
    partner: mockPartner,
    onPartnerClick: (slug) => console.log('Partner clicked:', slug),
  },
}

export const WithoutPortrait: Story = {
  args: {
    partner: { ...mockPartner, portrait: undefined },
  },
}

export const NoCommitments: Story = {
  args: {
    partner: { ...mockPartner, commitments: [], products: [] },
  },
}

export const SingleFarmer: Story = {
  args: {
    partner: {
      ...mockPartner,
      id: 2,
      name: 'Ferme Antalaha',
      slug: 'ferme-antalaha',
      kind: 'farmer',
      specialty: 'Girofle',
      tagline: undefined,
      commitments: [bio],
      products: [{ id: 12, name: 'Clous de girofle', price: 9 }],
      location: { region: 'Sava', country: 'Madagascar' },
    },
  },
}
