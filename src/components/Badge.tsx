import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({
  children,
  className = '',
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`ui-badge ui-badge--${variant}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </span>
  )
}
