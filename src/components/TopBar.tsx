import { ArrowLeft, Map } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const DeveloperMapModal = lazy(() => import('@/pages/map/DeveloperMap').then((module) => ({
  default: module.DeveloperMapModal,
})))

interface TopBarProps {
  action?: ReactNode
  backHref?: string
  title: string
}

export function TopBar({ action, backHref, title }: TopBarProps) {
  const { t } = useTranslation()
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <>
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
        <div className="ui-top-bar-action">
          {action}
          <button
            aria-label={t('map.open')}
            className="ui-icon-button ui-map-action"
            onClick={() => setMapOpen(true)}
            title={t('map.open')}
            type="button"
          >
            <Map aria-hidden="true" size={21} />
          </button>
        </div>
      </header>
      {mapOpen && (
        <Suspense fallback={null}>
          <DeveloperMapModal onClose={() => setMapOpen(false)} open={mapOpen} />
        </Suspense>
      )}
    </>
  )
}
