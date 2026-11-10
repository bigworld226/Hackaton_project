import type { ReactNode } from 'react'
import { BottomNav, TopBar } from '@/components'

interface MobileLayoutProps {
  children: ReactNode
  title?: string
}

export function MobileLayout({ children, title = 'Votre communauté' }: MobileLayoutProps) {
  return (
    <div className="ui-layout ui-layout--mobile">
      <TopBar title={title} />
      <main className="ui-page-content">{children}</main>
      <BottomNav />
    </div>
  )
}
