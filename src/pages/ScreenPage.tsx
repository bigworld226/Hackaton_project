import { Link } from 'react-router-dom'
import { ResponsiveLayout } from '@/layouts'
import { appScreens, type AppScreen } from './screens'

interface ScreenPageProps {
  screen: AppScreen
}

export function ScreenPage({ screen }: ScreenPageProps) {
  return <ResponsiveLayout title={screen.title}>{null}</ResponsiveLayout>
}

export function NotFoundPage() {
  const welcome = appScreens[0]

  return (
    <ResponsiveLayout title="Page introuvable">
      {welcome && (
        <p>
          <Link to={welcome.path}>Retour à l’accueil</Link>
        </p>
      )}
    </ResponsiveLayout>
  )
}
