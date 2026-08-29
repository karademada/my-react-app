import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useState } from 'react'

type Tone = 'ink' | 'moss' | 'joy'
type Variant = 'solid' | 'outline' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children?: ReactNode
  variant?: Variant
  colorScheme?: Tone | string
  size?: Size
  uppercase?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const SIZES: Record<Size, { padding: string; fontSize: number; minH: number; gap: number }> = {
  sm: { padding: '8px 14px', fontSize: 13, minH: 34, gap: 7 },
  md: { padding: '11px 20px', fontSize: 14, minH: 42, gap: 8 },
  lg: { padding: '15px 28px', fontSize: 16, minH: 52, gap: 10 },
}

const TONE: Record<Tone, [string, string]> = {
  ink: ['var(--ink-900)', 'var(--ink-700)'],
  moss: ['var(--moss-600)', 'var(--moss-700)'],
  joy: ['var(--joy-600)', 'var(--joy-700)'],
}

function resolveTone(c: string | undefined): Tone {
  if (c === 'moss' || c === 'joy' || c === 'ink') return c
  return 'ink'
}

export const Button = ({
  children,
  variant = 'solid',
  colorScheme = 'ink',
  size = 'md',
  uppercase = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  disabled = false,
  style,
  ...rest
}: ButtonProps) => {
  const s = SIZES[size]
  const tone = resolveTone(colorScheme)
  const [base, hover] = TONE[tone]
  const [isHover, setHover] = useState(false)
  const [isPress, setPress] = useState(false)

  const variants: Record<Variant, React.CSSProperties> = {
    // borderWidth/Style/Color séparés : le hover ne change que borderColor,
    // sans mélanger shorthand et non-shorthand (warning React).
    solid: { background: base, color: 'var(--paper-0)', borderWidth: 1.5, borderStyle: 'solid', borderColor: base },
    outline: { background: 'transparent', color: 'var(--ink-900)', borderWidth: 1.5, borderStyle: 'solid', borderColor: 'var(--ink-900)' },
    ghost: { background: 'transparent', color: 'var(--ink-900)', borderWidth: 1.5, borderStyle: 'solid', borderColor: 'transparent' },
    link: { background: 'transparent', color: base, borderWidth: 0, borderStyle: 'none', borderColor: 'transparent', textDecoration: 'underline', textUnderlineOffset: 4 },
  }

  const hoverCss: React.CSSProperties =
    disabled || !isHover ? {}
    : variant === 'solid' ? { background: hover, borderColor: hover }
    : variant === 'outline' ? { background: 'var(--ink-900)', color: 'var(--paper-0)' }
    : variant === 'ghost' ? { background: 'var(--paper-200)' }
    : { opacity: 0.7 }

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false) }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        padding: variant === 'link' ? '4px 0' : s.padding,
        minHeight: variant === 'link' ? undefined : s.minH,
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'var(--font-sans)', fontSize: s.fontSize, fontWeight: 600,
        letterSpacing: uppercase ? '0.12em' : '-0.005em',
        textTransform: uppercase ? 'uppercase' : 'none',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transform: isPress && !disabled ? 'scale(0.975)' : 'scale(1)',
        transition: 'background 140ms, color 140ms, border-color 140ms, transform 140ms, opacity 140ms',
        ...variants[variant],
        ...hoverCss,
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}

export default Button
