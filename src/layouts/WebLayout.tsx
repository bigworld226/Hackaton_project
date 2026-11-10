import {
  Bell,
  CircleHelp,
  House,
  MessageCircle,
  Settings,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { TopBar } from '@/components'

const navigationItems = [
  { href: '/home/reels', icon: House, label: 'Accueil' },
  { href: '/forums', icon: MessageCircle, label: 'Forums' },
  { href: '/quiz', icon: CircleHelp, label: 'Quiz' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
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
        <a className="ui-sidebar-brand" href="/">
          common
        </a>
        <nav aria-label="Navigation principale" className="ui-sidebar-nav">
          {navigationItems.map(({ href, icon: Icon, label }) => (
            <a className="ui-sidebar-link" href={href} key={href}>
              <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </aside>
      <div className="ui-web-main">
        <TopBar title={title} />
        <main className="ui-page-content">{children}</main>
      </div>
    </div>
  )
}
