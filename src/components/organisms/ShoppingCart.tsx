import { CartItem } from '../molecules/CartItem'
import { Button } from '../atoms/Button'
import type { CartItem as CartItemType } from '../../types'

export interface ShoppingCartProps {
  items: CartItemType[]
  total: number
  discount: number
  finalTotal: number
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  onApplyDiscount: (discount: number) => void
  onClearCart: () => void
}

const fmt = (n: number) => '€ ' + Number(n).toFixed(2).replace('.', ',')

export const ShoppingCart = ({
  items,
  total,
  discount,
  finalTotal,
  onUpdateQuantity,
  onRemove,
  onApplyDiscount,
  onClearCart,
}: ShoppingCartProps) => {
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {count} article{count > 1 ? 's' : ''}
      </div>

      <div>
        {items.length === 0 ? (
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              color: 'var(--text-muted)',
              padding: '24px 0',
              textAlign: 'center',
            }}
          >
            Votre panier est vide.
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }}>
            <span>Sous-total</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-900)' }}>{fmt(total)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Remise
            </span>
            <input
              type="number"
              placeholder="0"
              value={discount}
              onChange={(e) => onApplyDiscount(parseInt(e.target.value, 10) || 0)}
              style={{
                width: 80,
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--ink-900)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                outline: 'none',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>%</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: 12,
              borderTop: '1px solid var(--line)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: 'var(--ink-900)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 19, fontWeight: 600, color: 'var(--ink-900)' }}>{fmt(finalTotal)}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <Button colorScheme="joy" size="md" uppercase fullWidth>Valider la commande</Button>
            <Button variant="ghost" size="sm" onClick={onClearCart} style={{ color: 'var(--text-muted)' }}>
              Vider le panier
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppingCart
