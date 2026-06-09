import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { selectAuthStatus, selectIsAuthenticated } from './userSelectors'

export interface ProtectedRouteProps {
  children: ReactElement
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const isAuthed = useAppSelector(selectIsAuthenticated)
  const status = useAppSelector(selectAuthStatus)
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        Vérification de la session…
      </div>
    )
  }

  if (!isAuthed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return children
}
