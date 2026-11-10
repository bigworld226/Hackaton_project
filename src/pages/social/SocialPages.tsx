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
  X,
} from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
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

interface Comment {
  author: string
  city: string
  text: string
}

const sampleReplies: Comment[] = [
  { author: 'Aïcha Diallo', city: 'Dakar', text: 'Merci pour le partage ! Je vais tester ça sur mon prochain composant.' },
  { author: 'Inès Moreau', city: 'Lyon', text: 'Bien vu. Ça m’a déjà évité quelques heures de debug.' },
]

function CommentsSheet({
  comments,
  count,
  onClose,
  onSubmit,
  open,
}: {
  comments: Comment[]
  count: number
  onClose: () => void
  onSubmit: (comment: string) => void
  open: boolean
}) {
  const [reply, setReply] = useState('')
  const { t } = useTranslation()
  const inputId = useId()
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.getElementById(inputId)?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus()
    }
  }, [inputId, open])

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = reply.trim()
    if (!text) return
    onSubmit(text)
    setReply('')
  }

  if (!open) return null

  return (
    <div
      aria-label={t('social.comments')}
      aria-modal="true"
      className="social-comments-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
        if (event.key === 'Tab') {
          const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled])',
          )
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }
      }}
      role="dialog"
      tabIndex={-1}
    >
      <section aria-labelledby="social-comments-title" className="social-comments-sheet">
        <header className="social-comments-header">
          <div>
            <h2 id="social-comments-title">{t('social.comments')}</h2>
            <span>{t('social.replies', { count })}</span>
          </div>
          <button aria-label={t('social.closeComments')} className="social-comments-close" onClick={onClose} type="button">
            <X aria-hidden="true" size={21} />
          </button>
        </header>
        <div className="social-comments-list">
          {comments.map((comment, index) => (
            <article className="social-comment" key={`${comment.author}-${index}`}>
              <img alt="" src={communityPortrait} />
              <div>
                <strong>{comment.author}</strong>
                <span>{comment.city} · {t('social.justNow')}</span>
                <p>{comment.text}</p>
                <button aria-label={t('social.likeComment', { author: comment.author })} type="button">
                  <Heart aria-hidden="true" size={15} /> {t('social.like')}
                </button>
              </div>
            </article>
          ))}
        </div>
        <form className="social-comments-form" onSubmit={submitComment}>
          <img alt="" src={communityPortrait} />
          <Input
            aria-label={t('social.writeComment')}
            autoComplete="off"
            id={inputId}
            label={t('social.writeComment')}
            onChange={(event) => setReply(event.currentTarget.value)}
            placeholder={t('social.commentPlaceholder')}
            value={reply}
          />
          <Button aria-label={t('social.publishComment')} disabled={!reply.trim()} type="submit">
            <Send aria-hidden="true" size={18} />
          </Button>
        </form>
      </section>
    </div>
  )
}

export function ReelsPage() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showLikeFeedback, setShowLikeFeedback] = useState(false)
  const [message, setMessage] = useState('')
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(sampleReplies)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (clickTimer.current) clearTimeout(clickTimer.current)
  }, [])

  function addComment(text: string) {
    setComments((current) => [...current, { author: t('social.you'), city: t('social.yourCommunity'), text }])
  }

  async function shareReel() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMessage(t('social.copiedReel'))
    } catch (error) {
      console.error('Unable to copy the Reel link.', error)
      setMessage(t('social.shareUnavailable'))
    }
  }

  function handleMediaClick(event: MouseEvent<HTMLElement>) {
    if (event.detail > 1) return
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      setIsPlaying((current) => !current)
      clickTimer.current = null
    }, 240)
  }

  function handleMediaDoubleClick() {
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = null
    setLiked(true)
    setShowLikeFeedback(true)
    window.setTimeout(() => setShowLikeFeedback(false), 850)
  }

  function togglePlayback() {
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = null
    setIsPlaying((current) => !current)
  }

  return (
    <ResponsiveLayout title="Reels">
      <div className="social-reel-page">
        <div className="social-reel-stage">
          <article aria-label={t('social.reel', { author: selectedReel.author })} className="social-reel-card">
            <div
              aria-label={t('social.videoControls')}
              className="social-reel-media"
              onClick={handleMediaClick}
              onDoubleClick={handleMediaDoubleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  togglePlayback()
                }
              }}
            >
              <img
                alt={t('social.tramAlt')}
                className="social-reel-image"
                draggable={false}
                src={communityStory}
              />
              <div className="social-reel-shade" />
            </div>
            {showLikeFeedback && (
              <Heart aria-hidden="true" className="social-reel-like-feedback" fill="currentColor" size={88} />
            )}
            <button
              aria-label={isPlaying ? t('social.pauseReel') : t('social.playReel')}
              aria-pressed={isPlaying}
              className="social-reel-play"
              onClick={handleMediaClick}
              onDoubleClick={handleMediaDoubleClick}
              type="button"
            >
              {isPlaying ? <Pause aria-hidden="true" size={28} /> : <Play aria-hidden="true" size={28} />}
            </button>
            <div aria-label={t('social.reelActions')} className="social-reel-actions">
              <button
                aria-label={liked ? t('social.removeLike') : t('social.likeReel')}
                aria-pressed={liked}
                className={`social-reel-action${liked ? ' is-active' : ''}`}
                onClick={() => setLiked((current) => !current)}
                type="button"
              >
                <Heart aria-hidden="true" fill={liked ? 'currentColor' : 'none'} size={27} />
                <span>{liked ? '1,3k' : '1,2k'}</span>
              </button>
              <button
                aria-label={t('social.viewReplies')}
                aria-expanded={commentsOpen}
                className="social-reel-action"
                onClick={() => setCommentsOpen(true)}
                type="button"
              >
                <MessageCircle aria-hidden="true" size={25} />
                <span>
                  {(reelDiscussion?.replies ?? comments.length) + comments.length - sampleReplies.length}
                </span>
              </button>
              <button
                aria-label={saved ? t('social.removeSaved') : t('social.saveReel')}
                aria-pressed={saved}
                className={`social-reel-action${saved ? ' is-active' : ''}`}
                onClick={() => setSaved((current) => !current)}
                type="button"
              >
                <Bookmark aria-hidden="true" fill={saved ? 'currentColor' : 'none'} size={23} />
                <span>{saved ? t('social.saved') : t('social.keep')}</span>
              </button>
              <button aria-label={t('social.shareReel')} className="social-reel-action" onClick={shareReel} type="button">
                <Share2 aria-hidden="true" size={23} />
                <span>{t('social.share')}</span>
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
              <div aria-label={isPlaying ? t('social.demoPlaying') : t('social.reelPaused')} className="social-reel-progress">
                <span className={isPlaying ? 'is-playing' : ''} />
              </div>
            </div>
          </article>
        </div>
        <aside aria-label={`${t('social.discover')} Common`} className="social-reel-aside">
          <div className="social-aside-card">
            <span className="social-eyebrow"><Code2 aria-hidden="true" size={16} /> {t('social.discover')}</span>
            <h2>{t('social.ideas')}</h2>
            <p>{t('social.reelDescription')}</p>
            <Link className="social-inline-link" to="/forums">
              {t('social.exploreCommunity')} <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <p aria-live="polite" className="social-status">{message}</p>
        </aside>
      </div>
      <CommentsSheet
        comments={comments}
        count={(reelDiscussion?.replies ?? comments.length) + comments.length - sampleReplies.length}
        onClose={() => setCommentsOpen(false)}
        onSubmit={addComment}
        open={commentsOpen}
      />
    </ResponsiveLayout>
  )
}

function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const { t } = useTranslation()
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(sampleReplies)
  const postUrl = `/tweets/${post.id}`

  async function sharePost() {
    const url = new URL(postUrl, window.location.origin).toString()
    try {
      await navigator.clipboard.writeText(url)
      setShareMessage(t('social.copied'))
    } catch (error) {
      console.error('Unable to copy the post link.', error)
      setShareMessage(t('social.shareFailed'))
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
      <div aria-label={t('social.postActions')} className="social-post-actions">
        <button
          aria-label={liked ? t('social.removeLike') : t('social.likePost')}
          aria-pressed={liked}
          className={liked ? 'is-active' : ''}
          onClick={() => setLiked((current) => !current)}
          type="button"
        >
          <Heart aria-hidden="true" fill={liked ? 'currentColor' : 'none'} size={20} />
          <span>{post.likes + Number(liked)}</span>
        </button>
        <button
          aria-label={t('social.replies', { count: post.replies })}
          aria-expanded={commentsOpen}
          onClick={() => setCommentsOpen(true)}
          type="button"
        >
          <MessageCircle aria-hidden="true" size={20} />
          <span>{post.replies}</span>
        </button>
        <button
          aria-label={reposted ? t('social.undoRepost') : t('social.repost')}
          aria-pressed={reposted}
          className={reposted ? 'is-active' : ''}
          onClick={() => setReposted((current) => !current)}
          type="button"
        >
          <Repeat2 aria-hidden="true" size={19} />
          <span>{reposted ? t('social.shared') : t('social.repost')}</span>
        </button>
        <button aria-label={t('social.sharePost')} onClick={sharePost} type="button">
          <Share2 aria-hidden="true" size={19} />
          <span>{t('social.share')}</span>
        </button>
      </div>
      {shareMessage && <p aria-live="polite" className="social-share-status">{shareMessage}</p>}
      <CommentsSheet
        comments={comments}
        count={post.replies + comments.length - sampleReplies.length}
        onClose={() => setCommentsOpen(false)}
        onSubmit={(text) => setComments((current) => [...current, { author: t('social.you'), city: t('social.yourCommunity'), text }])}
        open={commentsOpen}
      />
    </article>
  )
}

function CommunitySidebar() {
  const { t } = useTranslation()
  return (
    <aside aria-label={t('social.community')} className="social-community-sidebar">
      <section className="social-aside-card social-city-card">
        <span className="social-eyebrow"><UsersRound aria-hidden="true" size={16} /> {t('social.community')}</span>
        <h2>{t('social.city')}</h2>
        <p>{t('social.cityDescription')}</p>
        <Link className="social-inline-link" to="/forums/city">
          {t('social.visitForum')} <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
      <section className="social-aside-card social-prompt-card">
        <span className="social-eyebrow"><Code2 aria-hidden="true" size={16} /> {t('social.dailyChallenge')}</span>
        <h2>{t('social.challengeTitle')}</h2>
        <p>{t('social.challengeDescription')}</p>
        <Link className="social-inline-link" to="/quiz">
          {t('social.seeQuizzes')} <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
      <section className="social-aside-card social-progress-card">
        <h2>{t('social.dailyProgress')}</h2>
        <p>{t('social.level')}</p>
        <ProgressBar value={1280} max={1500} />
        <strong>{t('social.pointsProgress')}</strong>
      </section>
    </aside>
  )
}

export function TweetsPage() {
  const { t } = useTranslation()
  return (
    <ResponsiveLayout title={t('social.posts')}>
      <div className="social-feed-layout">
        <section aria-label={t('social.communityPosts')} className="social-post-list">
          {textPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </section>
        <CommunitySidebar />
      </div>
    </ResponsiveLayout>
  )
}

export function TweetRepliesPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const post = posts.find((item) => item.id === id)
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState(sampleReplies)

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = reply.trim()
    if (!text) return
    setReplies((current) => [...current, { author: t('social.you'), city: t('social.yourCommunity'), text }])
    setReply('')
  }

  if (!post) {
    return (
      <ResponsiveLayout title={t('social.repliesTitle')}>
        <EmptyState
          description={t('social.missingPost')}
          title={t('social.missingConversation')}
        />
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title={t('social.repliesTitle')}>
      <div className="social-feed-layout social-replies-layout">
        <section aria-label={t('social.conversation')} className="social-post-list">
          <PostCard compact post={post} />
          <h2 className="social-replies-heading">{t('social.replies', { count: post.replies + replies.length })}</h2>
          {replies.map((item, index) => (
            <article className="social-post social-reply" key={`${item.author}-${index}`}>
              <header className="social-post-author">
                <img alt="" src={communityPortrait} />
                <div>
                  <strong>{item.author}</strong>
                  <span>{item.city} · {t('social.justNow')}</span>
                </div>
              </header>
              <p className="social-post-copy">{item.text}</p>
              <div className="social-post-actions">
                <button aria-label={t('social.likeReply')} type="button"><Heart aria-hidden="true" size={19} /><span>{t('social.like')}</span></button>
                <button aria-label={t('social.shareReply')} type="button"><Share2 aria-hidden="true" size={19} /><span>{t('social.share')}</span></button>
              </div>
            </article>
          ))}
          <form className="social-reply-form" onSubmit={submitReply}>
            <Input
              aria-label={t('social.yourReply')}
              label={t('social.replyConversation')}
              onChange={(event) => setReply(event.currentTarget.value)}
              placeholder={t('social.replyPlaceholder')}
              value={reply}
            />
            <Button aria-label={t('social.sendReply')} disabled={!reply.trim()} type="submit">
              <Send aria-hidden="true" size={18} />
              {t('social.reply')}
            </Button>
          </form>
        </section>
        <CommunitySidebar />
      </div>
    </ResponsiveLayout>
  )
}

export function CreatePage() {
  const { t } = useTranslation()
  return (
    <ResponsiveLayout title={t('social.create')}>
      <section className="social-create-placeholder">
        <span className="social-eyebrow"><Code2 aria-hidden="true" size={16} /> {t('social.createSpace')}</span>
        <h2>{t('social.createTitle')}</h2>
        <p>{t('social.createDescription')}</p>
        <Link className="social-inline-link" to="/home/reels">
          {t('social.backToFeed')} <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
    </ResponsiveLayout>
  )
}
