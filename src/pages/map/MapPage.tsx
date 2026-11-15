import { ResponsiveLayout } from '@/layouts'
import { useTranslation } from 'react-i18next'
import { NearbyDevelopersMap } from './DeveloperMap'

export function MapPage() {
  const { t } = useTranslation()

  return (
    <ResponsiveLayout title={t('map.title')}>
      <NearbyDevelopersMap />
    </ResponsiveLayout>
  )
}
