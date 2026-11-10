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
import { Button, Card, EmptyState, Input } from '@/components'
import { countries, westAfricanCountries } from '@/data/countries'
import { addThread, getThreadById, getThreads, type Thread } from '@/data/threads'
import { ResponsiveLayout } from '@/layouts'

function ThreadCard({ thread }: { thread: Thread }) {
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
          {thread.replies} réponses
        </Link>
        <span>{thread.views.toLocaleString('fr-FR')} vues</span>
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
  const recentThreads = getThreads()

  return (
    <ResponsiveLayout title="Forums">
      <div className="community-page">
        <CommunityIntro
          description="Pose tes questions, partage tes projets et échange avec des développeurs qui comprennent ton quotidien."
          eyebrow="La communauté dev"
          title="Les meilleures idées commencent par une conversation."
        />
        <div className="community-forum-shortcuts">
          <Card
            action={<MapPin aria-hidden="true" size={20} />}
            className="community-forum-shortcut"
            description="Retrouve les rencontres, questions et entraide autour de ta ville."
            href="/forums/city"
            title="Le forum de ma ville"
          />
          <Card
            action={<Globe2 aria-hidden="true" size={20} />}
            className="community-forum-shortcut"
            description="Échange avec les développeurs et communautés de ton pays."
            href="/forums/country"
            title="Le forum de mon pays"
          />
          <Card
            action={<ArrowRight aria-hidden="true" size={20} />}
            className="community-forum-shortcut"
            description="Découvre les pays présents sur Common et leurs communautés."
            href="/countries"
            title="Explorer les pays"
          />
        </div>
        <div className="community-section-heading">
          <div>
            <span className="community-eyebrow">Ça discute en ce moment</span>
            <h2>Conversations récentes</h2>
          </div>
          <Link className="community-create-link" to="/threads/new">
            <Plus aria-hidden="true" size={18} /> Nouvelle discussion
          </Link>
        </div>
        <section aria-label="Conversations récentes" className="community-thread-list">
          {recentThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function ForumScopePage({ scope }: { scope: 'city' | 'country' }) {
  const [searchParams] = useSearchParams()
  const isCity = scope === 'city'
  const countryCode = searchParams.get('country') ?? 'SN'
  const countryName = countries.find((country) => country.code === countryCode)?.name ?? 'Sénégal'
  const locationName = isCity ? 'Dakar' : countryName
  const recentThreads = getThreads().filter((thread) =>
    isCity ? thread.city === locationName : thread.country === locationName,
  )

  return (
    <ResponsiveLayout title={isCity ? 'Forum de ta ville' : 'Forum du pays'}>
      <div className="community-page">
        <CommunityIntro
          description={isCity
            ? 'Une place pour les développeurs de ta ville : entraide, événements et projets près de chez toi.'
            : 'Retrouve les échanges et projets de la communauté dev de ton pays.'}
          eyebrow={isCity ? 'Communauté locale' : 'Communauté nationale'}
          title={locationName}
        />
        <div className="community-scope-actions">
          <Link className="community-text-link" to="/forums">
            Tous les forums <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <Link className="community-create-link" to="/threads/new">
            <Plus aria-hidden="true" size={18} /> Lancer une discussion
          </Link>
        </div>
        <h2 className="community-subheading">Discussions à {locationName}</h2>
        <section aria-label={`Discussions à ${locationName}`} className="community-thread-list">
          {recentThreads.length > 0 ? recentThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          )) : (
            <EmptyState
              action={<Link className="community-create-link" to="/threads/new">Lancer la première discussion</Link>}
              description="Sois le premier à poser une question ou partager un projet dans cet espace."
              title="La conversation commence avec toi"
            />
          )}
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function CountriesPage() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('fr')
  const filteredCountries = useMemo(() => countries.filter((country) =>
    country.name.toLocaleLowerCase('fr').includes(normalizedQuery)
    || country.code.toLocaleLowerCase('fr').includes(normalizedQuery),
  ), [normalizedQuery])
  const westAfricanCodes = new Set(westAfricanCountries.map((country) => country.code))

  return (
    <ResponsiveLayout title="Explorer les pays">
      <div className="community-page">
        <CommunityIntro
          description="Des communautés de développeurs proches de chez toi et partout dans le monde."
          eyebrow="Une communauté sans frontières"
          title="Trouve tes devs, où qu’ils soient."
        />
        <div className="community-country-search">
          <Input
            label="Chercher un pays"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Ex. Sénégal, Canada, Japon…"
            type="search"
            value={query}
          />
          <span>{filteredCountries.length} pays et territoires</span>
        </div>
        {!normalizedQuery && (
          <section aria-labelledby="west-africa-title" className="community-west-africa">
            <div className="community-section-heading">
              <div>
                <span className="community-eyebrow">En priorité</span>
                <h2 id="west-africa-title">Afrique de l’Ouest</h2>
              </div>
            </div>
            <div className="community-country-grid">
              {westAfricanCountries.map((country) => (
                <Link className="community-country-card" key={country.code} to={`/forums/country?country=${country.code}`}>
                  <span className="community-country-code">{country.code}</span>
                  <strong>{country.name}</strong>
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              ))}
            </div>
          </section>
        )}
        <section aria-label="Tous les pays" className="community-country-grid">
          {filteredCountries.map((country) => (
            <Link
              className="community-country-card"
              key={country.code}
              to={`/forums/country?country=${country.code}`}
            >
              <span className="community-country-code">{country.code}</span>
              <strong>{country.name}</strong>
              <ArrowUpRight aria-hidden="true" size={17} />
              {westAfricanCodes.has(country.code) && <span className="community-country-region">Afrique de l’Ouest</span>}
            </Link>
          ))}
          {filteredCountries.length === 0 && (
            <EmptyState
              description="Vérifie l’orthographe ou essaie le nom dans une autre langue."
              icon={<Search aria-hidden="true" size={24} />}
              title="Aucun pays trouvé"
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
  const thread = getThreadById(id)
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState<ThreadReply[]>([
    { author: 'Malik Ndiaye', text: 'Partant ! Je peux aider à préparer le sujet React.' },
    { author: 'Inès Moreau', text: 'Super idée, je serai là aussi.' },
  ])

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = reply.trim()
    if (!text) return
    setReplies((current) => [...current, { author: 'Toi', text }])
    setReply('')
  }

  if (!thread) {
    return (
      <ResponsiveLayout title="Discussion introuvable">
        <EmptyState
          action={<Link className="community-text-link" to="/forums">Retour aux forums</Link>}
          description="Cette discussion n’existe pas ou a été supprimée."
          title="Discussion introuvable"
        />
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title="Discussion">
      <div className="community-detail-layout">
        <section aria-label="Détail de la discussion" className="community-thread-detail">
          <Link className="community-text-link" to="/forums">← Retour aux forums</Link>
          <article className="community-thread-card community-thread-card--detail">
            <div className="community-thread-heading">
              <div className="community-avatar" aria-hidden="true">{thread.author.slice(0, 1)}</div>
              <div>
                <strong>{thread.author}</strong>
                <span>{thread.city}, {thread.country} · {thread.createdAt}</span>
              </div>
            </div>
            <h2>{thread.title}</h2>
            <p>{thread.body}</p>
            <div className="community-tags">{thread.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            <footer>
              <span><MessageCircle aria-hidden="true" size={18} /> {thread.replies + Math.max(0, replies.length - 2)} réponses</span>
              <span>{thread.views.toLocaleString('fr-FR')} vues</span>
            </footer>
          </article>
          <h2 className="community-subheading">La conversation</h2>
          <div className="community-reply-list">
            {replies.map((item, index) => (
              <article className="community-thread-reply" key={`${item.author}-${index}`}>
                <div className="community-avatar" aria-hidden="true">{item.author.slice(0, 1)}</div>
                <div>
                  <strong>{item.author}</strong>
                  <p>{item.text}</p>
                  <button
                    aria-label={`Répondre à ${item.author}`}
                    onClick={() => setReply((current) => `@${item.author} ${current}`.trimEnd())}
                    type="button"
                  >
                    <MessageCircle aria-hidden="true" size={15} /> Répondre
                  </button>
                </div>
              </article>
            ))}
          </div>
          <form className="community-reply-form" onSubmit={submitReply}>
            <Input
              label="Ta réponse"
              onChange={(event) => setReply(event.currentTarget.value)}
              placeholder="Partage ton expérience ou pose une question…"
              value={reply}
            />
            <Button disabled={!reply.trim()} type="submit"><Send aria-hidden="true" size={17} /> Répondre</Button>
          </form>
        </section>
        <aside className="community-detail-aside">
          <Card
            description={`Retrouve les discussions de ${thread.city} et rencontre des devs de ton quartier.`}
            href="/forums/city"
            title={`Forum de ${thread.city}`}
          />
          <Card
            description={`Échanges et actualités de la communauté au ${thread.country}.`}
            href="/forums/country"
            title={`Forum du ${thread.country}`}
          />
        </aside>
      </div>
    </ResponsiveLayout>
  )
}

export function NewThreadPage() {
  const navigate = useNavigate()
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
      author: 'Toi',
      body: body.trim(),
      city: city.trim(),
      country: selectedCountry.name,
      tags: tagsText.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean).slice(0, 5),
      title: title.trim(),
    })
    navigate(`/threads/${thread.id}`)
  }

  return (
    <ResponsiveLayout title="Nouvelle discussion">
      <div className="community-new-thread">
        <CommunityIntro
          description="Une question, un projet ou une idée à partager ? Lance la conversation."
          eyebrow="À toi la parole"
          title="Nouvelle discussion"
        />
        <form className="community-thread-form" onSubmit={submitThread}>
          <Input
            label="Titre"
            maxLength={120}
            minLength={8}
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="Ex. Qui veut contribuer à notre projet open source ?"
            required
            value={title}
          />
          <div className="ui-field">
            <label className="ui-label" htmlFor="community-thread-body">Détails</label>
            <textarea
              className="community-textarea"
              id="community-thread-body"
              maxLength={3000}
              minLength={12}
              onChange={(event) => setBody(event.currentTarget.value)}
              placeholder="Explique ton idée, ce que tu as déjà essayé ou l’aide que tu recherches…"
              required
              rows={6}
              value={body}
            />
          </div>
          <div className="community-location-fields">
            <Input
              autoComplete="address-level2"
              label="Ville ou localité"
              maxLength={100}
              onChange={(event) => setCity(event.currentTarget.value)}
              placeholder="Ta localité"
              required
              value={city}
            />
            <div className="ui-field">
              <label className="ui-label" htmlFor="community-thread-country">Pays</label>
              <select
                className="ui-input community-country-select"
                id="community-thread-country"
                onChange={(event) => setCountryCode(event.currentTarget.value)}
                required
                value={countryCode}
              >
                {westAfricanCountries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
                <optgroup label="Autres pays et territoires">
                  {countries.filter((country) =>
                    !westAfricanCountries.some((westAfricanCountry) => westAfricanCountry.code === country.code),
                  ).map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
          <Input
            label="Mots-clés (séparés par des virgules)"
            onChange={(event) => setTagsText(event.currentTarget.value)}
            placeholder="frontend, entraide, open-source"
            value={tagsText}
          />
          <div className="community-form-actions">
            <Link className="community-text-link" to="/forums">Annuler</Link>
            <Button disabled={!title.trim() || !body.trim() || !city.trim()} type="submit">
              Publier la discussion <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  )
}
