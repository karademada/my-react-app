// Domain logic - pure functions for counter business rules
export const counterDomain = {
  increment: (value) => value + 1,
  decrement: (value) => value - 1,
  incrementByAmount: (value, amount) => value + amount,
  canDecrement: (value) => value > 0,
  isAtMax: (value, max = 100) => value >= max,
}