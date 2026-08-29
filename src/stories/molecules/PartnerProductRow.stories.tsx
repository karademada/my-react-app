import type { Meta, StoryObj } from '@storybook/react-vite'
import { PartnerProductRow } from '../../components/molecules/PartnerProductRow'
import type { PartnerProduct } from '../../types'

const meta: Meta<typeof PartnerProductRow> = {
  title: 'Molecules/PartnerProductRow',
  component: PartnerProductRow,
}

export default meta
type Story = StoryObj<typeof PartnerProductRow>

const baseProduct: PartnerProduct = {
  id: 8,
  documentId: 'doc-vanille-10',
  name: 'Vanille Bourbon de Madagascar — botte de 10 gousses',
  slug: 'vanille-bourbon-botte-10',
  price: 49.9,
  stock: 42,
  available: true,
  publishedAt: '2026-05-01T08:00:00Z',
  updatedAt: '2026-08-18T10:00:00Z',
  imageUrl: null,
  image: null,
  gallery: [],
}

export const Default: Story = {
  args: {
    product: baseProduct,
    saving: false,
    error: null,
    onSave: (payload) => console.log('save produit:', payload),
    onUpload: async (file) => {
      console.log('upload:', file.name)
      return { id: 99, url: '/uploads/vanille.png', name: 'vanille.png' }
    },
  },
}

export const Indisponible: Story = {
  args: {
    product: { ...baseProduct, available: false, stock: 12 },
    saving: false,
    error: null,
    onSave: (payload) => console.log('save produit:', payload),
    onUpload: async () => null,
  },
}