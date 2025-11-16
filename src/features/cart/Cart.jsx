import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotal, selectFinalTotal, selectDiscountPercent } from './cartSelectors'
import { removeFromCart, updateCartQuantity, applyDiscount, clearCart } from './cartSlice'
import { ShoppingCart } from '../../components/organisms/ShoppingCart'

export default function Cart() {
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const finalTotal = useSelector(selectFinalTotal)
  const discount = useSelector(selectDiscountPercent)
  const dispatch = useDispatch()

  return (
    <ShoppingCart
      items={items}
      total={total}
      discount={discount}
      finalTotal={finalTotal}
      onUpdateQuantity={(id, quantity) => dispatch(updateCartQuantity({ productId: id, quantity }))}
      onRemove={(id) => dispatch(removeFromCart(id))}
      onApplyDiscount={(discount) => dispatch(applyDiscount(discount))}
      onClearCart={() => dispatch(clearCart())}
    />
  )
}