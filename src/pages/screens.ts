export interface AppScreen {
  path: string
  title: string
  navLabel?: string
  section: 'Compte' | 'Accueil' | 'Communauté' | 'Quiz' | 'Profil'
}

export const appScreens: AppScreen[] = [
  { path: '/welcome', title: 'Bienvenue', section: 'Compte' },
  { path: '/place', title: 'Ta ville', section: 'Compte' },
  { path: '/signup', title: 'Créer un compte', section: 'Compte' },
  { path: '/home/reels', title: 'Reels', navLabel: 'Reels', section: 'Accueil' },
  { path: '/home/tweets', title: 'Tips', navLabel: 'Tips', section: 'Accueil' },
  { path: '/tweets/:id', title: 'Réponses aux tips', section: 'Accueil' },
  { path: '/create', title: 'Créer une publication', navLabel: 'Créer', section: 'Accueil' },
  { path: '/forums', title: 'Forums', navLabel: 'Forums', section: 'Communauté' },
  { path: '/forums/city', title: 'Forum de ta ville', section: 'Communauté' },
  { path: '/forums/country', title: 'Forum du pays', section: 'Communauté' },
  { path: '/countries', title: 'Explorer les pays', section: 'Communauté' },
  { path: '/threads/:id', title: 'Discussion', section: 'Communauté' },
  { path: '/threads/new', title: 'Nouvelle discussion', section: 'Communauté' },
  { path: '/quiz', title: 'Quiz dev', navLabel: 'Quiz', section: 'Quiz' },
  { path: '/quiz/mine', title: 'Mes quiz', section: 'Quiz' },
  { path: '/quiz/:id', title: 'Détails du quiz', section: 'Quiz' },
  { path: '/quiz/editor', title: 'Éditeur de questions', section: 'Quiz' },
  { path: '/quiz/preview', title: 'Aperçu du quiz', section: 'Quiz' },
  { path: '/quiz/play', title: 'Jouer au quiz', section: 'Quiz' },
  { path: '/quiz/results', title: 'Résultats du quiz', section: 'Quiz' },
  { path: '/profile', title: 'Profil', navLabel: 'Profil', section: 'Profil' },
  { path: '/leaderboard', title: 'Classement', section: 'Profil' },
  { path: '/notifications', title: 'Notifications', navLabel: 'Alertes', section: 'Profil' },
  { path: '/messages', title: 'Messages', navLabel: 'Messages', section: 'Profil' },
  { path: '/messages/:id', title: 'Conversation', section: 'Profil' },
  { path: '/settings', title: 'Réglages', navLabel: 'Réglages', section: 'Profil' },
  { path: '/settings/privacy', title: 'Confidentialité', section: 'Profil' },
  { path: '/settings/city', title: 'Changer de ville', section: 'Profil' },
]
