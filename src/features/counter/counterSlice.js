import { createSlice } from '@reduxjs/toolkit'
import { counterDomain } from './counterDomain'

const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value = counterDomain.increment(state.value)
    },
    decrement: (state) => {
      if (counterDomain.canDecrement(state.value)) {
        state.value = counterDomain.decrement(state.value)
      }
    },
    incrementByAmount: (state, action) => {
      state.value = counterDomain.incrementByAmount(state.value, action.payload)
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer