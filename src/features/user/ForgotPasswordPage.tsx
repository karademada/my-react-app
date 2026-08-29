import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useForgotPasswordMutation } from '../../api/apiSlice'
import { userDomain } from './userDomain'
import { Button } from '../../components/atoms/Button'
import { AuthLayout, Field } from './AuthLayout'
import { inputStyle } from './authStyles'

/**
 * Demande de réinitialisation.
 * - Succès : message volontairement neutre — on ne révèle pas si l'e-mail
 *   correspond à un compte (OWASP).
 * - Échec d'envoi (réseau / SMTP) : erreur claire, SANS révéler non plus
 *   l'existence d'un compte.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [request, { isLoading }] = useForgotPasswordMutation()

  const trimmed = email.trim()
  const valid = userDomain.validateEmail(trimmed)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!valid || isLoading) return
    setSendError(null)
    try {
      await request({ email: trimmed }).unwrap()
      setSent(true)
    } catch {
      setSendError(
        "L'envoi du lien a échoué pour le moment. Réessayez dans quelques instants, ou contactez le support place·kabar.",
      )
    }
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Indiquez votre e-mail : nous vous enverrons un lien pour définir un nouveau mot de passe."
      footer={
        <>
          <Link to="/login" style={{ color: 'var(--ink-900)', textDecoration: 'underline' }}>
            ← Retour à la connexion
          </Link>
        </>
      }
    >
      {sent ? (
        <div role="status" style={{ display: 'grid', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-900)' }}>
            Si un compte existe pour <strong>{trimmed}</strong>, un e-mail de réinitialisation
            vient d'être envoyé. Vérifiez votre boîte de réception — et vos indésirables.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            Le lien est valable une seule fois. Vous pouvez en demander un nouveau à tout moment.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Field label="Email" htmlFor="forgot-email" error={email.length > 0 && !valid ? 'Email invalide' : undefined}>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </Field>

          {sendError && (
            <div
              role="alert"
              style={{
                margin: '0 0 16px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#fbe9e2',
                color: '#8b3517',
                fontSize: 13,
              }}
            >
              {sendError}
            </div>
          )}

          <Button type="submit" colorScheme="ink" size="md" fullWidth disabled={!valid || isLoading}>
            {isLoading ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}