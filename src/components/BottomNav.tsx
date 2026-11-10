import {
  Bell,
  CircleHelp,
  House,
  MessageCircle,
  Plus,
  UserRound,
} from 'lucide-react'

const navigationItems = [
  { href: '/home/reels', icon: House, label: 'Accueil' },
  { href: '/forums', icon: MessageCircle, label: 'Forums' },
  { href: '/quiz', icon: CircleHelp, label: 'Quiz' },
  { href: '/notifications', icon: Bell, label: 'Alertes' },
  { href: '/profile', icon: UserRound, label: 'Profil' },
]

export function BottomNav() {
  return (
    <nav aria-label="Navigation principale" className="ui-bottom-nav">
      {navigationItems.map(({ href, icon: Icon, label }) => (
        <a className="ui-nav-link" href={href} key={href}>
          <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
          <span>{label}</span>
        </a>
      ))}
      <a aria-label="Créer" className="ui-create-action" href="/create">
        <Plus aria-hidden="true" size={23} />
      </a>
    </nav>
  )
}
