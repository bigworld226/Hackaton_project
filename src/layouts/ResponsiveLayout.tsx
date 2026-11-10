import type { ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileLayout } from './MobileLayout'
import { WebLayout } from './WebLayout'

interface ResponsiveLayoutProps {
  children: ReactNode
  title?: string
}

export function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
  const isWeb = useMediaQuery('(min-width: 768px)')

  return isWeb ? (
    <WebLayout title={title}>{children}</WebLayout>
  ) : (
    <MobileLayout title={title}>{children}</MobileLayout>
  )
}
