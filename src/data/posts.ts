export interface Post {
  id: string
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
    id: 'tip-git-restore',
    author: { name: 'Malik Ndiaye', handle: '@malikbuilds', role: 'Full-stack dev' },
    city: 'Paris',
    createdAt: 'il y a 42 min',
    caption: 'Astuce Git : `git restore --staged fichier` retire un fichier du prochain commit sans perdre tes modifications.',
    tags: ['git', 'productivity'],
    likes: 146,
    replies: 19,
  },
  {
    id: 'tip-api-errors',
    author: { name: 'João Costa', handle: '@joaocodes', role: 'Backend dev' },
    city: 'Lisbonne',
    createdAt: 'il y a 2 h',
    caption: 'Retourne des erreurs API prévisibles : même structure, code HTTP explicite et un message exploitable côté client.',
    tags: ['api', 'backend', 'architecture'],
    likes: 203,
    replies: 28,
  },
]
