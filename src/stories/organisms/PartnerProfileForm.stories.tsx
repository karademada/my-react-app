import type { Meta, StoryObj } from '@storybook/react-vite'
import { PartnerProfileForm } from '../../components/organisms/PartnerProfileForm'
import type { PartnerProfile } from '../../types'

const meta: Meta<typeof PartnerProfileForm> = {
  title: 'Organisms/PartnerProfileForm',
  component: PartnerProfileForm,
}

export default meta
type Story = StoryObj<typeof PartnerProfileForm>

const partner: PartnerProfile = {
  id: 2,
  documentId: 'doc-soa-vanilla',
  name: 'Coopérative Soa Vanilla',
  slug: 'cooperative-soa-vanilla',
  kind: 'cooperative',
  specialty: 'Vanille Bourbon préparée et extraits',
  tagline: 'Nos gousses mûrissent lentement sous les tropiques de Sava',
  portrait: null,
  gallery: [],
  location: { region: 'Sava', town: 'Antalaha', country: 'Madagascar' },
  keyFigures: [{ value: '120', label: 'producteurs membres' }],
  commitments: [{ id: 1, title: 'Impact social' }],
  website: 'https://soavanilla.example',
  email: 'contact@soavanilla.example',
  phone: '+261 32 00 000',
  partnerSince: 2018,
}

export const Default: Story = {
  args: {
    partner,
    saving: false,
    error: null,
    onSave: (payload) => console.log('save profil:', payload),
    onUpload: async (file) => {
      console.log('upload:', file.name)
      return { id: 1, url: '/uploads/portrait.png', name: 'portrait.png' }
    },
  },
}