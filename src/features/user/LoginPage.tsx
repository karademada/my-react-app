import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearAuthError } from './userSlice'
import { useLoginMutation } from '../../api/apiSlice'
import {
  selectAuthError,
  selectIsAuthLoading,
  selectIsAuthenticated,
} from './userSelectors'
import { userDomain } from './userDomain'
import { Button } from '../../components/atoms/Button'
import { AuthLayout, Field } from './AuthLayout'
import { inputStyle } from './authStyles'

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const loading = useAppSelector(selectIsAuthLoading)
  const serverError = useAppSelector(selectAuthError)
  const isAuthed = useAppSelector(selectIsAuthenticated)
  const [login] = useLoginMutation()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/'

  useEffect(() => {
    if (isAuthed) navigate(redirectTo, { replace: true })
  }, [isAuthed, navigate, redirectTo])

  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  const trimmed = identifier.trim()
  const emailLooksValid = trimmed.length === 0 || userDomain.validateEmail(trimmed)
  const passwordLooksValid = password.length === 0 || userDomain.validatePassword(password)
  const formValid =
    trimmed.length > 0 &&
    userDomain.validateEmail(trimmed) &&
    userDomain.validatePassword(password)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched(true)
    if (!formValid) return
    login({ identifier: trimmed, password })
  }

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Retrouvez votre panier, vos commandes et vos points fidélité."
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: 'var(--ink-900)', textDecoration: 'underline' }}>
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <Field
          label="Email"
          htmlFor="login-identifier"
          error={touched && !emailLooksValid ? 'Email invalide' : undefined}
        >
          <input
            id="login-identifier"
            type="email"
            autoComplete="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field
          label="Mot de passe"
          htmlFor="login-password"
          error={touched && !passwordLooksValid ? '8 caractères minimum' : undefined}
        >
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </Field>

        {serverError && (
          <div
            role="alert"
            style={{
              marginBottom: 16,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: '#fbe9e2',
              color: '#8b3517',
              fontSize: 13,
            }}
          >
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          colorScheme="ink"
          size="md"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>
    </AuthLayout>
  )
}
