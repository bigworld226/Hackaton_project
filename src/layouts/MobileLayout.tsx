import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNav, FeedSwitcher, TopBar } from '@/components'

interface MobileLayoutProps {
  children: ReactNode
  title?: string
}

export function MobileLayout({ children, title = 'Votre communauté' }: MobileLayoutProps) {
  const { pathname } = useLocation()
  const isReels = pathname === '/home/reels'

  if (isReels) {
    return (
      <div className="ui-layout ui-layout--mobile ui-layout--reels">
        <FeedSwitcher />
        <main className="ui-page-content">{children}</main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="ui-layout ui-layout--mobile">
      <TopBar title={title} />
      <FeedSwitcher />
      <main className="ui-page-content">{children}</main>
      <BottomNav />
    </div>
  )
}
