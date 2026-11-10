import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface TopBarProps {
  action?: ReactNode
  backHref?: string
  title: string
}

export function TopBar({ action, backHref, title }: TopBarProps) {
  const { t } = useTranslation()
  return (
    <header className="ui-top-bar">
      {backHref ? (
        <Link aria-label={t('common.back')} className="ui-back-link" to={backHref}>
          <ArrowLeft aria-hidden="true" size={21} />
        </Link>
      ) : (
        <Link aria-label={t('common.home')} className="ui-brand" to="/welcome">
          common
        </Link>
      )}
      <h1 className="ui-top-bar-title">{title}</h1>
      <div className="ui-top-bar-action">{action}</div>
    </header>
  )
}
