import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount } from './counterSlice'
import { selectCounterValue, selectCanDecrement, selectIsAtMax } from './counterSelectors'

export default function Counter() {
  const count = useSelector(selectCounterValue)
  const canDecrement = useSelector(selectCanDecrement)
  const isAtMax = useSelector(selectIsAtMax)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button onClick={() => dispatch(increment())} disabled={isAtMax}>
          +
        </button>
        <span>{count}</span>
        <button onClick={() => dispatch(decrement())} disabled={!canDecrement}>
          -
        </button>
      </div>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Add 5
      </button>
    </div>
  )
}