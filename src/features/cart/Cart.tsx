import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCartItems,
  selectCartTotal,
  selectFinalTotal,
  selectDiscountPercent,
  selectCheckoutStatus,
} from './cartSelectors'
import {
  removeFromCart,
  updateCartQuantity,
  applyDiscount,
  clearCart,
  startCheckout,
} from './cartSlice'
import { selectIsAuthenticated } from '../user/userSelectors'
import { ShoppingCart } from '../../components/organisms/ShoppingCart'

export default function Cart() {
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const finalTotal = useAppSelector(selectFinalTotal)
  const discount = useAppSelector(selectDiscountPercent)
  const isAuthed = useAppSelector(selectIsAuthenticated)
  const checkoutStatus = useAppSelector(selectCheckoutStatus)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthed) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }
    dispatch(startCheckout(items))
  }

  return (
    <ShoppingCart
      items={items}
      total={total}
      discount={discount}
      finalTotal={finalTotal}
      onCheckout={handleCheckout}
      checkingOut={checkoutStatus === 'loading'}
      onUpdateQuantity={(id, quantity) =>
        dispatch(updateCartQuantity({ productId: id, quantity }))
      }
      onRemove={(id) => dispatch(removeFromCart(id))}
      onApplyDiscount={(d) => dispatch(applyDiscount(d))}
      onClearCart={() => dispatch(clearCart())}
    />
  )
}
