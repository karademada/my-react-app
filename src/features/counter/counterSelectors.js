import { counterDomain } from './counterDomain'

export const selectCounterValue = (state) => state.counter.value
export const selectCanDecrement = (state) => counterDomain.canDecrement(state.counter.value)
export const selectIsAtMax = (state) => counterDomain.isAtMax(state.counter.value)