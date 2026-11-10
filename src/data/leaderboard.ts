export interface LeaderboardEntry {
  rank: number
  name: string
  handle: string
  city: string
  points: number
  badge: string
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Aïcha Diallo', handle: '@aicha.codes', city: 'Dakar', points: 2480, badge: 'Mentore' },
  { rank: 2, name: 'Inès Moreau', handle: '@ines.dev', city: 'Lyon', points: 2215, badge: 'Créatrice' },
  { rank: 3, name: 'Malik Ndiaye', handle: '@malikbuilds', city: 'Paris', points: 1980, badge: 'Explorateur' },
  { rank: 4, name: 'João Costa', handle: '@joaocodes', city: 'Lisbonne', points: 1740, badge: 'Régulier' },
  { rank: 5, name: 'Fatou Diop', handle: '@fatou.codes', city: 'Dakar', points: 1525, badge: 'Régulier' },
]
