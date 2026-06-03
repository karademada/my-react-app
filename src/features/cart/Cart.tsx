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
import { ShoppingCart } from '../../components/organisms/ShoppingCart'

export default function Cart() {
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const finalTotal = useAppSelector(selectFinalTotal)
  const discount = useAppSelector(selectDiscountPercent)
  const dispatch = useAppDispatch()

  return (
    <ShoppingCart
      items={items}
      total={total}
      discount={discount}
      finalTotal={finalTotal}
      onUpdateQuantity={(id, quantity) =>
        dispatch(updateCartQuantity({ productId: id, quantity }))
      }
      onRemove={(id) => dispatch(removeFromCart(id))}
      onApplyDiscount={(d) => dispatch(applyDiscount(d))}
      onClearCart={() => dispatch(clearCart())}
    />
  )
}
