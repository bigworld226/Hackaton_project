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
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { FeedSwitcher, TopBar } from '@/components'

interface WebLayoutProps {
  children: ReactNode
  title?: string
}

export function WebLayout({ children, title = 'Votre communauté' }: WebLayoutProps) {
  const { t } = useTranslation()
  const navigationItems = [
    { end: true, href: '/home/reels', icon: House, label: t('nav.reels') },
    { end: true, href: '/home/tweets', icon: MessageCircle, label: t('nav.posts') },
    { href: '/forums', icon: MessageCircle, label: t('nav.forums') },
    { href: '/quiz', icon: CircleHelp, label: t('nav.quiz') },
    { href: '/notifications', icon: Bell, label: t('nav.notifications') },
    { href: '/messages', icon: MessageCircle, label: t('nav.messages') },
    { href: '/profile', icon: UserRound, label: t('nav.profile') },
    { href: '/settings', icon: Settings, label: t('nav.settings') },
  ]

  return (
    <div className="ui-layout ui-layout--web">
      <aside className="ui-sidebar">
        <NavLink className="ui-sidebar-brand" to="/home/reels">
          common
        </NavLink>
        <nav aria-label={t('nav.main')} className="ui-sidebar-nav">
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
          <span>{t('nav.create')}</span>
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
