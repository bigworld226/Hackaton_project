import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Send,
  UsersRound,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card, EmptyState, Input } from '@/components'
import { countries, getCountryName, westAfricanCountries } from '@/data/countries'
import { addThread, getThreadById, getThreads, type Thread } from '@/data/threads'
import { ResponsiveLayout } from '@/layouts'

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

export function ForumsPage() {
  const { t } = useTranslation()
  const recentThreads = getThreads()

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
        <section aria-label={t('community.recentConversations')} className="community-thread-list">
          {recentThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}
        </section>
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
  const recentThreads = getThreads().filter((thread) =>
    isCity ? thread.city === locationName : thread.country === countryName,
  )

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
          {recentThreads.length > 0 ? recentThreads.map((thread) => (
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
  const thread = getThreadById(id)
  const threadCountry = countries.find((country) => country.name === thread?.country)
  const localizedThreadCountry = threadCountry
    ? getCountryName(threadCountry.code, i18n.resolvedLanguage ?? 'fr')
    : thread?.country
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState<ThreadReply[]>([
    { author: 'Malik Ndiaye', text: 'Partant ! Je peux aider à préparer le sujet React.' },
    { author: 'Inès Moreau', text: 'Super idée, je serai là aussi.' },
  ])

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = reply.trim()
    if (!text) return
    setReplies((current) => [...current, { author: t('community.you'), text }])
    setReply('')
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
              <span><MessageCircle aria-hidden="true" size={18} /> {t('community.replies', { count: thread.replies + Math.max(0, replies.length - 2) })}</span>
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
            <Button disabled={!reply.trim()} type="submit"><Send aria-hidden="true" size={17} /> {t('community.sendReply')}</Button>
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
  const selectedCountry = countries.find((country) => country.code === countryCode)

  function submitThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedCountry) return
    const thread = addThread({
      author: t('community.you'),
      body: body.trim(),
      city: city.trim(),
      country: selectedCountry.name,
      tags: tagsText.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean).slice(0, 5),
      title: title.trim(),
    })
    navigate(`/threads/${thread.id}`)
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
          <div className="community-form-actions">
            <Link className="community-text-link" to="/forums">{t('community.cancel')}</Link>
            <Button disabled={!title.trim() || !body.trim() || !city.trim()} type="submit">
              {t('community.publishThread')} <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  )
}
