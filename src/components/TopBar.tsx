import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface TopBarProps {
  action?: ReactNode
  backHref?: string
  title: string
}

export function TopBar({ action, backHref, title }: TopBarProps) {
  return (
    <header className="ui-top-bar">
      {backHref ? (
        <Link aria-label="Retour" className="ui-back-link" to={backHref}>
          <ArrowLeft aria-hidden="true" size={21} />
        </Link>
      ) : (
        <Link aria-label="Accueil" className="ui-brand" to="/welcome">
          common
        </Link>
      )}
      <h1 className="ui-top-bar-title">{title}</h1>
      <div className="ui-top-bar-action">{action}</div>
    </header>
  )
}
