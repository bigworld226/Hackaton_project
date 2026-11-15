import type { ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileLayout } from './MobileLayout'
import { WebLayout } from './WebLayout'
import { useState, useEffect } from 'react'
import  DevBadgeToast   from '../pages/bot/bot' 
interface ResponsiveLayoutProps {
  children: ReactNode
  title?: string
}


interface ResponsiveLayoutProps {
  children: ReactNode
  title?: string
}

export function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
  const isWeb = useMediaQuery('(min-width: 768px)')
  
  // Initialisation de l'état via le localStorage pour attraper le badge post-redirection
  const [activeBadge, setActiveBadge] = useState<string | null>(() => {
    const badgeToTrigger = localStorage.getItem('trigger_badge_toast');
    if (badgeToTrigger) {
      localStorage.removeItem('trigger_badge_toast');
      return badgeToTrigger;
    }
    return null;
  });

  return (
    <>
      {isWeb ? (
        <WebLayout title={title}>{children}</WebLayout>
      ) : (
        <MobileLayout title={title}>{children}</MobileLayout>
      )}

      {/* Le robot flottant s'affiche si un badge est actif */}
      {activeBadge && (
        <DevBadgeToast 
          badgeName={activeBadge} 
          onClose={() => setActiveBadge(null)} 
        />
      )}
    </>
  )
}

// export function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
//   const isWeb = useMediaQuery('(min-width: 768px)')

//   return isWeb ? (
//     <WebLayout title={title}>{children}</WebLayout>
//   ) : (
//     <MobileLayout title={title}>{children}</MobileLayout>
//   )
// }
