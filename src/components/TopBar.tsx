import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface TopBarProps {
  action?: ReactNode
  backHref?: string
  title: string
}

export function TopBar({ action, backHref, title }: TopBarProps) {
  return (
    <header className="ui-top-bar">
      {backHref ? (
        <a aria-label="Retour" className="ui-back-link" href={backHref}>
          <ArrowLeft aria-hidden="true" size={21} />
        </a>
      ) : (
        <a aria-label="Accueil" className="ui-brand" href="/">
          common
        </a>
      )}
      <h1 className="ui-top-bar-title">{title}</h1>
      <div className="ui-top-bar-action">{action}</div>
    </header>
  )
}
