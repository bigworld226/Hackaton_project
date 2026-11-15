export interface NearbyDeveloper {
  id: string
  name: string
  handle: string
  initials: string
  latitude: number
  longitude: number
  city: string
  languages: string[]
  points: number
  bio: string
}

export const nearbyDevelopers: NearbyDeveloper[] = [
  {
    id: 'aicha-diallo',
    name: 'Aïcha Diallo',
    handle: '@aicha.codes',
    initials: 'AD',
    latitude: 14.7208,
    longitude: -17.4532,
    city: 'Dakar',
    languages: ['React', 'TypeScript', 'CSS'],
    points: 1200,
    bio: 'Développeuse frontend, passionnée par les interfaces accessibles et les projets open source.',
  },
  {
    id: 'malik-ndiaye',
    name: 'Malik Ndiaye',
    handle: '@malik.dev',
    initials: 'MN',
    latitude: 14.7074,
    longitude: -17.4671,
    city: 'Dakar',
    languages: ['Python', 'FastAPI', 'PostgreSQL'],
    points: 1150,
    bio: 'Développeur backend. J’aime rendre les API rapides, lisibles et fiables.',
  },
  {
    id: 'ines-moreau',
    name: 'Inès Moreau',
    handle: '@ines.moreau',
    initials: 'IM',
    latitude: 14.7316,
    longitude: -17.4739,
    city: 'Dakar',
    languages: ['JavaScript', 'React', 'Node.js'],
    points: 1100,
    bio: 'Développeuse JavaScript, curieuse de design systems et de collaboration.',
  },
  {
    id: 'fatou-diop',
    name: 'Fatou Diop',
    handle: '@fatou.codes',
    initials: 'FD',
    latitude: 14.6958,
    longitude: -17.4384,
    city: 'Dakar',
    languages: ['Python', 'Django', 'SQL'],
    points: 980,
    bio: 'Développeuse et mentore, je partage mes découvertes autour de Python.',
  },
  {
    id: 'samba-kane',
    name: 'Samba Kane',
    handle: '@samba.builds',
    initials: 'SK',
    latitude: 14.7009,
    longitude: -17.4935,
    city: 'Dakar',
    languages: ['TypeScript', 'Vue', 'Node.js'],
    points: 910,
    bio: 'Développeur full-stack, toujours partant pour construire quelque chose ensemble.',
  },
  {
    id: 'mariam-ba',
    name: 'Mariam Ba',
    handle: '@mariam.codes',
    initials: 'MB',
    latitude: 14.7392,
    longitude: -17.4467,
    city: 'Dakar',
    languages: ['Java', 'Spring', 'Docker'],
    points: 850,
    bio: 'Développeuse Java intéressée par le cloud et les communautés tech locales.',
  },
]

export function getNearbyDeveloperById(id: string) {
  return nearbyDevelopers.find((developer) => developer.id === id)
}
