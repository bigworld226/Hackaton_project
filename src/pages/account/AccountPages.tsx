import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  Heart,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Pencil,
  Send,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Badge, Button, EmptyState, Input, Tabs } from '@/components'
import {
  getConversation,
  getConversations,
  getNotifications,
  getProfileSummary,
  markAllNotificationsRead,
  markNotificationRead,
  saveProfileDetails,
  sendDirectMessage,
} from '@/data/account'
import { countries, getCountryName } from '@/data/countries'
import { getPublicProfile, type PublicProfile } from '@/services/map'
import { useTheme, type ThemeMode } from '@/hooks/useTheme'
import { ResponsiveLayout } from '@/layouts'
import { useAuth } from '@/hooks/AuthProvider'

const badgeIcons = {
  sparkles: Sparkles,
  'heart-handshake': HeartHandshake,
  trophy: Trophy,
  code: Code2,
  'map-pin': MapPin,
} as const

const notificationIcons = {
  like: Heart,
  reply: MessageCircle,
  follow: UsersRound,
  quiz: Trophy,
} as const

export function PublicDeveloperProfilePage() {
  const { developerId = '' } = useParams()
  const { t } = useTranslation()
  const [developer, setDeveloper] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    void getPublicProfile(developerId)
      .then((profile) => {
        if (active) setDeveloper(profile)
      })
      .catch((error: unknown) => {
        console.error('Unable to load public developer profile.', error)
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [developerId])

  if (loading) {
    return <ResponsiveLayout title={t('map.profileTitle')}><p>{t('common.loading')}</p></ResponsiveLayout>
  }

  if (loadError || !developer) {
    return (
      <ResponsiveLayout title={t('map.profileTitle')}>
        <EmptyState
          action={<Link className="community-text-link" to="/map">{t('map.backToMap')}</Link>}
          description={t('map.profileNotFoundDescription')}
          title={t('map.profileNotFound')}
        />
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title={developer.display_name}>
      <div className="account-page">
        <Link className="account-back-link" to="/map">{t('map.backToMap')}</Link>
        <section className="account-profile-card">
          <div className="account-profile-cover" />
          <div className="account-profile-main">
            <div aria-hidden="true" className="account-avatar">{developer.display_name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase()}</div>
            <h2>{developer.display_name}</h2>
            <span className="account-handle">{developer.handle}</span>
            <p className="account-profile-bio">{developer.bio}</p>
            {developer.city && <span className="account-location"><MapPin aria-hidden="true" size={16} /> {developer.city}</span>}
            <Badge><Trophy aria-hidden="true" size={14} /> {developer.points} {t('account.points')}</Badge>
            <section aria-label={t('map.languages')} className="nearby-profile-languages">
              <h3>{t('map.languages')}</h3>
              <div>{developer.languages.map((language) => <Badge key={language}>{language}</Badge>)}</div>
            </section>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  )
}

function AccountIntro({ title, description }: { title: string; description: string }) {
  return (
    <header className="account-intro">
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  )
}

export function ProfilePage() {
  const { i18n, t } = useTranslation()
  const { user } = useAuth() // Récupère l'utilisateur connecté
  const [profile, setProfile] = useState<any>({
  display_name: '',
  handle: '',
  bio: '',
  city: '',
  followers: 0,
  following: 0,
  posts: 0,
  points: 0,
  badges: [],
})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [saved, setSaved] = useState(false)
  const [shareStatus, setShareStatus] = useState('')
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      // 1. Récupérer le profil utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Erreur chargement profil :', profileError.message)
      } else if (profileData) {
        setProfile(profileData)
        setName(profileData.display_name || '')
        setHandle(profileData.handle || '')
        setBio(profileData.bio || '')
      }

      // 2. Compter les followers (via la table follows)
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('followed_id', user.id)

      // 3. Compter les following (via la table follows)
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id)

      // 4. Compter les posts de l'utilisateur
      const { count: postsCount } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)

      // 5. NOUVEAU : Récupérer les badges depuis user_badges avec les détails de la table badges
      const { data: userBadgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          awarded_at,
          badges (
            id,
            name,
            description,
            icon
          )
        `)
        .eq('profile_id', user.id)

      if (badgesError) {
        console.error('Erreur chargement badges :', badgesError.message)
      }

      // Formater les badges pour l'affichage
      const formattedBadges = (userBadgesData || []).map((item: any) => ({
        id: item.badges.id,
        name: item.badges.name,
        description: item.badges.description,
        icon: item.badges.icon,
        unlocked: true,
      }))

      // Mettre à jour l'état global du profil avec les vraies données ET les badges
      setProfile((prev: any) => ({
        ...prev,
        ...(profileData || {}),
        followers: followersCount || 0,
        following: followingCount || 0,
        posts: postsCount || 0,
        badges: formattedBadges, 
      }))

      setLoading(false)
    }

    fetchUserProfile()
  }, [user])
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const cleanName = name.trim()
    const cleanHandle = handle.trim().replace(/^@/, '').toLowerCase() // Nettoie le handle selon ton check SQL
    
    if (!cleanName || cleanHandle.length < 3) return

    // Mise à jour dans Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: cleanName,
        handle: cleanHandle,
        bio: bio.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error('Erreur mise à jour profil :', error.message)
      return
    }

    // Met à jour l'état local pour refléter les changements instantanément
    setProfile((prev: any) => ({
      ...prev,
      display_name: cleanName,
      handle: cleanHandle,
      bio: bio.trim(),
    }))
    
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000) // Cache le message de succès après 3s
  }

  async function shareProfile() {
    const profileUrl = `${window.location.origin}/profile`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Common', url: profileUrl })
        setShareStatus(t('account.profileCopied'))
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(profileUrl)
        setShareStatus(t('account.profileCopied'))
      } else {
        setShareStatus(t('account.shareFailed'))
      }
    } catch (error) {
      console.error('Impossible de partager le profil.', error)
      setShareStatus(t('account.shareFailed'))
    }
  }

  return (
    <ResponsiveLayout title={t('account.profile')}>
      <div className="account-page">
        <section className="account-profile-card">
          <div className="account-profile-cover">
            <span className="account-profile-orbit account-profile-orbit--one" />
            <span className="account-profile-orbit account-profile-orbit--two" />
          </div>
          <div className="account-profile-main">
            <div className="account-avatar" aria-hidden="true">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                profile?.display_name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="account-profile-actions">
              <Link aria-label={t('account.settingsLink')} className="account-profile-icon-link" to="/settings"><Settings aria-hidden="true" size={17} /></Link>
              <Button onClick={() => setEditing((current) => !current)} type="button" variant="secondary">
                <Pencil aria-hidden="true" size={16} /> {t('account.editProfile')}
              </Button>
              <Button onClick={() => void shareProfile()} type="button" variant="secondary">
                <ArrowRight aria-hidden="true" size={16} /> {t('account.shareProfile')}
              </Button>
            </div>
            
            {/* Corrigé : display_name au lieu de name */}
            <h2>{profile?.display_name || 'Utilisateur'}</h2>
            <span className="account-handle">@{profile?.handle || 'username'}</span>
            
            {/* Corrigé : Suppression du @ en trop */}
            <p className="account-profile-bio">{profile?.bio || ''}</p>
            
            {/* Corrigé : Suppression du @ en trop devant la ville */}
            <span className="account-location">
              <MapPin aria-hidden="true" size={16} /> {profile?.city || 'Ouagadougou'}
              {profile?.country_code ? `, ${getCountryName(profile.country_code, i18n.resolvedLanguage ?? 'fr')}` : ''}
            </span>

            <div className="account-stats">
              <span><strong>{(profile?.followers || 0).toLocaleString('fr-FR')}</strong>{' '}{t('account.followers')}</span>{' '}
              <span><strong>{(profile?.following || 0).toLocaleString('fr-FR')}</strong>{' '}{t('account.following')}</span>{' '}
              <span><strong>{profile?.roomsHosted || 0}</strong>{' '}{t('social.roomsHosted')}</span>{' '}
              <span><strong>{profile?.posts || 0}</strong>{' '}{t('account.posts')}</span>
            </div>

            {saved && <p className="account-success" role="status"><Check aria-hidden="true" size={16} /> {t('account.profileSaved')}</p>}
            {shareStatus && <p className="account-success" role="status">{shareStatus}</p>}

            {editing && (
              <form className="account-edit-form" onSubmit={save}>
                <Input label={t('account.name')} maxLength={60} onChange={(event) => setName(event.currentTarget.value)} required value={name} />
                <Input label="@handle" maxLength={30} onChange={(event) => setHandle(event.currentTarget.value)} required value={handle} />
                <div className="ui-field">
                  <label className="ui-label" htmlFor="account-bio">{t('account.bio')}</label>
                  <textarea className="community-textarea" id="account-bio" maxLength={200} onChange={(event) => setBio(event.currentTarget.value)} rows={3} value={bio} />
                </div>
                <div className="account-form-actions">
                  <Button onClick={() => setEditing(false)} type="button" variant="secondary">{t('common.cancel')}</Button>
                  <Button type="submit">{t('account.saveChanges')}</Button>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="account-content-grid">
          <div className="account-section">
            <div className="account-section-heading">
              <h2>{t('account.badges')}</h2>
              <Badge><Trophy aria-hidden="true" size={14} /> {profile?.points || 0} {t('account.points')}</Badge>
            </div>
            <div className="account-badge-grid">
              {(profile?.badges || []).map((badge: any) => {
                const Icon = badgeIcons[badge.icon as keyof typeof badgeIcons] ?? Sparkles
                return (
                  <article className={`account-badge-card${badge.unlocked ? '' : ' account-badge-card--locked'}`} key={badge.id}>
                    <span className="account-badge-icon"><Icon aria-hidden="true" size={20} /></span>
                    <div><strong>{t(`badges.${badge.id}.name`, { defaultValue: badge.name })}</strong><p>{t(`badges.${badge.id}.description`, { defaultValue: badge.description })}</p></div>
                    {!badge.unlocked && <Bookmark aria-label={t('account.locked')} className="account-lock-icon" size={16} />}
                  </article>
                )
              })}
            </div>
          </div>
          
          <aside className="account-section account-activity">
            <h2>{t('account.recent')}</h2>
            <Link to="/coding-rooms"><Code2 aria-hidden="true" size={18} /> {t('social.codingRoomsTitle')} <ChevronRight aria-hidden="true" size={17} /></Link>
            <Link to="/home/tweets"><MessageCircle aria-hidden="true" size={18} /> {t('account.posts')} <ChevronRight aria-hidden="true" size={17} /></Link>
            <Link to="/leaderboard"><Trophy aria-hidden="true" size={18} /> {t('account.leaderboardLink')} <ChevronRight aria-hidden="true" size={17} /></Link>
            <Link to="/messages"><MessageCircle aria-hidden="true" size={18} /> {t('account.messagesLink')} <ChevronRight aria-hidden="true" size={17} /></Link>
            <p>{t('account.emptyPosts')}</p>
          </aside>
        </section>
      </div>
    </ResponsiveLayout>
  )

}

export function LeaderboardPage() {
  const { t } = useTranslation()
  const [scope, setScope] = useState('all')
  const profile = getProfileSummary()
  const entries = [
    { rank: 6, name: profile.name, handle: profile.handle, city: profile.city, points: profile.points, badge: 'Créateur' },
    ...profile.ranking,
  ].sort((a, b) => b.points - a.points)
  const visibleEntries = scope === 'city'
    ? entries.filter((entry) => entry.city.toLocaleLowerCase() === profile.city.toLocaleLowerCase())
    : entries
  const podium = visibleEntries.slice(0, 3)

  return (
    <ResponsiveLayout title={t('account.leaderboard')}>
      <div className="account-page">
        <AccountIntro title={t('account.topDev')} description={t('account.leaderboardIntro')} />
        <Tabs
          items={[{ label: t('account.all'), value: 'all' }, { label: t('account.myCity'), value: 'city' }]}
          onValueChange={setScope}
          value={scope}
        />
        {visibleEntries.length ? (
          <>
            <section aria-label={t('account.leaderboard')} className="account-podium">
              {podium.slice(0, 3).map((entry, index) => (
                <article className={`account-podium-card account-podium-card--${index + 1}`} key={`${entry.handle}-${entry.city}`}>
                  <span className="account-podium-rank">{index + 1}</span>
                  <span className="account-avatar account-avatar--small">{entry.name.slice(0, 1)}</span>
                  <strong>{entry.name}</strong>
                  <span>{entry.city}</span>
                  <Badge><Trophy aria-hidden="true" size={14} /> {entry.points.toLocaleString('fr-FR')} {t('account.score')}</Badge>
                </article>
              ))}
            </section>
            <section aria-label={t('account.leaderboard')} className="account-ranking-list">
              {visibleEntries.map((entry, index) => (
                <article className="account-ranking-row" key={`${entry.handle}-${entry.city}`}>
                  <strong className="account-ranking-position">#{index + 1}</strong>
                  <span className="account-avatar account-avatar--tiny">{entry.name.slice(0, 1)}</span>
                  <div className="account-ranking-person"><strong>{entry.name}</strong><span>{entry.handle} · {entry.city}</span></div>
                  <Badge>{entry.badge}</Badge>
                  <strong className="account-ranking-score">{entry.points.toLocaleString('fr-FR')} <span>{t('account.points')}</span></strong>
                </article>
              ))}
            </section>
          </>
        ) : (
          <EmptyState description={`${t('account.myCity')} · ${profile.city}`} icon={<Trophy aria-hidden="true" size={24} />} title={t('common.noResults')} />
        )}
      </div>
    </ResponsiveLayout>
  )
}

export function NotificationsPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState(getNotifications)
  const visibleNotifications = filter === 'unread'
    ? notifications.filter((notification) => !notification.read)
    : notifications
  const notificationTextKeys = {
    'notice-1': 'account.noticeReply',
    'notice-2': 'account.noticeLike',
    'notice-3': 'account.noticeFollow',
    'notice-4': 'account.noticeBadge',
  } as const

  function markAll() {
    setNotifications(markAllNotificationsRead())
  }

  function markOne(id: string) {
    setNotifications(markNotificationRead(id))
  }

  return (
    <ResponsiveLayout title={t('account.notifications')}>
      <div className="account-page">
        <div className="account-section-heading">
          <AccountIntro title={t('account.notifications')} description={t('account.notificationIntro')} />
          <Button disabled={!notifications.some((item) => !item.read)} onClick={markAll} type="button" variant="secondary">
            <Check aria-hidden="true" size={16} /> {t('account.markAll')}
          </Button>
        </div>
        <Tabs
          items={[{ label: `${t('account.allNotices')} (${notifications.length})`, value: 'all' }, { label: `${t('account.unread')} (${notifications.filter((item) => !item.read).length})`, value: 'unread' }]}
          onValueChange={setFilter}
          value={filter}
        />
        {visibleNotifications.length ? (
          <section aria-label={t('account.notifications')} className="account-notification-list">
            {visibleNotifications.map((notification) => {
              const Icon = notificationIcons[notification.kind]
              return (
                <article className={`account-notification${notification.read ? '' : ' account-notification--unread'}`} key={notification.id}>
                  <Link aria-label={`${notification.actor} ${notification.message}`} className="account-notification-link" onClick={() => markOne(notification.id)} to={notification.target}>
                    <span className="account-notification-icon"><Icon aria-hidden="true" size={19} /></span>
                    <span className="account-notification-copy"><strong>{notification.actor}</strong> {t(notificationTextKeys[notification.id as keyof typeof notificationTextKeys] ?? notification.message)}<small>{notification.createdAt}</small></span>
                  </Link>
                  {!notification.read && <button aria-label={`${t('account.markRead')} : ${notification.actor}`} className="account-mark-read" onClick={() => markOne(notification.id)} type="button"><Check aria-hidden="true" size={17} /></button>}
                </article>
              )
            })}
          </section>
        ) : (
          <EmptyState description={t('account.emptyNotifications')} icon={<Bell aria-hidden="true" size={24} />} title={t('account.notifications')} />
        )}
      </div>
    </ResponsiveLayout>
  )
}

export function MessagesPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const conversations = getConversations().filter((conversation) =>
    `${conversation.name} ${conversation.handle} ${conversation.city}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )

  return (
    <ResponsiveLayout title={t('account.messages')}>
      <div className="account-page account-messages-page">
        <AccountIntro title={t('account.messages')} description={t('account.messagesIntro')} />
        <Input label={t('common.search')} onChange={(event) => setQuery(event.currentTarget.value)} placeholder={t('account.searchPlaceholder')} type="search" value={query} />
        <section className="account-section">
          <h2>{t('account.newMessage')}</h2>
          {conversations.length ? (
            <div className="account-conversation-list">
              {conversations.map((conversation) => {
                const latest = conversation.messages.at(-1)
                return (
                  <Link className="account-conversation-card" key={conversation.id} to={`/messages/${conversation.id}`}>
                    <span className="account-avatar">{conversation.name.slice(0, 1)}</span>
                    <span className="account-conversation-copy"><strong>{conversation.name}</strong><span>{latest?.text ?? ''}</span></span>
                    <span className="account-conversation-meta">{conversation.lastActive}<ChevronRight aria-hidden="true" size={18} /></span>
                  </Link>
                )
              })}
            </div>
          ) : (
            <EmptyState description={query ? t('common.noResults') : t('account.emptyMessages')} icon={<MessageCircle aria-hidden="true" size={24} />} title={t('account.messages')} />
          )}
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function ConversationPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const conversation = getConversation(id)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(() => getConversation(id)?.messages ?? [])

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const sent = sendDirectMessage(id, message)
    if (!sent) return
    setMessage('')
    setMessages((current) => [...current, sent])
  }

  if (!conversation) {
    return (
      <ResponsiveLayout title={t('account.messages')}>
        <div className="account-page"><EmptyState action={<Link to="/messages">{t('account.backToMessages')}</Link>} description={t('account.conversationMissing')} title={t('account.conversationMissing')} /></div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title={conversation.name}>
      <div className="account-page account-conversation-page">
        <Link className="account-back-link" to="/messages"><ArrowLeft aria-hidden="true" size={17} /> {t('account.backToMessages')}</Link>
        <header className="account-conversation-header">
          <span className="account-avatar">{conversation.name.slice(0, 1)}</span>
          <span><strong>{conversation.name}</strong><small>{conversation.handle} · {conversation.city} · {conversation.lastActive}</small></span>
        </header>
        <section aria-label={conversation.name} aria-live="polite" className="account-chat-history">
          {messages.map((item) => (
            <article className={`account-chat-message${item.author === 'Toi' ? ' account-chat-message--mine' : ''}`} key={item.id}>
              {item.author !== 'Toi' && <strong>{item.author}</strong>}
              <p>{item.text}</p>
              <time>{item.createdAt}</time>
            </article>
          ))}
        </section>
        <form className="account-message-form" onSubmit={send}>
          <label className="sr-only" htmlFor="account-message">{t('account.messagePlaceholder')}</label>
          <textarea id="account-message" maxLength={2000} onChange={(event) => setMessage(event.currentTarget.value)} placeholder={t('account.messagePlaceholder')} rows={2} value={message} />
          <Button aria-label={t('account.send')} disabled={!message.trim()} type="submit"><Send aria-hidden="true" size={18} /><span>{t('account.send')}</span></Button>
        </form>
      </div>
    </ResponsiveLayout>
  )
}

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [saved, setSaved] = useState(false)

  function updateLanguage(language: string) {
    if (language !== 'fr' && language !== 'en') return
    window.localStorage.setItem('common-language', language)
    void i18n.changeLanguage(language)
    setSaved(true)
  }

  function updateTheme(value: string) {
    if (value !== 'light' && value !== 'dark' && value !== 'system') return
    setTheme(value as ThemeMode)
    setSaved(true)
  }

  return (
    <ResponsiveLayout title={t('account.settings')}>
      <div className="account-page">
        <AccountIntro title={t('account.settings')} description={t('account.settingsIntro')} />
        <section aria-labelledby="account-appearance-title" className="account-settings-card">
          <div className="account-settings-heading"><Sparkles aria-hidden="true" size={20} /><div><h2 id="account-appearance-title">{t('account.appearance')}</h2><p>{t('account.themeHelp')}</p></div></div>
          <div className="account-setting-field">
            <label htmlFor="account-theme">{t('account.theme')}</label>
            <select className="ui-input" id="account-theme" onChange={(event) => updateTheme(event.currentTarget.value)} value={theme}>
              <option value="light">{t('account.light')}</option>
              <option value="dark">{t('account.dark')}</option>
              <option value="system">{t('account.system')}</option>
            </select>
          </div>
          <div className="account-setting-field">
            <label htmlFor="account-language">{t('account.language')}<small>{t('account.languageHelp')}</small></label>
            <select className="ui-input" id="account-language" onChange={(event) => updateLanguage(event.currentTarget.value)} value={i18n.language.startsWith('en') ? 'en' : 'fr'}>
              <option value="fr">{t('account.french')}</option>
              <option value="en">{t('account.english')}</option>
            </select>
          </div>
        </section>
        <section className="account-settings-card">
          <h2>{t('account.accountSettings')}</h2>
          <Link className="account-setting-link" to="/settings/privacy"><span><Shield aria-hidden="true" size={19} />{t('account.privacy')}</span><ChevronRight aria-hidden="true" size={18} /></Link>
          <Link className="account-setting-link" to="/settings/city"><span><MapPin aria-hidden="true" size={19} />{t('account.changeCity')}</span><ChevronRight aria-hidden="true" size={18} /></Link>
          <Link className="account-setting-link" to="/notifications"><span><Bell aria-hidden="true" size={19} />{t('account.notificationsSettings')}</span><ChevronRight aria-hidden="true" size={18} /></Link>
          <Link className="account-setting-link" to="/quiz"><span><CircleHelp aria-hidden="true" size={19} />{t('nav.quiz')}</span><ChevronRight aria-hidden="true" size={18} /></Link>
        </section>
        {saved && <p className="account-success" role="status"><Check aria-hidden="true" size={16} /> {t('account.settingsSaved')}</p>}
      </div>
    </ResponsiveLayout>
  )
}

const privacyPreferences = [
  { key: 'private-profile', title: 'account.privateProfile', description: 'account.privateProfileHelp', initial: false },
  { key: 'show-city', title: 'account.showCity', description: 'account.showCityHelp', initial: true },
  { key: 'activity-status', title: 'account.activityStatus', description: 'account.activityStatusHelp', initial: true },
  { key: 'personalized-content', title: 'account.personalizedContent', description: 'account.personalizedContentHelp', initial: true },
] as const

function readPrivacyPreference(key: string, initial: boolean) {
  const stored = window.localStorage.getItem(`common-privacy-${key}`)
  return stored === null ? initial : stored === 'true'
}

export function PrivacyPage() {
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState(() =>
    Object.fromEntries(privacyPreferences.map(({ key, initial }) => [key, readPrivacyPreference(key, initial)])),
  )
  const [saved, setSaved] = useState(false)

  function toggle(key: string) {
    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] }
      window.localStorage.setItem(`common-privacy-${key}`, String(next[key]))
      return next
    })
    setSaved(true)
  }

  return (
    <ResponsiveLayout title={t('account.privacy')}>
      <div className="account-page">
        <Link className="account-back-link" to="/settings"><ArrowLeft aria-hidden="true" size={17} /> {t('account.settings')}</Link>
        <AccountIntro title={t('account.privacy')} description={t('account.privacyIntro')} />
        <section className="account-settings-card account-privacy-list">
          {privacyPreferences.map(({ key, title, description }) => (
            <div className="account-privacy-setting" key={key}>
              <div><strong>{t(title)}</strong><p>{t(description)}</p></div>
              <button
                aria-checked={Boolean(preferences[key])}
                aria-label={t(title)}
                className={`account-toggle${preferences[key] ? ' account-toggle--on' : ''}`}
                onClick={() => toggle(key)}
                role="switch"
                type="button"
              ><span /></button>
            </div>
          ))}
        </section>
        {saved && <p className="account-success" role="status"><Check aria-hidden="true" size={16} /> {t('account.privacySaved')}</p>}
      </div>
    </ResponsiveLayout>
  )
}

export function ChangeCityPage() {
  const { i18n, t } = useTranslation()
  const profile = getProfileSummary()
  const [city, setCity] = useState(profile.city)
  const [countryCode, setCountryCode] = useState(profile.countryCode)
  const [saved, setSaved] = useState(false)

  function saveCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanCity = city.trim()
    if (!cleanCity || !countries.some((country) => country.code === countryCode)) return
    window.localStorage.setItem('common-city', cleanCity)
    window.localStorage.setItem('common-country', countryCode)
    setSaved(true)
  }

  return (
    <ResponsiveLayout title={t('account.cityTitle')}>
      <div className="account-page account-city-page">
        <Link className="account-back-link" to="/settings"><ArrowLeft aria-hidden="true" size={17} /> {t('account.settings')}</Link>
        <AccountIntro title={t('account.cityTitle')} description={t('account.cityIntro')} />
        <form className="account-settings-card account-city-form" onSubmit={saveCity}>
          <div className="ui-field">
            <label className="ui-label" htmlFor="account-country">{t('account.country')}</label>
            <select className="ui-input" id="account-country" onChange={(event) => setCountryCode(event.currentTarget.value)} required value={countryCode}>
              {countries.map((country) => <option key={country.code} value={country.code}>{getCountryName(country.code, i18n.resolvedLanguage ?? 'fr')}</option>)}
            </select>
          </div>
          <Input autoComplete="address-level2" label={t('account.localArea')} maxLength={100} onChange={(event) => setCity(event.currentTarget.value)} placeholder={t('account.cityPlaceholder')} required value={city} />
          <p className="account-city-note"><MapPin aria-hidden="true" size={17} /> {t('account.cityIntro')}</p>
          <Button disabled={!city.trim()} type="submit"><Check aria-hidden="true" size={17} /> {t('account.saveCity')}</Button>
          {saved && <p className="account-success" role="status">{t('account.citySaved')}</p>}
        </form>
      </div>
    </ResponsiveLayout>
  )
}
