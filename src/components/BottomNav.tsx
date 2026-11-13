import {
  Bell,
  Code2,
  MessageCircle,
  Plus,
  UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export function BottomNav() {
  const { t } = useTranslation()
  const navigationItems = [
    { href: '/coding-rooms', icon: Code2, label: t('nav.codingRooms') },
    { href: '/forums', icon: MessageCircle, label: t('nav.forums') },
    { href: '/notifications', icon: Bell, label: t('nav.notifications') },
    { href: '/profile', icon: UserRound, label: t('nav.profile') },
  ]

  return (
    <nav aria-label={t('nav.main')} className="ui-bottom-nav">
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
        aria-label={t('nav.create')}
        className="ui-create-action"
        to="/create"
      >
        <Plus aria-hidden="true" size={23} />
      </NavLink>
    </nav>
  )
}
