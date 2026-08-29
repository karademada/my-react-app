import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useResetPasswordMutation } from '../../api/apiSlice'
import { userDomain } from './userDomain'
import { Button } from '../../components/atoms/Button'
import { AuthLayout, Field } from './AuthLayout'
import { inputStyle } from './authStyles'
import { PasswordField } from '../../components/molecules/PasswordField'

/** Définition d'un nouveau mot de passe à partir du code reçu par e-mail. */
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const codeParam = params.get('code') ?? ''

  const [code, setCode] = useState(codeParam)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [request, { isLoading }] = useResetPasswordMutation()

  const pwValid = userDomain.validatePassword(password)
  const confirmValid = password === confirm
  const formValid = code.trim() !== '' && pwValid && confirmValid

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!formValid) return
    try {
      await request({ code: code.trim(), password, passwordConfirmation: confirm }).unwrap()
      setDone(true)
    } catch (err) {
      const message = (err as { data?: { error?: { message?: string } } })?.data?.error?.message
      setError(
        message?.includes('code') || message?.toLowerCase().includes('invalid')
          ? 'Ce code est invalide ou a déjà été utilisé. Demandez un nouveau lien.'
          : 'Impossible de réinitialiser le mot de passe. Réessayez.',
      )
    }
  }

  return (
    <AuthLayout
      title="Nouveau mot de passe"
      subtitle="Collez le code reçu par e-mail, puis choisissez votre nouveau mot de passe."
      footer={
        <>
          <Link to="/login" style={{ color: 'var(--ink-900)', textDecoration: 'underline' }}>
            ← Retour à la connexion
          </Link>
        </>
      }
    >
      {done ? (
        <div role="status" style={{ display: 'grid', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-900)' }}>
            ✓ Votre mot de passe a été modifié. Vous pouvez vous connecter avec le nouveau.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 42,
              borderRadius: 'var(--radius-md)',
              background: 'var(--ink-900)',
              color: 'var(--paper-0)',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Se connecter
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Field
            label="Code de réinitialisation"
            htmlFor="reset-code"
            error={code.length > 0 && code.trim() === '' ? 'Code requis' : undefined}
          >
            <input
              id="reset-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Reçu par e-mail"
              style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
            />
          </Field>

          <PasswordField
            id="reset-password"
            label="Nouveau mot de passe"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            error={password.length > 0 && !pwValid ? '8 caractères minimum' : undefined}
            hint={password.length === 0 ? '8 caractères minimum' : undefined}
          />

          <PasswordField
            id="reset-confirm"
            label="Confirmation"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            error={confirm.length > 0 && !confirmValid ? 'Les mots de passe ne correspondent pas' : undefined}
          />

          {error && (
            <div
              role="alert"
              style={{
                margin: '16px 0',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#fbe9e2',
                color: '#8b3517',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            colorScheme="ink"
            size="md"
            fullWidth
            disabled={isLoading || !formValid}
          >
            {isLoading ? 'Enregistrement…' : 'Définir le nouveau mot de passe'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}