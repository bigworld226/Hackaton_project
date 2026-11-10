import { CircleHelp } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export function FeedSwitcher() {
  const { pathname } = useLocation()
  if (pathname !== '/home/reels' && pathname !== '/home/tweets') return null

  return (
    <nav aria-label="Fil d’actualité" className="ui-feed-switcher">
      <NavLink
        className={({ isActive }) =>
          `ui-feed-tab${isActive ? ' ui-feed-tab--active' : ''}`
        }
        to="/home/reels"
      >
        Reels
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `ui-feed-tab${isActive ? ' ui-feed-tab--active' : ''}`
        }
        to="/home/tweets"
      >
        Publications
      </NavLink>
      <Link
        aria-label="Ouvrir les quiz"
        className="ui-feed-quiz-action"
        to="/quiz"
      >
        <CircleHelp aria-hidden="true" size={23} strokeWidth={1.8} />
        <span>Quiz</span>
      </Link>
    </nav>
  )
}
