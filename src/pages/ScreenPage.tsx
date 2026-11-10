import { Link } from 'react-router-dom'
import { ResponsiveLayout } from '@/layouts'
import { appScreens, type AppScreen } from './screens'
import { PlacePage } from './onboarding/PlacePage'
import { SignupPage } from './onboarding/SignupPage'
import { WelcomePage } from './onboarding/WelcomePage'
import {
  CreatePage,
  ReelsPage,
  TweetRepliesPage,
  TweetsPage,
} from './social/SocialPages'
import {
  CountriesPage,
  ForumScopePage,
  ForumsPage,
  NewThreadPage,
  ThreadDetailPage,
} from './community/CommunityPages'

interface ScreenPageProps {
  screen: AppScreen
}

export function ScreenPage({ screen }: ScreenPageProps) {
  if (screen.path === '/welcome') return <WelcomePage />
  if (screen.path === '/place') return <PlacePage />
  if (screen.path === '/signup') return <SignupPage />
  if (screen.path === '/home/reels') return <ReelsPage />
  if (screen.path === '/home/tweets') return <TweetsPage />
  if (screen.path === '/tweets/:id') return <TweetRepliesPage />
  if (screen.path === '/create') return <CreatePage />
  if (screen.path === '/forums') return <ForumsPage />
  if (screen.path === '/forums/city') return <ForumScopePage scope="city" />
  if (screen.path === '/forums/country') return <ForumScopePage scope="country" />
  if (screen.path === '/countries') return <CountriesPage />
  if (screen.path === '/threads/:id') return <ThreadDetailPage />
  if (screen.path === '/threads/new') return <NewThreadPage />

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
