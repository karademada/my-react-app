import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { clearCart } from '../../features/cart/cartSlice'

export const CheckoutSuccessPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearCart())
  }, [dispatch])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink-900)', margin: '0 0 10px' }}>
        Merci pour votre commande !
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text-muted)', margin: '0 0 32px' }}>
        Votre paiement a bien été confirmé. Vous recevrez un e-mail de confirmation dans quelques instants.
      </p>
      <Link
        to="/"
        style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--joy-600)', textDecoration: 'underline', textUnderlineOffset: 4 }}
      >
        Retour à la boutique
      </Link>
    </div>
  )
}

export default CheckoutSuccessPage
