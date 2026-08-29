import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectDiscountPercent,
  selectFinalTotal,
} from '../../features/cart/cartSelectors'
import { removeFromCart, updateCartQuantity } from '../../features/cart/cartSlice'
import { cartDomain } from '../../features/cart/cartDomain'
import { useCreateCheckoutSessionMutation } from '../../api/apiSlice'
import { Button } from '../atoms/Button'
import type { CartItem as CartItemType } from '../../types'

const fmt = (n: number) => '€ ' + Number(n).toFixed(2).replace('.', ',')

const keyOf = (item: CartItemType): string => item.cartKey ?? String(item.id)

export const CartPage = () => {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartTotal)
  const count = useAppSelector(selectCartItemCount)
  const discount = useAppSelector(selectDiscountPercent)
  const finalTotal = useAppSelector(selectFinalTotal)
  const [createCheckoutSession, { isLoading: checkingOut, isError: checkoutFailed }] =
    useCreateCheckoutSessionMutation()
  const shipping = subtotal > 60 || subtotal === 0 ? 0 : 6
  const total = finalTotal + shipping

  const handleCheckout = async () => {
    try {
      const { url } = await createCheckoutSession(
        cartDomain.toCheckoutPayload(items),
      ).unwrap()
      window.location.assign(url)
    } catch {
      // mutation state carries the error; the user can retry
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display-md)', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink-900)', margin: '0 0 10px' }}>Votre panier est vide.</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text-muted)' }}>Explorez notre sélection de produits tracés.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 24px 96px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.6vw, 56px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink-900)', margin: '0 0 14px' }}>
          Le montant total de votre Panier est de {fmt(total)}.
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text-muted)', margin: 0 }}>
          Livraison neutre en carbone et retours gratuits sur toutes les commandes.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
          <Button colorScheme="ink" size="lg" style={{ minWidth: 'min(240px, 100%)' }} onClick={handleCheckout} disabled={checkingOut}>Paiement express</Button>
          <Button colorScheme="joy" size="lg" uppercase style={{ minWidth: 'min(240px, 100%)' }} onClick={handleCheckout} disabled={checkingOut}>
            {checkingOut ? 'Redirection…' : 'Valider la commande'}
          </Button>
        </div>
        {checkoutFailed && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--joy-600)', marginTop: 18 }}>
            Le paiement est indisponible pour le moment. Réessayez dans un instant.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', background: 'var(--joy-100)', borderRadius: 'var(--radius-lg)', padding: '14px 20px', maxWidth: 720, margin: '0 auto 48px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--joy-700)', lineHeight: 1.5 }}>
          {shipping === 0
            ? 'Bonne nouvelle — votre livraison est offerte, et chaque commande soutient les coopératives partenaires.'
            : `Ajoutez ${fmt(60 - subtotal)} pour profiter de la livraison offerte.`}
        </span>
      </div>

      <div style={{ borderTop: '1px solid var(--line)' }}>
        {items.map((it) => (
          <div key={keyOf(it)} className="pk-cart-line" style={{ padding: '32px 0', borderBottom: '1px solid var(--line)' }}>
            <div className="pk-cart-line-media" style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--paper-200)' }}>
              {it.image && <img src={it.image} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div className="pk-cart-line-info" style={{ paddingTop: 4 }}>
              {it.category && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>{it.category}</div>}
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2vw, 26px)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-900)', lineHeight: 1.1 }}>{it.name}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--bio)', marginTop: 10 }}>Livraison demain — gratuite</div>
            </div>
            <select
              className="pk-cart-line-qty"
              value={it.quantity}
              onChange={(e) => dispatch(updateCartQuantity({ cartKey: keyOf(it), quantity: Number(e.target.value) }))}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)', background: 'var(--bg-surface)', border: '1.5px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '9px 14px', cursor: 'pointer' }}
            >
              {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <div className="pk-cart-line-price">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, fontWeight: 600, color: 'var(--ink-900)' }}>{fmt(it.price * it.quantity)}</div>
              <button
                onClick={() => dispatch(removeFromCart(keyOf(it)))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 12, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--joy-600)', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 'min(380px, 100%)', marginLeft: 'auto', marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)' }}>
          <span>Sous-total</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-body)' }}>{fmt(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)' }}>
            <span>Remise ({discount} %)</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--bio)' }}>−{fmt(subtotal - finalTotal)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)' }}>
          <span>Livraison</span><span style={{ fontFamily: 'var(--font-mono)', color: shipping === 0 ? 'var(--bio)' : 'var(--text-body)' }}>{shipping === 0 ? 'Offerte' : fmt(shipping)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, marginTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>Total · {count} article{count > 1 ? 's' : ''}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 600, color: 'var(--ink-900)' }}>{fmt(total)}</span>
        </div>
        <Button colorScheme="joy" size="lg" uppercase fullWidth style={{ marginTop: 20 }} onClick={handleCheckout} disabled={checkingOut}>
          {checkingOut ? 'Redirection…' : 'Valider la commande'}
        </Button>
      </div>
    </div>
  )
}

export default CartPage
