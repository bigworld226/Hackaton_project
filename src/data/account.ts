import { badges } from './badges'
import { leaderboard } from './leaderboard'

export interface CommunityNotification {
  id: string
  kind: 'like' | 'reply' | 'follow' | 'quiz'
  actor: string
  message: string
  target: string
  createdAt: string
  read: boolean
}

export interface DirectMessage {
  id: string
  author: 'Maya Santos' | 'Malik Ndiaye' | 'Aïcha Diallo' | 'Toi'
  text: string
  createdAt: string
}

export interface Conversation {
  id: string
  name: string
  handle: string
  city: string
  lastActive: string
  messages: DirectMessage[]
}

export interface ProfileDetails {
  name: string
  handle: string
  bio: string
}

const initialNotifications: CommunityNotification[] = [
  { id: 'notice-1', kind: 'reply', actor: 'Malik Ndiaye', message: 'a répondu à ta discussion sur React', target: '/forums', createdAt: 'Il y a 12 min', read: false },
  { id: 'notice-2', kind: 'like', actor: 'Inès Moreau', message: 'a aimé ta publication', target: '/home/tweets', createdAt: 'Il y a 45 min', read: false },
  { id: 'notice-3', kind: 'follow', actor: 'Fatou Diop', message: 'a commencé à te suivre', target: '/profile', createdAt: 'Il y a 2 h', read: true },
  { id: 'notice-4', kind: 'quiz', actor: 'Nouveau badge débloqué', message: 'Tu as obtenu « Première publication »', target: '/profile', createdAt: 'Hier', read: true },
]

const initialConversations: Conversation[] = [
  {
    id: 'maya-santos',
    name: 'Maya Santos',
    handle: '@maya.codes',
    city: 'Lisbonne',
    lastActive: 'En ligne',
    messages: [
      { id: 'm1', author: 'Maya Santos', text: 'Salut ! J’ai vu ton Reel sur les grilles CSS, très clair 👏', createdAt: '10:24' },
      { id: 'm2', author: 'Toi', text: 'Merci ! Je prépare une suite avec quelques mises en page réelles.', createdAt: '10:27' },
      { id: 'm3', author: 'Maya Santos', text: 'Génial, je serais ravie de tester ça. Tu utilises quoi pour enregistrer ton écran ?', createdAt: '10:31' },
    ],
  },
  {
    id: 'malik-ndiaye',
    name: 'Malik Ndiaye',
    handle: '@malikbuilds',
    city: 'Dakar',
    lastActive: 'Actif récemment',
    messages: [
      { id: 'm4', author: 'Malik Ndiaye', text: 'On garde la session de code review pour samedi ?', createdAt: 'Hier' },
    ],
  },
  {
    id: 'aicha-diallo',
    name: 'Aïcha Diallo',
    handle: '@aicha.codes',
    city: 'Dakar',
    lastActive: 'Active il y a 1 h',
    messages: [
      { id: 'm5', author: 'Aïcha Diallo', text: 'Je t’ai envoyé les ressources pour le meetup frontend.', createdAt: 'Lun.' },
    ],
  },
]

function readStorage<T>(key: string, initialValue: T): T {
  const serialized = window.localStorage.getItem(key)
  if (!serialized) return initialValue

  try {
    return JSON.parse(serialized) as T
  } catch (error) {
    console.error(`Impossible de lire les données enregistrées (${key}).`, error)
    return initialValue
  }
}

function writeStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getNotifications() {
  return readStorage('common-notifications', initialNotifications)
}

export function markNotificationRead(id: string) {
  const next = getNotifications().map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  )
  writeStorage('common-notifications', next)
  return next
}

export function markAllNotificationsRead() {
  const next = getNotifications().map((notification) => ({ ...notification, read: true }))
  writeStorage('common-notifications', next)
  return next
}

export function getConversations() {
  return readStorage('common-conversations', initialConversations)
}

export function getConversation(id: string) {
  return getConversations().find((conversation) => conversation.id === id)
}

export function sendDirectMessage(conversationId: string, text: string) {
  const cleanText = text.trim()
  if (!cleanText) return null

  const conversations = getConversations()
  const conversation = conversations.find((item) => item.id === conversationId)
  if (!conversation) return null

  const message: DirectMessage = {
    id: `message-${Date.now().toString(36)}`,
    author: 'Toi',
    text: cleanText,
    createdAt: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
  }
  const next = conversations.map((item) =>
    item.id === conversationId ? { ...item, messages: [...item.messages, message] } : item,
  )
  writeStorage('common-conversations', next)
  return message
}

export function getProfileSummary() {
  const savedProfile = readStorage<ProfileDetails | null>('common-profile', null)
  return {
    name: savedProfile?.name ?? 'Alex Morgan',
    handle: savedProfile?.handle ?? '@alex.codes',
    city: window.localStorage.getItem('common-city') ?? 'Accra',
    countryCode: window.localStorage.getItem('common-country') ?? 'GH',
    bio: savedProfile?.bio ?? 'Développeur·se frontend | React, CSS & open source. Je partage ce que j’apprends en construisant.',
    followers: 1284,
    following: 362,
    reels: 18,
    posts: 34,
    points: 860,
    badges: badges.map((badge) => ({ ...badge })),
    ranking: leaderboard,
  }
}

export function saveProfileDetails(details: ProfileDetails) {
  writeStorage('common-profile', details)
}
