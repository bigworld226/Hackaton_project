export interface LeaderboardEntry {
  rank: number
  name: string
  handle: string
  city: string
  points: number
  badge: string
}

export interface MonthlyLeaderboardEntry extends LeaderboardEntry {
  techScore: number
  publicVotes: number
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Aïcha Diallo', handle: '@aicha.codes', city: 'Dakar', points: 2480, badge: 'Mentore' },
  { rank: 2, name: 'Inès Moreau', handle: '@ines.dev', city: 'Lyon', points: 2215, badge: 'Créatrice' },
  { rank: 3, name: 'Malik Ndiaye', handle: '@malikbuilds', city: 'Paris', points: 1980, badge: 'Explorateur' },
  { rank: 4, name: 'João Costa', handle: '@joaocodes', city: 'Lisbonne', points: 1740, badge: 'Régulier' },
  { rank: 5, name: 'Fatou Diop', handle: '@fatou.codes', city: 'Dakar', points: 1525, badge: 'Régulier' },
]

export const monthlyLeaderboard: MonthlyLeaderboardEntry[] = [
  { rank: 1, name: 'Aïcha Diallo', handle: '@aicha.codes', city: 'Dakar', points: 1200, badge: 'Championne locale', techScore: 95, publicVotes: 60 },
  { rank: 2, name: 'Malik Ndiaye', handle: '@malik.dev', city: 'Dakar', points: 1150, badge: 'Champion local', techScore: 88, publicVotes: 75 },
  { rank: 3, name: 'Inès Moreau', handle: '@ines.moreau', city: 'Dakar', points: 1100, badge: 'Championne locale', techScore: 92, publicVotes: 50 },
  { rank: 4, name: 'Fatou Diop', handle: '@fatou.codes', city: 'Dakar', points: 980, badge: 'Mentore', techScore: 90, publicVotes: 42 },
  { rank: 5, name: 'Samba Kane', handle: '@samba.builds', city: 'Dakar', points: 910, badge: 'Créateur', techScore: 86, publicVotes: 38 },
  { rank: 6, name: 'Mariam Ba', handle: '@mariam.codes', city: 'Dakar', points: 850, badge: 'Régulière', techScore: 84, publicVotes: 34 },
  { rank: 7, name: 'Ibrahima Fall', handle: '@ibrahima.dev', city: 'Dakar', points: 790, badge: 'Explorateur', techScore: 81, publicVotes: 29 },
  { rank: 8, name: 'Awa Ndiaye', handle: '@awa.codes', city: 'Dakar', points: 730, badge: 'Régulière', techScore: 78, publicVotes: 24 },
  { rank: 9, name: 'Cheikh Sarr', handle: '@cheikh.builds', city: 'Dakar', points: 680, badge: 'Créateur', techScore: 76, publicVotes: 21 },
  { rank: 10, name: 'Ndeye Sow', handle: '@ndeye.dev', city: 'Dakar', points: 620, badge: 'Exploratrice', techScore: 73, publicVotes: 18 },
]

export const globalChampion: LeaderboardEntry = {
  rank: 1,
  name: 'Aïcha Diallo',
  handle: '@aicha.codes',
  city: 'Dakar',
  points: 12840,
  badge: 'Championne mondiale',
}
