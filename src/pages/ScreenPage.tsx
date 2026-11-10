import { Link } from 'react-router-dom'
import { ResponsiveLayout } from '@/layouts'
import { appScreens, type AppScreen } from './screens'
import { PlacePage } from './onboarding/PlacePage'
import { SignupPage } from './onboarding/SignupPage'
import { WelcomePage } from './onboarding/WelcomePage'

interface ScreenPageProps {
  screen: AppScreen
}

export function ScreenPage({ screen }: ScreenPageProps) {
  if (screen.path === '/welcome') return <WelcomePage />
  if (screen.path === '/place') return <PlacePage />
  if (screen.path === '/signup') return <SignupPage />

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
