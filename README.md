# Redux Shop - Clean Architecture E-commerce App

A modern e-commerce application demonstrating clean architecture principles, atomic design patterns, and comprehensive testing strategies for frontend development.

## 🎯 Project Intention

This project showcases professional frontend development practices:
- **Clean Architecture**: Separation of concerns with domain logic isolated in Redux store
- **Atomic Design**: Component hierarchy from atoms to organisms for maximum reusability
- **Test-Driven Development**: Comprehensive test coverage for business logic and UI components
- **Modern Animations**: Smooth GSAP animations and parallax effects
- **Type-Safe State Management**: Redux Toolkit with proper domain modeling

## 🏗️ Architecture

### Clean Architecture - Domain Logic

All business logic is isolated in the `src/features` directory:

```
src/features/
├── cart/
│   ├── cartDomain.js      # Pure business functions
│   ├── cartSlice.js       # Redux state management
│   ├── cartSelectors.js   # State selectors
│   └── Cart.jsx           # Feature component
├── products/
│   ├── productsDomain.js  # Product business logic
│   ├── productsSlice.js   # Product state
│   └── productsSelectors.js
└── user/
    ├── userDomain.js      # User business logic
    ├── userSlice.js       # User state
    └── userSelectors.js
```

**Key Principles:**
- Domain logic is pure functions (no side effects)
- Redux slices handle state management
- Selectors provide computed state
- Feature components connect UI to store

### Atomic Design - UI Architecture

Components follow atomic design methodology:

```
src/components/
├── atoms/           # Basic building blocks
│   └── Button.jsx
├── molecules/       # Simple component groups
│   ├── CartItem.jsx
│   └── ProductCard.jsx
└── organisms/       # Complex components
    ├── Header.jsx
    ├── Footer.jsx
    ├── ProductList.jsx
    ├── ProductDetail.jsx
    └── ShoppingCart.jsx
```

**Benefits:**
- Maximum reusability
- Easy to test in isolation
- Clear component hierarchy
- Storybook integration

## 🧪 Testing Strategy

### Domain Logic Tests (94 tests passing)

```bash
pnpm test
```

**Coverage:**
- `cartDomain.test.js` - Cart business logic (23 tests)
  - Item management with size/color variants
  - Quantity updates
  - Total calculations
  - Discount application
- `productsDomain.test.js` - Product filtering (12 tests)
- `userDomain.test.js` - Authentication logic (17 tests)
- Redux slice tests - State management (19 tests)
- Selector tests - Computed state (13 tests)

**Test Philosophy:**
- Pure functions are easy to test
- No mocking required for domain logic
- Fast execution (< 1 second)
- High confidence in business rules

### UI Component Tests (Storybook)

```bash
pnpm storybook
```

**Storybook Stories:**
- Atoms: Button variations
- Molecules: CartItem, ProductCard states
- Organisms: Header, ProductList, ProductDetail, ShoppingCart

**Interactive Testing:**
- Visual regression testing
- Component state variations
- Accessibility testing with a11y addon
- Responsive design validation

## 🎨 Features

### E-commerce Functionality
- Product browsing with filtering and search
- Product detail pages with size/color selection
- Shopping cart with variant support
- User authentication
- Loyalty points system

### Technical Features
- **Routing**: React Router with smooth transitions
- **Animations**: GSAP for page transitions and parallax effects
- **State Management**: Redux Toolkit with domain-driven design
- **UI Library**: Chakra UI v3
- **Build Tool**: Vite with React Compiler

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Run tests
pnpm test

# Test with UI
pnpm test:ui

# Test coverage
pnpm test:coverage

# Storybook
pnpm storybook

# Build for production
pnpm build
```

## 📁 Project Structure

```
my-react-app/
├── src/
│   ├── components/        # Atomic design components
│   ├── features/          # Domain logic & Redux
│   ├── store/             # Redux store configuration
│   ├── stories/           # Storybook stories
│   ├── utils/             # Utilities (transitions, etc.)
│   └── __tests__/         # Test files
├── .storybook/            # Storybook configuration
└── package.json
```

## 🎯 Key Learnings

1. **Separation of Concerns**: Domain logic separate from UI improves testability
2. **Atomic Design**: Component reusability scales with project size
3. **Pure Functions**: Easy to test, reason about, and maintain
4. **Redux Toolkit**: Reduces boilerplate while maintaining type safety
5. **Storybook**: Component development in isolation improves quality

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Chakra UI v3** - Component library
- **GSAP** - Animations
- **Vitest** - Testing framework
- **Storybook** - Component development
- **Vite** - Build tool

## 📊 Test Coverage

- **Domain Logic**: 94 tests, 100% coverage
- **UI Components**: Full Storybook coverage
- **Integration**: Feature components tested via Storybook

## 🎓 Best Practices Demonstrated

✅ Clean architecture with domain-driven design  
✅ Atomic design pattern for UI components  
✅ Comprehensive test coverage  
✅ Pure functions for business logic  
✅ Proper state management with Redux  
✅ Component isolation with Storybook  
✅ Smooth animations and UX  
✅ Responsive design  
✅ Accessibility considerations
