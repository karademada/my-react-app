import type { CSSProperties, ReactNode } from 'react'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
  <div
    style={{
      maxWidth: 440,
      margin: '64px auto',
      padding: '0 24px',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink-900)',
    }}
  >
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 36px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: 'var(--text-muted)',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
      {footer && (
        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid var(--line)',
            fontSize: 13,
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  </div>
)

export interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

export const Field = ({ label, htmlFor, error, children }: FieldProps) => (
  <div style={{ marginBottom: 16 }}>
    <label
      htmlFor={htmlFor}
      style={{
        display: 'block',
        marginBottom: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}
    >
      {label}
    </label>
    {children}
    {error && (
      <div
        role="alert"
        style={{ marginTop: 6, fontSize: 12, color: '#b04a2f' }}
      >
        {error}
      </div>
    )}
  </div>
)

export const inputStyle: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--ink-900)',
  background: 'var(--bg-surface)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-md)',
  padding: '10px 14px',
  outline: 'none',
  boxSizing: 'border-box',
}
