import { NavLink, useLocation } from 'react-router-dom'

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
    </nav>
  )
}
