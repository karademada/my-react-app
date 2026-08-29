import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectLoyaltyPoints,
} from './userSelectors'
import { selectCartItemCount } from '../cart/cartSelectors'
import {
  selectFilters,
  selectAllProducts,
} from '../products/productsSelectors'
import { setCategory, setSearchQuery } from '../products/productsSlice'
import { logout } from './userSlice'
import { Header } from '../../components/organisms/Header'
import Cart from '../cart/Cart'

const CATALOG_PATH = '/shop'

export default function UserAuth() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectCurrentUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const loyaltyPoints = useAppSelector(selectLoyaltyPoints)
  const cartItemCount = useAppSelector(selectCartItemCount)
  const filters = useAppSelector(selectFilters)
  const products = useAppSelector(selectAllProducts)
  const dispatch = useAppDispatch()

  const categories = [
    ...new Set(
      products
        .map((p) => p.category)
        .filter((c): c is string => Boolean(c)),
    ),
  ]

  /**
   * `?category=` fait foi, Redux suit. Sens unique : la sélection reste
   * partageable, revient au retour arrière, et sera indexable au SSR — même
   * convention que PartnersPage. Le store reste ce que lisent les sélecteurs,
   * il n'est jamais écrit directement par le Header.
   */
  const urlCategory = params.get('category')

  useEffect(() => {
    dispatch(setCategory(urlCategory))
  }, [dispatch, urlCategory])

  const handleCategoryChange = (category: string | null) => {
    const onCatalog = location.pathname === CATALOG_PATH
    // Depuis une autre route, repartir d'une query vierge : les filtres de
    // /partners n'ont aucun sens sur le catalogue.
    const next = new URLSearchParams(onCatalog ? params : undefined)

    if (category) next.set('category', category)
    else next.delete('category')

    if (onCatalog) setParams(next, { preventScrollReset: true })
    else navigate({ pathname: CATALOG_PATH, search: next.toString() })
  }

  return (
    <Header
      isAuthenticated={isAuthenticated}
      user={currentUser}
      loyaltyPoints={loyaltyPoints}
      cartItemCount={cartItemCount}
      isCartOpen={isCartOpen}
      searchQuery={filters.searchQuery}
      selectedCategory={filters.category}
      categories={categories}
      onLogout={() => dispatch(logout())}
      onCartToggle={() => setIsCartOpen(!isCartOpen)}
      onSearchChange={(query) => dispatch(setSearchQuery(query))}
      onCategoryChange={handleCategoryChange}
      cartContent={<Cart />}
    />
  )
}
