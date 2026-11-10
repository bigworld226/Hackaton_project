import {
  Bell,
  CircleHelp,
  House,
  MessageCircle,
  Plus,
  Settings,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { FeedSwitcher, TopBar } from '@/components'

const navigationItems = [
  { end: true, href: '/home/reels', icon: House, label: 'Reels' },
  { end: true, href: '/home/tweets', icon: MessageCircle, label: 'Publications' },
  { href: '/forums', icon: MessageCircle, label: 'Forums' },
  { href: '/quiz', icon: CircleHelp, label: 'Quiz' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/profile', icon: UserRound, label: 'Profil' },
  { href: '/settings', icon: Settings, label: 'Réglages' },
]

interface WebLayoutProps {
  children: ReactNode
  title?: string
}

export function WebLayout({ children, title = 'Votre communauté' }: WebLayoutProps) {
  return (
    <div className="ui-layout ui-layout--web">
      <aside className="ui-sidebar">
        <NavLink className="ui-sidebar-brand" to="/home/reels">
          common
        </NavLink>
        <nav aria-label="Navigation principale" className="ui-sidebar-nav">
          {navigationItems.map(({ end, href, icon: Icon, label }) => (
            <NavLink
              className={({ isActive }) =>
                `ui-sidebar-link${isActive ? ' ui-sidebar-link--active' : ''}`
              }
              end={end}
              key={href}
              to={href}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink className="ui-sidebar-create" to="/create">
          <Plus aria-hidden="true" size={20} strokeWidth={1.8} />
          <span>Créer</span>
        </NavLink>
      </aside>
      <div className="ui-web-main">
        <TopBar title={title} />
        <FeedSwitcher />
        <main className="ui-page-content">{children}</main>
      </div>
    </div>
  )
}
