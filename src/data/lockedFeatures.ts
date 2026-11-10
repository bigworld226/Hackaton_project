export interface LockedFeature {
  id: string
  name: string
  description: string
  unlockRequirement: string
}

export const lockedFeatures: LockedFeature[] = [
  {
    id: 'live-streams',
    name: 'Lives de code',
    description: 'Lance un live de programmation avec ta communauté.',
    unlockRequirement: 'Atteins le niveau Créateur.',
  },
  {
    id: 'advanced-analytics',
    name: 'Statistiques avancées',
    description: 'Suis les vues et interactions de tes Reels et publications.',
    unlockRequirement: 'Publie 10 contenus.',
  },
  {
    id: 'custom-badges',
    name: 'Badges personnalisés',
    description: 'Affiche tes spécialités sur ton profil.',
    unlockRequirement: 'Débloque 5 badges de communauté.',
  },
]
