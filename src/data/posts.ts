export interface Post {
  id: string
  kind: 'reel' | 'tip'
  author: {
    name: string
    handle: string
    role: string
  }
  city: string
  createdAt: string
  caption: string
  tags: string[]
  likes: number
  replies: number
}

export const posts: Post[] = [
  {
    id: 'reel-css-grid',
    kind: 'reel',
    author: { name: 'Aïcha Diallo', handle: '@aicha.codes', role: 'Frontend dev' },
    city: 'Dakar',
    createdAt: 'il y a 18 min',
    caption: 'Une grille responsive en 20 secondes. Plus besoin de calculer les colonnes à la main.',
    tags: ['css', 'frontend', 'webdev'],
    likes: 284,
    replies: 32,
  },
  {
    id: 'tip-git-restore',
    kind: 'tip',
    author: { name: 'Malik Ndiaye', handle: '@malikbuilds', role: 'Full-stack dev' },
    city: 'Paris',
    createdAt: 'il y a 42 min',
    caption: 'Astuce Git : `git restore --staged fichier` retire un fichier du prochain commit sans perdre tes modifications.',
    tags: ['git', 'productivity'],
    likes: 146,
    replies: 19,
  },
  {
    id: 'reel-debug-console',
    kind: 'reel',
    author: { name: 'Inès Moreau', handle: '@ines.dev', role: 'Développeuse React' },
    city: 'Lyon',
    createdAt: 'il y a 1 h',
    caption: 'Trois commandes de console qui me font gagner du temps quand je débug une interface.',
    tags: ['javascript', 'debug', 'react'],
    likes: 391,
    replies: 47,
  },
  {
    id: 'tip-api-errors',
    kind: 'tip',
    author: { name: 'João Costa', handle: '@joaocodes', role: 'Backend dev' },
    city: 'Lisbonne',
    createdAt: 'il y a 2 h',
    caption: 'Retourne des erreurs API prévisibles : même structure, code HTTP explicite et un message exploitable côté client.',
    tags: ['api', 'backend', 'architecture'],
    likes: 203,
    replies: 28,
  },
]
