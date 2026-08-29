import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useForgotPasswordMutation } from '../../api/apiSlice'
import { userDomain } from './userDomain'
import { Button } from '../../components/atoms/Button'
import { AuthLayout, Field } from './AuthLayout'
import { inputStyle } from './authStyles'

/**
 * Demande de réinitialisation. La réponse est volontairement neutre —
 * on ne révèle pas si l'e-mail correspond à un compte (OWASP) — et les
 * erreurs de livraison n'informent pas l'utilisateur non plus.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [request] = useForgotPasswordMutation()

  const trimmed = email.trim()
  const valid = userDomain.validateEmail(trimmed)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!valid) return
    try {
      await request({ email: trimmed }).unwrap()
    } catch {
      // Livraison SMTP indisponible ou compte absent : même silence côté UI.
    }
    setSent(true)
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
          <Button type="submit" colorScheme="ink" size="md" fullWidth disabled={!valid}>
            Envoyer le lien de réinitialisation
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}