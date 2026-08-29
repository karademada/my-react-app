import { useId, useState } from 'react'
import type { ChangeEvent } from 'react'
import { inputStyle } from '../../features/user/authStyles'
import type { CSSProperties } from 'react'

export interface PasswordFieldProps {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete?: 'current-password' | 'new-password'
  error?: string
  hint?: string
}

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 4l16 16M9.9 5.9A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.9 17.9 0 0 1-3 3.7M6.3 8.2A17.4 17.4 0 0 0 2.5 12s3.5 6.5 9.5 6.5c1.2 0 2.3-.2 3.3-.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M9.6 10.4a3 3 0 0 0 4 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const wrapStyle: CSSProperties = { position: 'relative' }

const toggleStyle: CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 8,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 'none',
  borderRadius: 'var(--radius-md)',
  background: 'transparent',
  color: 'var(--text-muted)',
  cursor: 'pointer',
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
}

const errorStyle: CSSProperties = { marginTop: 6, fontSize: 12, color: '#b04a2f' }

/** Champ mot de passe avec bascule œil — voir / cacher. */
export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  autoComplete = 'current-password',
  error,
  hint,
}: PasswordFieldProps) => {
  const reactId = useId()
  const inputId = id ?? reactId
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
      </label>
      <div style={wrapStyle}>
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          style={{ ...inputStyle, paddingRight: 44 }}
        />
        <button
          type="button"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          style={toggleStyle}
        >
          {visible ? <EyeClosed /> : <EyeOpen />}
        </button>
      </div>
      {error && (
        <div role="alert" style={errorStyle}>
          {error}
        </div>
      )}
      {!error && hint && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}