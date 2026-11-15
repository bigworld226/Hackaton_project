export interface Thread {
  id: string
  title: string
  body: string
  author: string
  city: string
  country: string
  tags: string[]
  replies: number
  views: number
  createdAt: string
}

export const threads: Thread[] = [
  {
    id: 'first-local-meetup',
    title: 'On organise un meetup frontend ce mois-ci ?',
    body: 'Qui serait partant pour une rencontre autour de React, CSS et des projets open source ?',
    author: 'Aïcha Diallo',
    city: 'Dakar',
    country: 'Sénégal',
    tags: ['meetup', 'frontend'],
    replies: 18,
    views: 327,
    createdAt: 'il y a 24 min',
  },
  {
    id: 'junior-code-review',
    title: 'Des volontaires pour une session de revue de code ?',
    body: 'Je cherche des devs du coin pour relire nos petits projets et échanger des conseils.',
    author: 'Malik Ndiaye',
    city: 'Dakar',
    country: 'Sénégal',
    tags: ['entraide', 'code-review'],
    replies: 12,
    views: 204,
    createdAt: 'il y a 1 h',
  },
  {
    id: 'fastapi-async-help',
    title: 'Besoin d’aide avec une route asynchrone FastAPI',
    body: 'Ma route bloque parfois quand plusieurs requêtes arrivent en même temps. Quelqu’un peut m’aider à comprendre ?',
    author: 'Samba Kane',
    city: 'Dakar',
    country: 'Sénégal',
    tags: ['python', 'fastapi', 'entraide'],
    replies: 8,
    views: 156,
    createdAt: 'il y a 2 h',
  },
  {
    id: 'open-source-dakar',
    title: 'Quels projets open source dakarois rejoindre ?',
    body: 'Je cherche un projet local pour contribuer le week-end et apprendre avec une équipe.',
    author: 'Mariam Ba',
    city: 'Dakar',
    country: 'Sénégal',
    tags: ['open-source', 'communauté'],
    replies: 14,
    views: 231,
    createdAt: 'il y a 3 h',
  },
  {
    id: 'best-learning-resources',
    title: 'Vos meilleures ressources pour apprendre TypeScript',
    body: 'Partageons nos docs, exercices et astuces préférés pour progresser ensemble.',
    author: 'Inès Moreau',
    city: 'Lyon',
    country: 'France',
    tags: ['typescript', 'apprentissage'],
    replies: 35,
    views: 712,
    createdAt: 'il y a 3 h',
  },
]

let communityThreads = [...threads]

export function getThreads() {
  return [...communityThreads]
}

export function getThreadById(id: string) {
  return communityThreads.find((thread) => thread.id === id)
}

export function addThread(input: Pick<Thread, 'title' | 'body' | 'author' | 'city' | 'country' | 'tags'>) {
  const thread: Thread = {
    ...input,
    id: `thread-${Date.now().toString(36)}`,
    replies: 0,
    views: 1,
    createdAt: 'à l’instant',
  }
  communityThreads = [thread, ...communityThreads]
  return thread
}
