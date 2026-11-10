import { Mail } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  action?: ReactNode
  description: string
  icon?: ReactNode
  title: string
}

export function EmptyState({
  action,
  description,
  icon,
  title,
}: EmptyStateProps) {
  return (
    <section className="ui-empty-state">
      <div aria-hidden="true" className="ui-empty-icon">
        {icon ?? <Mail size={24} strokeWidth={1.8} />}
      </div>
      <h2 className="ui-empty-title">{title}</h2>
      <p className="ui-empty-description">{description}</p>
      {action && <div className="ui-empty-action">{action}</div>}
    </section>
  )
}
