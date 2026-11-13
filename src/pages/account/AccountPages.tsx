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
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
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
import { useTheme, type ThemeMode } from '@/hooks/useTheme'
import { ResponsiveLayout } from '@/layouts'

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
  const profile = getProfileSummary()
  const profileBio = profile.bio.startsWith('Développeur·se frontend | React, CSS & open source.')
    ? t('account.profileBio')
    : profile.bio
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [handle, setHandle] = useState(profile.handle)
  const [bio, setBio] = useState(profileBio)
  const [saved, setSaved] = useState(false)
  const [shareStatus, setShareStatus] = useState('')

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`
    if (!cleanName || cleanHandle.length < 3) return
    saveProfileDetails({ name: cleanName, handle: cleanHandle, bio: bio.trim() })
    setName(cleanName)
    setHandle(cleanHandle)
    setSaved(true)
    setEditing(false)
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
            <div className="account-avatar" aria-hidden="true">A</div>
            <div className="account-profile-actions">
              <Link aria-label={t('account.settingsLink')} className="account-profile-icon-link" to="/settings"><Settings aria-hidden="true" size={17} /></Link>
              <Button onClick={() => setEditing((current) => !current)} type="button" variant="secondary">
                <Pencil aria-hidden="true" size={16} /> {t('account.editProfile')}
              </Button>
              <Button onClick={() => void shareProfile()} type="button" variant="secondary">
                <ArrowRight aria-hidden="true" size={16} /> {t('account.shareProfile')}
              </Button>
            </div>
            <h2>{profile.name}</h2>
            <span className="account-handle">{profile.handle}</span>
            <p className="account-profile-bio">{profile.bio}</p>
            <span className="account-location"><MapPin aria-hidden="true" size={16} /> {profile.city}, {getCountryName(profile.countryCode, i18n.resolvedLanguage ?? 'fr')}</span>
            <div className="account-stats">
              <span><strong>{profile.followers.toLocaleString('fr-FR')}</strong> {t('account.followers')}</span>
              <span><strong>{profile.following.toLocaleString('fr-FR')}</strong> {t('account.following')}</span>
              <span><strong>{profile.roomsHosted}</strong> {t('social.roomsHosted')}</span>
              <span><strong>{profile.posts}</strong> {t('account.posts')}</span>
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
              <Badge><Trophy aria-hidden="true" size={14} /> {profile.points} {t('account.points')}</Badge>
            </div>
            <div className="account-badge-grid">
              {profile.badges.map((badge) => {
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
