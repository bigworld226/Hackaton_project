import {
  Bell,
  CircleHelp,
  House,
  MessageCircle,
  Plus,
  UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigationItems = [
  { href: '/home/reels', icon: House, label: 'Reels' },
  { href: '/forums', icon: MessageCircle, label: 'Forums' },
  { href: '/quiz', icon: CircleHelp, label: 'Quiz' },
  { href: '/notifications', icon: Bell, label: 'Alertes' },
  { href: '/profile', icon: UserRound, label: 'Profil' },
]

export function BottomNav() {
  return (
    <nav aria-label="Navigation principale" className="ui-bottom-nav">
      {navigationItems.map(({ href, icon: Icon, label }) => (
        <NavLink
          className={({ isActive }) =>
            `ui-nav-link${isActive ? ' ui-nav-link--active' : ''}`
          }
          end={href === '/profile'}
          key={href}
          to={href}
        >
          <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
          <span>{label}</span>
        </NavLink>
      ))}
      <NavLink
        aria-label="Créer"
        className="ui-create-action"
        to="/create"
      >
        <Plus aria-hidden="true" size={23} />
      </NavLink>
    </nav>
  )
}
