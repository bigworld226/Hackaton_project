import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({
  children,
  className = '',
  disabled,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-button ui-button--${variant}${className ? ` ${className}` : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
