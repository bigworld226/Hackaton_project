export interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé'
  questionCount: number
  durationMinutes: number
  plays: number
  author: string
}

export const quizzes: Quiz[] = [
  {
    id: 'javascript-fundamentals',
    title: 'Les bases de JavaScript',
    description: 'Variables, fonctions, tableaux et objets.',
    topic: 'JavaScript',
    difficulty: 'Débutant',
    questionCount: 10,
    durationMinutes: 5,
    plays: 1240,
    author: 'Inès Moreau',
  },
  {
    id: 'css-layouts',
    title: 'Flexbox ou Grid ?',
    description: 'Choisis le bon outil pour chaque mise en page.',
    topic: 'CSS',
    difficulty: 'Intermédiaire',
    questionCount: 12,
    durationMinutes: 8,
    plays: 846,
    author: 'Aïcha Diallo',
  },
  {
    id: 'git-advanced',
    title: 'Git sans peur',
    description: 'Branches, rebase et résolution de conflits.',
    topic: 'Git',
    difficulty: 'Avancé',
    questionCount: 15,
    durationMinutes: 10,
    plays: 592,
    author: 'Malik Ndiaye',
  },
]
