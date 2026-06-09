import type { CartItem as CartItemType } from '../../types'

export interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

const fmt = (n: number) => '€ ' + Number(n).toFixed(2).replace('.', ',')

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        gap: 14,
        alignItems: 'start',
        padding: '16px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: 'var(--paper-200)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ink-900)',
            letterSpacing: '-0.005em',
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {item.name}
        </div>
        {item.selectedSize && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Taille · {item.selectedSize}
          </div>
        )}
        {item.selectedColor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: item.selectedColor.hex,
                border: '1px solid var(--line)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {item.selectedColor.name}
            </span>
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', marginTop: 4 }}>
          {fmt(item.price)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', minWidth: 90 }}>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 0)}
          min={0}
          style={{
            width: 64,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink-900)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            textAlign: 'center',
            outline: 'none',
          }}
        />
        <button
          onClick={() => onRemove(item.id)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--joy-600)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}

export default CartItem
