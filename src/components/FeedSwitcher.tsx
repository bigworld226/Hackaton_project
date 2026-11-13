import { CircleHelp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'

export function FeedSwitcher() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  if (pathname !== '/coding-rooms' && pathname !== '/home/tweets') return null

  return (
    <nav aria-label={t('nav.feed')} className="ui-feed-switcher">
      <NavLink
        className={({ isActive }) =>
          `ui-feed-tab${isActive ? ' ui-feed-tab--active' : ''}`
        }
        to="/coding-rooms"
      >
        {t('nav.codingRooms')}
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `ui-feed-tab${isActive ? ' ui-feed-tab--active' : ''}`
        }
        to="/home/tweets"
      >
        {t('nav.posts')}
      </NavLink>
      <Link
        aria-label={t('nav.quiz')}
        className="ui-feed-quiz-action"
        to="/quiz"
      >
        <CircleHelp aria-hidden="true" size={23} strokeWidth={1.8} />
        <span>{t('nav.quiz')}</span>
      </Link>
    </nav>
  )
}
