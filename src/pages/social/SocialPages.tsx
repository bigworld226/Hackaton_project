import {
  ArrowUpRight,
  Bookmark,
  Code2,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Repeat2,
  Send,
  Share2,
  UsersRound,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, EmptyState, Input, ProgressBar } from '@/components'
import communityPortrait from '@/assets/community-portrait.jpg'
import communityStory from '@/assets/community-story.jpg'
import { posts, type Post } from '@/data/posts'
import { ResponsiveLayout } from '@/layouts'

const textPosts = posts.filter((post) => post.kind === 'tip')
const reelDiscussion = posts.find((post) => post.kind === 'reel')
const selectedReel = {
  author: 'Maya Santos',
  role: 'Développeuse front-end',
  city: 'Lisbonne',
  caption: 'Une grille CSS qui s’adapte à tous les écrans. En moins de 40 secondes.',
  tags: ['css', 'frontend', 'webdev'],
}

export function ReelsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')

  async function shareReel() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMessage('Lien du Reel copié.')
    } catch (error) {
      console.error('Impossible de copier le lien du Reel.', error)
      setMessage('Le partage est indisponible pour le moment.')
    }
  }

  return (
    <ResponsiveLayout title="Reels">
      <div className="social-reel-page">
        <div className="social-reel-stage">
          <article aria-label="Reel de Maya Santos" className="social-reel-card">
            <img
              alt="Une rue de Lisbonne traversée par un tramway"
              className="social-reel-image"
              src={communityStory}
            />
            <div className="social-reel-shade" />
            <button
              aria-label={isPlaying ? 'Mettre le Reel en pause' : 'Lire le Reel'}
              aria-pressed={isPlaying}
              className="social-reel-play"
              onClick={() => setIsPlaying((current) => !current)}
              type="button"
            >
              {isPlaying ? <Pause aria-hidden="true" size={28} /> : <Play aria-hidden="true" size={28} />}
            </button>
            <div aria-label="Actions du Reel" className="social-reel-actions">
              <button
                aria-label={liked ? 'Retirer le J’aime' : 'Aimer le Reel'}
                aria-pressed={liked}
                className={`social-reel-action${liked ? ' is-active' : ''}`}
                onClick={() => setLiked((current) => !current)}
                type="button"
              >
                <Heart aria-hidden="true" fill={liked ? 'currentColor' : 'none'} size={27} />
                <span>{liked ? '1,3k' : '1,2k'}</span>
              </button>
              <Link
                aria-label="Voir les réponses"
                className="social-reel-action"
                to={`/tweets/${reelDiscussion?.id ?? 'reel-css-grid'}`}
              >
                <MessageCircle aria-hidden="true" size={25} />
                <span>{reelDiscussion?.replies ?? 0}</span>
              </Link>
              <button
                aria-label={saved ? 'Retirer des favoris' : 'Enregistrer le Reel'}
                aria-pressed={saved}
                className={`social-reel-action${saved ? ' is-active' : ''}`}
                onClick={() => setSaved((current) => !current)}
                type="button"
              >
                <Bookmark aria-hidden="true" fill={saved ? 'currentColor' : 'none'} size={23} />
                <span>{saved ? 'Enregistré' : 'Garder'}</span>
              </button>
              <button aria-label="Partager le Reel" className="social-reel-action" onClick={shareReel} type="button">
                <Share2 aria-hidden="true" size={23} />
                <span>Partager</span>
              </button>
            </div>
            <div className="social-reel-copy">
              <div className="social-reel-author">
                <img alt="" src={communityPortrait} />
                <span>
                  <strong>{selectedReel.author}</strong>
                  <small>{selectedReel.city} · {selectedReel.role}</small>
                </span>
              </div>
              <p>{selectedReel.caption}</p>
              <p className="social-reel-tags">
                {selectedReel.tags.map((tag) => `#${tag}`).join(' ')}
              </p>
              <div aria-label={isPlaying ? 'Lecture de démonstration' : 'Reel en pause'} className="social-reel-progress">
                <span className={isPlaying ? 'is-playing' : ''} />
              </div>
            </div>
          </article>
        </div>
        <aside aria-label="Découvrir Common" className="social-reel-aside">
          <div className="social-aside-card">
            <span className="social-eyebrow"><Code2 aria-hidden="true" size={16} /> À découvrir</span>
            <h2>Les idées dev circulent mieux ensemble.</h2>
            <p>Regarde les Reels, partage une découverte et retrouve les devs de ta ville.</p>
            <Link className="social-inline-link" to="/forums">
              Explorer la communauté <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <p aria-live="polite" className="social-status">{message}</p>
        </aside>
      </div>
    </ResponsiveLayout>
  )
}

function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const postUrl = `/tweets/${post.id}`

  async function sharePost() {
    const url = new URL(postUrl, window.location.origin).toString()
    try {
      await navigator.clipboard.writeText(url)
      setShareMessage('Lien copié.')
    } catch (error) {
      console.error('Impossible de copier le lien de la publication.', error)
      setShareMessage('Partage indisponible.')
    }
  }

  return (
    <article className={`social-post${compact ? ' social-post--compact' : ''}`}>
      <header className="social-post-author">
        <img alt="" src={communityPortrait} />
        <div>
          <strong>{post.author.name}</strong>
          <span>{post.city} · {post.createdAt}</span>
        </div>
      </header>
      <p className="social-post-copy">{post.caption}</p>
      <div className="social-post-tags">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
      <div aria-label="Actions de la publication" className="social-post-actions">
        <button
          aria-label={liked ? 'Retirer le J’aime' : 'Aimer la publication'}
          aria-pressed={liked}
          className={liked ? 'is-active' : ''}
          onClick={() => setLiked((current) => !current)}
          type="button"
        >
          <Heart aria-hidden="true" fill={liked ? 'currentColor' : 'none'} size={20} />
          <span>{post.likes + Number(liked)}</span>
        </button>
        <Link aria-label={`${post.replies} réponses`} to={postUrl}>
          <MessageCircle aria-hidden="true" size={20} />
          <span>{post.replies}</span>
        </Link>
        <button
          aria-label={reposted ? 'Annuler le repartage' : 'Repartager'}
          aria-pressed={reposted}
          className={reposted ? 'is-active' : ''}
          onClick={() => setReposted((current) => !current)}
          type="button"
        >
          <Repeat2 aria-hidden="true" size={19} />
          <span>{reposted ? 'Partagé' : 'Repartager'}</span>
        </button>
        <button aria-label="Partager la publication" onClick={sharePost} type="button">
          <Share2 aria-hidden="true" size={19} />
          <span>Partager</span>
        </button>
      </div>
      {shareMessage && <p aria-live="polite" className="social-share-status">{shareMessage}</p>}
    </article>
  )
}

function CommunitySidebar() {
  return (
    <aside aria-label="Ta communauté" className="social-community-sidebar">
      <section className="social-aside-card social-city-card">
        <span className="social-eyebrow"><UsersRound aria-hidden="true" size={16} /> Ta communauté</span>
        <h2>Dakar</h2>
        <p>Retrouve les développeurs, projets et conversations de ta ville.</p>
        <Link className="social-inline-link" to="/forums/city">
          Visiter le forum local <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
      <section className="social-aside-card social-prompt-card">
        <span className="social-eyebrow"><Code2 aria-hidden="true" size={16} /> Défi du jour</span>
        <h2>Une petite idée peut débloquer un gros projet.</h2>
        <p>Réponds au défi de la communauté et apprends avec les autres.</p>
        <Link className="social-inline-link" to="/quiz">
          Voir les quiz <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
      <section className="social-aside-card social-progress-card">
        <h2>Un pas chaque jour</h2>
        <p>Niveau 4 · Curieux du quartier</p>
        <ProgressBar value={1280} max={1500} />
        <strong>1 280 / 1 500 points</strong>
      </section>
    </aside>
  )
}

export function TweetsPage() {
  return (
    <ResponsiveLayout title="Publications">
      <div className="social-feed-layout">
        <section aria-label="Publications de la communauté" className="social-post-list">
          {textPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </section>
        <CommunitySidebar />
      </div>
    </ResponsiveLayout>
  )
}

const sampleReplies = [
  { author: 'Aïcha Diallo', city: 'Dakar', text: 'Merci pour le partage ! Je vais tester ça sur mon prochain composant.' },
  { author: 'Inès Moreau', city: 'Lyon', text: 'Bien vu. Ça m’a déjà évité quelques heures de debug.' },
]

export function TweetRepliesPage() {
  const { id } = useParams()
  const post = posts.find((item) => item.id === id)
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState(sampleReplies)

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = reply.trim()
    if (!text) return
    setReplies((current) => [...current, { author: 'Toi', city: 'Ta communauté', text }])
    setReply('')
  }

  if (!post) {
    return (
      <ResponsiveLayout title="Réponses">
        <EmptyState
          description="Cette publication n’existe pas ou a été supprimée."
          title="Conversation introuvable"
        />
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title="Réponses">
      <div className="social-feed-layout social-replies-layout">
        <section aria-label="Conversation" className="social-post-list">
          <PostCard compact post={post} />
          <h2 className="social-replies-heading">{post.replies + replies.length} réponses</h2>
          {replies.map((item, index) => (
            <article className="social-post social-reply" key={`${item.author}-${index}`}>
              <header className="social-post-author">
                <img alt="" src={communityPortrait} />
                <div>
                  <strong>{item.author}</strong>
                  <span>{item.city} · à l’instant</span>
                </div>
              </header>
              <p className="social-post-copy">{item.text}</p>
              <div className="social-post-actions">
                <button aria-label="Aimer la réponse" type="button"><Heart aria-hidden="true" size={19} /><span>J’aime</span></button>
                <button aria-label="Partager la réponse" type="button"><Share2 aria-hidden="true" size={19} /><span>Partager</span></button>
              </div>
            </article>
          ))}
          <form className="social-reply-form" onSubmit={submitReply}>
            <Input
              aria-label="Ta réponse"
              label="Répondre à la conversation"
              onChange={(event) => setReply(event.currentTarget.value)}
              placeholder="Ajoute une réponse utile…"
              value={reply}
            />
            <Button aria-label="Envoyer la réponse" disabled={!reply.trim()} type="submit">
              <Send aria-hidden="true" size={18} />
              Répondre
            </Button>
          </form>
        </section>
        <CommunitySidebar />
      </div>
    </ResponsiveLayout>
  )
}

export function CreatePage() {
  return (
    <ResponsiveLayout title="Créer">
      <section className="social-create-placeholder">
        <span className="social-eyebrow"><Code2 aria-hidden="true" size={16} /> Espace de création</span>
        <h2>Ton prochain partage commence ici.</h2>
        <p>
          Cet espace accueillera plusieurs façons de contribuer à Common.
          Les options seront ajoutées quand tu auras choisi les formats à proposer.
        </p>
        <Link className="social-inline-link" to="/home/reels">
          Retour au fil <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
    </ResponsiveLayout>
  )
}
