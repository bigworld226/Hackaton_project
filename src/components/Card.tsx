import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface CardProps {
  action?: ReactNode
  children?: ReactNode
  className?: string
  description?: ReactNode
  href?: string
  title?: ReactNode
}

export function Card({
  action,
  children,
  className = '',
  description,
  href,
  title,
}: CardProps) {
  const content = (
    <>
      {(title || action || href) && (
        <div className="ui-card-heading">
          {title && <h2 className="ui-card-title">{title}</h2>}
          {action ?? (href && <ChevronRight aria-hidden="true" size={20} />)}
        </div>
      )}
      {description && <p className="ui-card-description">{description}</p>}
      {children}
    </>
  )

  if (href) {
    return (
      <a
        className={`ui-card ui-card--link${className ? ` ${className}` : ''}`}
        href={href}
      >
        {content}
      </a>
    )
  }

  return (
    <article className={`ui-card${className ? ` ${className}` : ''}`}>
      {content}
    </article>
  )
}
