import type { ButtonHTMLAttributes } from 'react'
import './button.css'

export interface StoryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  primary?: boolean
  backgroundColor?: string | null
  size?: 'small' | 'medium' | 'large'
  label: string
}

export const Button = ({
  primary = false,
  backgroundColor = null,
  size = 'medium',
  label,
  ...props
}: StoryButtonProps) => {
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(
        ' ',
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}
    >
      {label}
    </button>
  )
}
