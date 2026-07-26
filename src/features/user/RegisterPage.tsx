import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearAuthError } from './userSlice'
import { useRegisterMutation } from '../../api/apiSlice'
import {
  selectAuthError,
  selectIsAuthLoading,
  selectIsAuthenticated,
} from './userSelectors'
import { userDomain } from './userDomain'
import { Button } from '../../components/atoms/Button'
import { AuthLayout, Field } from './AuthLayout'
import { inputStyle } from './authStyles'

const MIN_USERNAME = 3

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector(selectIsAuthLoading)
  const serverError = useAppSelector(selectAuthError)
  const isAuthed = useAppSelector(selectIsAuthenticated)
  const [register] = useRegisterMutation()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (isAuthed) navigate('/', { replace: true })
  }, [isAuthed, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  const trimmedUser = username.trim()
  const trimmedEmail = email.trim()

  const userValid = trimmedUser.length >= MIN_USERNAME
  const emailValid = userDomain.validateEmail(trimmedEmail)
  const pwValid = userDomain.validatePassword(password)
  const confirmValid = password === confirm
  const formValid = userValid && emailValid && pwValid && confirmValid

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched(true)
    if (!formValid) return
    register({
      username: trimmedUser,
      email: trimmedEmail,
      password,
    })
  }

  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez Place Kabar pour suivre vos commandes et accumuler des points fidélité."
      footer={
        <>
          Déjà inscrit·e ?{' '}
          <Link to="/login" style={{ color: 'var(--ink-900)', textDecoration: 'underline' }}>
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <Field
          label="Nom d'utilisateur"
          htmlFor="register-username"
          error={
            touched && trimmedUser.length > 0 && !userValid
              ? `${MIN_USERNAME} caractères minimum`
              : undefined
          }
        >
          <input
            id="register-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field
          label="Email"
          htmlFor="register-email"
          error={
            touched && trimmedEmail.length > 0 && !emailValid ? 'Email invalide' : undefined
          }
        >
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field
          label="Mot de passe"
          htmlFor="register-password"
          error={
            touched && password.length > 0 && !pwValid ? '8 caractères minimum' : undefined
          }
        >
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field
          label="Confirmer le mot de passe"
          htmlFor="register-confirm"
          error={
            touched && confirm.length > 0 && !confirmValid
              ? 'Les mots de passe diffèrent'
              : undefined
          }
        >
          <input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {loading ? 'Création…' : 'Créer mon compte'}
        </Button>
      </form>
    </AuthLayout>
  )
}
