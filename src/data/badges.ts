export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

export const badges: BadgeDefinition[] = [
  { id: 'first-post', name: 'Première astuce', description: 'Publie ton premier tip.', icon: 'sparkles', unlocked: true },
  { id: 'helpful', name: 'Coup de main', description: 'Aide cinq personnes dans les forums.', icon: 'heart-handshake', unlocked: true },
  { id: 'quiz-master', name: 'Quiz master', description: 'Obtiens trois scores parfaits.', icon: 'trophy', unlocked: false },
  { id: 'reel-maker', name: 'Créateur de Reels', description: 'Publie dix vidéos techniques.', icon: 'clapperboard', unlocked: false },
  { id: 'local-legend', name: 'Légende locale', description: 'Gagne 1 000 points dans ta ville.', icon: 'map-pin', unlocked: false },
]
