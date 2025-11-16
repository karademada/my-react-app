import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotal, selectCartItemCount, selectFinalTotal, selectDiscountPercent } from './cartSelectors'
import { removeFromCart, updateCartQuantity, applyDiscount, clearCart } from './cartSlice'

export default function Cart() {
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const itemCount = useSelector(selectCartItemCount)
  const finalTotal = useSelector(selectFinalTotal)
  const discount = useSelector(selectDiscountPercent)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Cart ({itemCount} items)</h2>
      {items.map(item => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h4>{item.name}</h4>
          <p>Price: ${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => dispatch(updateCartQuantity({ productId: item.id, quantity: parseInt(e.target.value) }))}
            min="0"
          />
          <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
        </div>
      ))}
      <div>
        <p>Subtotal: ${total.toFixed(2)}</p>
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) => dispatch(applyDiscount(parseInt(e.target.value) || 0))}
        />
        <p>Final Total: ${finalTotal.toFixed(2)}</p>
        <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
      </div>
    </div>
  )
}