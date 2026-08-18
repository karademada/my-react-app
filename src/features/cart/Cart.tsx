import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCartItems,
  selectCartTotal,
  selectFinalTotal,
  selectDiscountPercent,
} from './cartSelectors'
import {
  removeFromCart,
  updateCartQuantity,
  applyDiscount,
  clearCart,
} from './cartSlice'
import { cartDomain } from './cartDomain'
import { selectIsAuthenticated } from '../user/userSelectors'
import { useCreateCheckoutSessionMutation } from '../../api/apiSlice'
import { ShoppingCart } from '../../components/organisms/ShoppingCart'

export default function Cart() {
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const finalTotal = useAppSelector(selectFinalTotal)
  const discount = useAppSelector(selectDiscountPercent)
  const isAuthed = useAppSelector(selectIsAuthenticated)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [createCheckoutSession, { isLoading: checkingOut, isError }] =
    useCreateCheckoutSessionMutation()

  const checkoutError = isError
    ? 'Le paiement est indisponible pour le moment. Vérifiez votre session et réessayez.'
    : null

  const handleCheckout = async () => {
    if (!isAuthed) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }
    try {
      const { url } = await createCheckoutSession(
        cartDomain.toCheckoutPayload(items),
      ).unwrap()
      window.location.assign(url)
    } catch {
      // mutation state carries the error; the user can retry
    }
  }

  return (
    <ShoppingCart
      items={items}
      total={total}
      discount={discount}
      finalTotal={finalTotal}
      onCheckout={handleCheckout}
      checkingOut={checkingOut}
      error={checkoutError}
      onUpdateQuantity={(cartKey, quantity) =>
        dispatch(updateCartQuantity({ cartKey, quantity }))
      }
      onRemove={(cartKey) => dispatch(removeFromCart(cartKey))}
      onApplyDiscount={(d) => dispatch(applyDiscount(d))}
      onClearCart={() => dispatch(clearCart())}
    />
  )
}
