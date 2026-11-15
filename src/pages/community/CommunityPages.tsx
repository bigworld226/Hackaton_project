import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Send,
  Trophy,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge, Button, Card, EmptyState, Input, ProgressBar } from '@/components'
import { countries, getCountryName, westAfricanCountries } from '@/data/countries'
import { globalChampion, monthlyLeaderboard, type MonthlyLeaderboardEntry } from '@/data/leaderboard'
import type { Thread } from '@/data/threads'
import {
  createForumReply,
  createForumThread,
  getForumReplies,
  getForumThread,
  getForumThreads,
  type ForumReplyRow,
  type ForumThreadRow,
} from '@/services/forums'
import { ResponsiveLayout } from '@/layouts'

function relativeTime(value: string, locale: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60_000))
  const formatter = new Intl.RelativeTimeFormat(locale.startsWith('en') ? 'en' : 'fr', { numeric: 'auto' })
  if (minutes < 60) return formatter.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return formatter.format(-hours, 'hour')
  return formatter.format(-Math.round(hours / 24), 'day')
}

function toThread(row: ForumThreadRow, locale: string): Thread {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    author: row.author_name,
    city: row.city,
    country: getCountryName(row.country_code, locale),
    tags: row.tags,
    replies: Number(row.replies),
    views: Number(row.views),
    createdAt: relativeTime(row.created_at, locale),
  }
}

function toThreadReply(row: ForumReplyRow): ThreadReply {
  return { author: row.author_name, text: row.body }
}

function ThreadCard({ thread }: { thread: Thread }) {
  const { t } = useTranslation()
  return (
    <article className="community-thread-card">
      <div className="community-thread-heading">
        <div className="community-avatar" aria-hidden="true">
          {thread.author.slice(0, 1).toLocaleUpperCase()}
        </div>
        <div>
          <strong>{thread.author}</strong>
          <span>{thread.city}, {thread.country} · {thread.createdAt}</span>
        </div>
      </div>
      <Link className="community-thread-title" to={`/threads/${thread.id}`}>
        {thread.title}
      </Link>
      <p>{thread.body}</p>
      <div className="community-tags">
        {thread.tags.map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
      <footer>
        <Link aria-label={`${thread.replies} réponses`} to={`/threads/${thread.id}`}>
          <MessageCircle aria-hidden="true" size={18} />
          {t('community.replies', { count: thread.replies })}
        </Link>
        <span>{t('community.views', { count: thread.views.toLocaleString() })}</span>
      </footer>
    </article>
  )
}

function CommunityIntro({
  description,
  eyebrow,
  title,
}: {
  description: string
  eyebrow: string
  title: string
}) {
  return (
    <header className="community-page-intro">
      <span className="community-eyebrow"><UsersRound aria-hidden="true" size={17} /> {eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  )
}

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase()
}

function CityTournament({
  finalists,
  voteCounts,
  votedFor,
  onVote,
}: {
  finalists: MonthlyLeaderboardEntry[]
  voteCounts: Record<string, number>
  votedFor: string | null
  onVote: (handle: string) => void
}) {
  const { t } = useTranslation()
  const totalVotes = finalists.reduce((total, finalist) => total + (voteCounts[finalist.handle] ?? finalist.publicVotes), 0)
  const placeKeys = ['firstPlace', 'secondPlace', 'thirdPlace']

  return (
    <section aria-labelledby="community-tournament-title" className="community-tournament">
      <header className="community-tournament-heading">
        <div>
          <span className="community-eyebrow"><Trophy aria-hidden="true" size={17} /> {t('community.monthlyTournament')}</span>
          <h2 id="community-tournament-title">{t('community.tournamentTitle', { city: finalists[0]?.city ?? '' })}</h2>
        </div>
        <Badge>{t('community.thisMonth')}</Badge>
      </header>
      <div className="community-finalist-grid">
        {finalists.map((finalist, index) => {
          const votes = voteCounts[finalist.handle] ?? finalist.publicVotes
          const voteShare = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
          const hasVoted = votedFor !== null

          return (
            <Card
              action={<Badge variant={index === 0 ? 'warning' : 'default'}>{t(`community.${placeKeys[index]}`)}</Badge>}
              className="community-finalist-card"
              key={finalist.handle}
              title={finalist.name}
            >
              <span className="community-finalist-handle">{finalist.handle}</span>
              <strong className="community-finalist-points">{t('community.monthlyPoints', { count: finalist.points })}</strong>
              <ProgressBar label={t('community.techScore')} value={finalist.techScore} />
              <ProgressBar label={t('community.publicVote')} value={voteShare} />
              <Button
                className="community-vote-button"
                disabled={hasVoted}
                onClick={() => onVote(finalist.handle)}
                type="button"
              >
                {votedFor === finalist.handle
                  ? t('community.voteRecorded')
                  : hasVoted ? t('community.voteAlreadyCast') : t('community.vote')}
              </Button>
            </Card>
          )
        })}
      </div>
      <p aria-live="polite" className="community-vote-status">
        {votedFor ? t('community.voteThanks') : t('community.votePrompt')}
      </p>
    </section>
  )
}

function MonthlyLeaderboardSidebar({ entries }: { entries: MonthlyLeaderboardEntry[] }) {
  const { t } = useTranslation()

  return (
    <aside aria-label={t('community.monthlyLeaderboard')} className="community-monthly-sidebar">
      <Card className="community-global-champion">
        <div className="community-global-champion-heading">
          <span className="community-global-icon"><Globe2 aria-hidden="true" size={21} /></span>
          <div>
            <strong>{t('community.globalChampion')}</strong>
            <Badge variant="warning">{t('community.championTitle')}</Badge>
          </div>
        </div>
        <div className="community-global-profile">
          <span aria-hidden="true" className="community-rank-avatar">{getInitials(globalChampion.name)}</span>
          <div>
            <strong>{globalChampion.name}</strong>
            <span>{globalChampion.handle} · {globalChampion.city}</span>
          </div>
        </div>
        <strong className="community-global-points">{t('community.monthlyPoints', { count: globalChampion.points })}</strong>
      </Card>

      <section aria-labelledby="monthly-leaderboard-title" className="community-monthly-ranking">
        <header>
          <span className="community-eyebrow"><Trophy aria-hidden="true" size={16} /> {t('community.monthly')}</span>
          <h2 id="monthly-leaderboard-title">{t('community.topDevelopers', { city: entries[0]?.city ?? '' })}</h2>
        </header>
        <ol>
          {entries.map((entry) => (
            <li key={entry.handle}>
              <span className="community-monthly-rank">{entry.rank}</span>
              <span aria-hidden="true" className="community-rank-avatar">{getInitials(entry.name)}</span>
              <span className="community-monthly-user">
                <strong>{entry.handle}</strong>
                <small>{entry.name}</small>
              </span>
              <strong className="community-monthly-points">{t('community.pointsShort', { count: entry.points })}</strong>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  )
}

export function ForumsPage() {
  const { t, i18n } = useTranslation()
  const [recentThreads, setRecentThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    void getForumThreads()
      .then((rows) => {
        if (active) setRecentThreads(rows.map((row) => toThread(row, i18n.resolvedLanguage ?? 'fr')))
      })
      .catch((error: unknown) => {
        console.error('Unable to load forum threads.', error)
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [i18n.resolvedLanguage])

  return (
    <ResponsiveLayout title={t('community.forums')}>
      <div className="community-page">
        <CommunityIntro
          description={t('community.forumsDescription')}
          eyebrow={t('community.communityDev')}
          title={t('community.forumsTitle')}
        />
        <div className="community-forum-shortcuts">
          <Card
            action={<MapPin aria-hidden="true" size={20} />}
            className="community-forum-shortcut"
            description={t('community.cityForumDescription')}
            href="/forums/city"
            title={t('community.cityForum')}
          />
          <Card
            action={<Globe2 aria-hidden="true" size={20} />}
            className="community-forum-shortcut"
            description={t('community.countryForumDescription')}
            href="/forums/country"
            title={t('community.countryForum')}
          />
          <Card
            action={<ArrowRight aria-hidden="true" size={20} />}
            className="community-forum-shortcut"
            description={t('community.exploreCountriesDescription')}
            href="/countries"
            title={t('community.exploreCountries')}
          />
        </div>
        <div className="community-section-heading">
          <div>
            <span className="community-eyebrow">{t('community.currentlyDiscussing')}</span>
            <h2>{t('community.recentConversations')}</h2>
          </div>
          <Link className="community-create-link" to="/threads/new">
            <Plus aria-hidden="true" size={18} /> {t('community.newDiscussion')}
          </Link>
        </div>
        {loading ? <p>{t('common.loading')}</p> : loadError ? (
          <EmptyState description={t('community.loadError')} title={t('community.recentConversations')} />
        ) : (
          <section aria-label={t('community.recentConversations')} className="community-thread-list">
            {recentThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}
          </section>
        )}
      </div>
    </ResponsiveLayout>
  )
}

export function ForumScopePage({ scope }: { scope: 'city' | 'country' }) {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const isCity = scope === 'city'
  const countryCode = searchParams.get('country') ?? 'SN'
  const selectedCountry = countries.find((country) => country.code === countryCode)
  const countryName = selectedCountry?.name ?? 'Sénégal'
  const locationName = isCity ? 'Dakar' : selectedCountry
    ? getCountryName(selectedCountry.code, i18n.resolvedLanguage ?? 'fr')
    : countryName
  const [recentThreads, setRecentThreads] = useState<Thread[]>([])
  const [loadingThreads, setLoadingThreads] = useState(true)
  const [threadsError, setThreadsError] = useState(false)
  const monthlyEntries = monthlyLeaderboard
    .filter((entry) => entry.city === locationName)
    .sort((left, right) => left.rank - right.rank)
    .slice(0, 10)
  const finalists = monthlyEntries.slice(0, 3)
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(finalists.map((finalist) => [finalist.handle, finalist.publicVotes])),
  )
  const [votedFor, setVotedFor] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoadingThreads(true)
    void getForumThreads(isCity ? { city: locationName } : { countryCode })
      .then((rows) => {
        if (active) setRecentThreads(rows.map((row) => toThread(row, i18n.resolvedLanguage ?? 'fr')))
      })
      .catch((error: unknown) => {
        console.error('Unable to load scoped forum threads.', error)
        if (active) setThreadsError(true)
      })
      .finally(() => {
        if (active) setLoadingThreads(false)
      })

    return () => { active = false }
  }, [countryCode, i18n.resolvedLanguage, isCity, locationName])

  function voteForFinalist(handle: string) {
    if (votedFor || !finalists.some((finalist) => finalist.handle === handle)) return
    setVoteCounts((current) => ({ ...current, [handle]: (current[handle] ?? 0) + 1 }))
    setVotedFor(handle)
  }

  return (
    <ResponsiveLayout title={isCity ? t('community.cityTitle') : t('community.countryTitle')}>
      <div className="community-page">
        <CommunityIntro
          description={isCity
            ? t('community.cityDescription')
            : t('community.countryDescription')}
          eyebrow={isCity ? t('community.localCommunity') : t('community.nationalCommunity')}
          title={locationName}
        />
        {isCity && (
          <CityTournament
            finalists={finalists}
            onVote={voteForFinalist}
            voteCounts={voteCounts}
            votedFor={votedFor}
          />
        )}
        <div className={isCity ? 'community-city-layout' : undefined}>
          <div className="community-city-feed">
            <div className="community-scope-actions">
              <Link className="community-text-link" to="/forums">
                {t('community.allForums')} <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link className="community-create-link" to="/threads/new">
                <Plus aria-hidden="true" size={18} /> {t('community.startDiscussion')}
              </Link>
            </div>
            <h2 className="community-subheading">{t('community.discussionsAt', { location: locationName })}</h2>
            <section aria-label={t('community.discussionsAt', { location: locationName })} className="community-thread-list">
              {loadingThreads ? <p>{t('common.loading')}</p> : threadsError ? (
                <EmptyState description={t('community.loadError')} title={t('community.discussionsAt', { location: locationName })} />
              ) : recentThreads.length > 0 ? recentThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              )) : (
                <EmptyState
                  action={<Link className="community-create-link" to="/threads/new">{t('community.firstDiscussion')}</Link>}
                  description={t('community.beFirst')}
                  title={t('community.startWithYou')}
                />
              )}
            </section>
          </div>
          {isCity && <MonthlyLeaderboardSidebar entries={monthlyEntries} />}
        </div>
      </div>
    </ResponsiveLayout>
  )
}

export function CountriesPage() {
  const [query, setQuery] = useState('')
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage ?? 'fr'
  const normalizedQuery = query.trim().toLocaleLowerCase(locale)
  const filteredCountries = useMemo(() => countries.filter((country) =>
    getCountryName(country.code, locale).toLocaleLowerCase(locale).includes(normalizedQuery)
    || country.name.toLocaleLowerCase(locale).includes(normalizedQuery)
    || country.code.toLocaleLowerCase(locale).includes(normalizedQuery),
  ), [locale, normalizedQuery])
  const westAfricanCodes = new Set(westAfricanCountries.map((country) => country.code))

  return (
    <ResponsiveLayout title={t('community.exploreCountries')}>
      <div className="community-page">
        <CommunityIntro
          description={t('community.countriesDescription')}
          eyebrow={t('community.borderless')}
          title={t('community.countriesTitle')}
        />
        <div className="community-country-search">
          <Input
            label={t('community.searchCountry')}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={t('community.countryPlaceholder')}
            type="search"
            value={query}
          />
          <span>{t('community.countryCount', { count: filteredCountries.length })}</span>
        </div>
        {!normalizedQuery && (
          <section aria-labelledby="west-africa-title" className="community-west-africa">
            <div className="community-section-heading">
              <div>
                <span className="community-eyebrow">{t('community.priority')}</span>
                <h2 id="west-africa-title">{t('community.westAfrica')}</h2>
              </div>
            </div>
            <div className="community-country-grid">
              {westAfricanCountries.map((country) => (
                <Link className="community-country-card" key={country.code} to={`/forums/country?country=${country.code}`}>
                  <span className="community-country-code">{country.code}</span>
                  <strong>{getCountryName(country.code, locale)}</strong>
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              ))}
            </div>
          </section>
        )}
        <section aria-label={t('community.allCountries')} className="community-country-grid">
          {filteredCountries.map((country) => (
            <Link
              className="community-country-card"
              key={country.code}
              to={`/forums/country?country=${country.code}`}
            >
              <span className="community-country-code">{country.code}</span>
              <strong>{getCountryName(country.code, locale)}</strong>
              <ArrowUpRight aria-hidden="true" size={17} />
              {westAfricanCodes.has(country.code) && <span className="community-country-region">{t('community.westAfricaRegion')}</span>}
            </Link>
          ))}
          {filteredCountries.length === 0 && (
            <EmptyState
              description={t('community.noCountryDescription')}
              icon={<Search aria-hidden="true" size={24} />}
              title={t('community.noCountry')}
            />
          )}
        </section>
      </div>
    </ResponsiveLayout>
  )
}

interface ThreadReply {
  author: string
  text: string
}

export function ThreadDetailPage() {
  const { id = '' } = useParams()
  const { t, i18n } = useTranslation()
  const [thread, setThread] = useState<Thread | null>(null)
  const [replies, setReplies] = useState<ThreadReply[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reply, setReply] = useState('')
  const [replyError, setReplyError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    void Promise.all([getForumThread(id), getForumReplies(id)])
      .then(([threadRow, replyRows]) => {
        if (!active) return
        setThread(threadRow ? toThread(threadRow, i18n.resolvedLanguage ?? 'fr') : null)
        setReplies(replyRows.map(toThreadReply))
      })
      .catch((error: unknown) => {
        console.error('Unable to load forum discussion.', error)
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [i18n.resolvedLanguage, id])

  const threadCountry = countries.find((country) => country.name === thread?.country)
  const localizedThreadCountry = threadCountry
    ? getCountryName(threadCountry.code, i18n.resolvedLanguage ?? 'fr')
    : thread?.country

  async function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = reply.trim()
    if (!text || submitting) return
    setSubmitting(true)
    setReplyError('')
    try {
      const created = await createForumReply(id, text)
      setReplies((current) => [...current, toThreadReply(created)])
      setReply('')
    } catch (error) {
      if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
        setReplyError(t('community.signInToReply'))
      } else {
        console.error('Unable to publish forum reply.', error)
        setReplyError(t('community.submitError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <ResponsiveLayout title={t('community.threadDetail')}><p>{t('common.loading')}</p></ResponsiveLayout>
  }

  if (loadError) {
    return (
      <ResponsiveLayout title={t('community.threadDetail')}>
        <EmptyState description={t('community.loadError')} title={t('community.threadDetail')} />
      </ResponsiveLayout>
    )
  }

  if (!thread) {
    return (
      <ResponsiveLayout title={t('community.threadMissing')}>
        <EmptyState
          action={<Link className="community-text-link" to="/forums">{t('community.backToForums')}</Link>}
          description={t('community.threadMissing')}
          title={t('community.threadMissing')}
        />
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title={t('community.threadDetail')}>
      <div className="community-detail-layout">
        <section aria-label={t('community.threadDetail')} className="community-thread-detail">
          <Link className="community-text-link" to="/forums">← {t('community.backToForums')}</Link>
          <article className="community-thread-card community-thread-card--detail">
            <div className="community-thread-heading">
              <div className="community-avatar" aria-hidden="true">{thread.author.slice(0, 1)}</div>
              <div>
                <strong>{thread.author}</strong>
                <span>{thread.city}, {localizedThreadCountry} · {thread.createdAt}</span>
              </div>
            </div>
            <h2>{thread.title}</h2>
            <p>{thread.body}</p>
            <div className="community-tags">{thread.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            <footer>
              <span><MessageCircle aria-hidden="true" size={18} /> {t('community.replies', { count: replies.length })}</span>
              <span>{t('community.views', { count: thread.views.toLocaleString() })}</span>
            </footer>
          </article>
          <h2 className="community-subheading">{t('community.conversation')}</h2>
          <div className="community-reply-list">
            {replies.map((item, index) => (
              <article className="community-thread-reply" key={`${item.author}-${index}`}>
                <div className="community-avatar" aria-hidden="true">{item.author.slice(0, 1)}</div>
                <div>
                  <strong>{item.author}</strong>
                  <p>{item.text}</p>
                  <button
                    aria-label={t('community.replyTo', { author: item.author })}
                    onClick={() => setReply((current) => `@${item.author} ${current}`.trimEnd())}
                    type="button"
                  >
                    <MessageCircle aria-hidden="true" size={15} /> {t('community.reply')}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <form className="community-reply-form" onSubmit={submitReply}>
            <Input
              label={t('community.yourReply')}
              onChange={(event) => setReply(event.currentTarget.value)}
              placeholder={t('community.replyPlaceholder')}
              value={reply}
            />
            {replyError && <p className="ui-field-message ui-field-message--error" role="alert">{replyError}</p>}
            <Button disabled={!reply.trim() || submitting} type="submit"><Send aria-hidden="true" size={17} /> {submitting ? t('common.loading') : t('community.sendReply')}</Button>
          </form>
        </section>
        <aside className="community-detail-aside">
          <Card
            description={t('community.threadCityDescription', { city: thread.city })}
            href="/forums/city"
            title={t('community.cityForumFor', { city: thread.city })}
          />
          <Card
            description={t('community.threadCountryDescription', { country: localizedThreadCountry })}
            href="/forums/country"
            title={t('community.countryForumFor', { country: localizedThreadCountry })}
          />
        </aside>
      </div>
    </ResponsiveLayout>
  )
}

export function NewThreadPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [city, setCity] = useState('')
  const [countryCode, setCountryCode] = useState('SN')
  const [tagsText, setTagsText] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const selectedCountry = countries.find((country) => country.code === countryCode)

  async function submitThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedCountry || submitting) return
    setSubmitting(true)
    setFormError('')
    try {
      const threadId = await createForumThread({
        body: body.trim(),
        city: city.trim(),
        countryCode: selectedCountry.code,
        tags: tagsText.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean).slice(0, 5),
        title: title.trim(),
      })
      navigate(`/threads/${threadId}`)
    } catch (error) {
      if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
        setFormError(t('community.signInToPublish'))
      } else {
        console.error('Unable to publish forum thread.', error)
        setFormError(t('community.submitError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ResponsiveLayout title={t('community.newThread')}>
      <div className="community-new-thread">
        <CommunityIntro
          description={t('community.newThreadDescription')}
          eyebrow={t('community.speakUp')}
          title={t('community.newThread')}
        />
        <form className="community-thread-form" onSubmit={submitThread}>
          <Input
            label={t('community.threadTitle')}
            maxLength={120}
            minLength={8}
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder={t('community.threadTitlePlaceholder')}
            required
            value={title}
          />
          <div className="ui-field">
            <label className="ui-label" htmlFor="community-thread-body">{t('community.details')}</label>
            <textarea
              className="community-textarea"
              id="community-thread-body"
              maxLength={3000}
              minLength={12}
              onChange={(event) => setBody(event.currentTarget.value)}
              placeholder={t('community.threadBodyPlaceholder')}
              required
              rows={6}
              value={body}
            />
          </div>
          <div className="community-location-fields">
            <Input
              autoComplete="address-level2"
              label={t('community.cityOrArea')}
              maxLength={100}
              onChange={(event) => setCity(event.currentTarget.value)}
              placeholder={t('community.localityPlaceholder')}
              required
              value={city}
            />
            <div className="ui-field">
              <label className="ui-label" htmlFor="community-thread-country">{t('community.country')}</label>
              <select
                className="ui-input community-country-select"
                id="community-thread-country"
                onChange={(event) => setCountryCode(event.currentTarget.value)}
                required
                value={countryCode}
              >
                {westAfricanCountries.map((country) => (
                  <option key={country.code} value={country.code}>{getCountryName(country.code, i18n.resolvedLanguage ?? 'fr')}</option>
                ))}
                <optgroup label={t('community.otherCountries')}>
                  {countries.filter((country) =>
                    !westAfricanCountries.some((westAfricanCountry) => westAfricanCountry.code === country.code),
                  ).map((country) => (
                    <option key={country.code} value={country.code}>{getCountryName(country.code, i18n.resolvedLanguage ?? 'fr')}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
          <Input
            label={t('community.tags')}
            onChange={(event) => setTagsText(event.currentTarget.value)}
            placeholder={t('community.tagsPlaceholder')}
            value={tagsText}
          />
          {formError && <p className="ui-field-message ui-field-message--error" role="alert">{formError}</p>}
          <div className="community-form-actions">
            <Link className="community-text-link" to="/forums">{t('community.cancel')}</Link>
            <Button disabled={!title.trim() || !body.trim() || !city.trim() || submitting} type="submit">
              {submitting ? t('common.loading') : t('community.publishThread')} <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  )
}
