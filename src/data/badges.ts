export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

export const badges: BadgeDefinition[] = [
  { id: 'first-post', name: 'Première publication', description: 'Publie ton premier contenu.', icon: 'sparkles', unlocked: true },
  { id: 'helpful', name: 'Coup de main', description: 'Aide cinq personnes dans les forums.', icon: 'heart-handshake', unlocked: true },
  { id: 'quiz-master', name: 'Quiz master', description: 'Obtiens trois scores parfaits.', icon: 'trophy', unlocked: false },
  { id: 'room-host', name: 'Hôte de Coding Rooms', description: 'Anime dix sessions de code en direct.', icon: 'code', unlocked: false },
  { id: 'local-legend', name: 'Légende locale', description: 'Gagne 1 000 points dans ta ville.', icon: 'map-pin', unlocked: false },
]
