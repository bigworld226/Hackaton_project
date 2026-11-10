import { CircleHelp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BottomNav, FeedSwitcher, TopBar } from '@/components'

interface MobileLayoutProps {
  children: ReactNode
  title?: string
}

export function MobileLayout({ children, title = 'Votre communauté' }: MobileLayoutProps) {
  const { pathname } = useLocation()
  const showQuizAction = pathname === '/home/reels' || pathname === '/home/tweets'

  return (
    <div className="ui-layout ui-layout--mobile">
      <TopBar
        action={showQuizAction ? (
          <Link
            aria-label="Ouvrir les quiz"
            className="ui-quiz-action"
            title="Quiz dev"
            to="/quiz"
          >
            <CircleHelp aria-hidden="true" size={23} strokeWidth={1.8} />
          </Link>
        ) : undefined}
        title={title}
      />
      <FeedSwitcher />
      <main className="ui-page-content">{children}</main>
      <BottomNav />
    </div>
  )
}
