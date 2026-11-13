import {
  ArrowUpRight,
  Clock3,
  Code2,
  Heart,
  MessageCircle,
  Plus,
  Repeat2,
  Send,
  Share2,
  UsersRound,
  X,
} from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Input, Modal, ProgressBar } from '@/components'
import communityPortrait from '@/assets/community-portrait.jpg'
import { posts, type Post } from '@/data/posts'
import { ResponsiveLayout } from '@/layouts'

const textPosts = posts

type RoomCategory = 'SOS Debug' | 'Mini-Hackathon' | 'Code Review' | 'Coworking'

interface CodingRoom {
  id: string
  title: string
  titleKey?: string
  category: RoomCategory
  tags: string[]
  participants: Array<{ initials: string; name: string }>
  sharedCodeSnippet: string
}

const roomCategoryKeys: Record<RoomCategory, string> = {
  'SOS Debug': 'social.sosDebug',
  'Mini-Hackathon': 'social.miniHackathon',
  'Code Review': 'social.codeReview',
  Coworking: 'social.coworking',
}

const demoCodingRooms: CodingRoom[] = [
  {
    id: 'fastapi-async-debug',
    title: 'SOS Debug: Python & FastAPI Async Issue',
    titleKey: 'social.roomTitleDebugFastapi',
    category: 'SOS Debug',
    tags: ['python', 'fastapi', 'asyncio'],
    participants: [
      { initials: 'AM', name: 'Aminata' },
      { initials: 'JD', name: 'Jules' },
      { initials: 'SK', name: 'Samira' },
    ],
    sharedCodeSnippet: `async def get_items():
    return await client.fetch(...)`,
  },
  {
    id: 'climate-api-hackathon',
    title: 'Build a climate data API',
    titleKey: 'social.roomTitleClimateApi',
    category: 'Mini-Hackathon',
    tags: ['node', 'typescript', 'open-data'],
    participants: [
      { initials: 'ML', name: 'Malo' },
      { initials: 'FN', name: 'Fatou' },
      { initials: 'IK', name: 'Idriss' },
    ],
    sharedCodeSnippet: `app.get("/readings", async (req, res) => {
  // your turn
})`,
  },
  {
    id: 'react-hook-review',
    title: 'Can you review my React hook?',
    titleKey: 'social.roomTitleReactReview',
    category: 'Code Review',
    tags: ['react', 'typescript', 'hooks'],
    participants: [
      { initials: 'AM', name: 'Aminata' },
      { initials: 'LC', name: 'Lina' },
    ],
    sharedCodeSnippet: `function useSearch(query: string) {
  return useMemo(() => filter(query), [query])
}`,
  },
  {
    id: 'quiet-coworking',
    title: 'Ship the landing page together',
    titleKey: 'social.roomTitleCoworking',
    category: 'Coworking',
    tags: ['css', 'react', 'coworking'],
    participants: [
      { initials: 'JD', name: 'Jules' },
      { initials: 'SK', name: 'Samira' },
    ],
    sharedCodeSnippet: 'const nextTask = "polish the responsive layout";',
  },
]

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

export function CodingRoomsPage() {
  const { t } = useTranslation()
  const [rooms, setRooms] = useState(demoCodingRooms)
  const [joinedRoomIds, setJoinedRoomIds] = useState<string[]>([])
  const [hostModalOpen, setHostModalOpen] = useState(false)
  const [roomTitle, setRoomTitle] = useState('')
  const [roomCategory, setRoomCategory] = useState<RoomCategory>('SOS Debug')
  const [roomTags, setRoomTags] = useState('')
  const [sharedCodeSnippet, setSharedCodeSnippet] = useState('')
  const [status, setStatus] = useState('')

  const focusSessions = rooms.filter((room) => room.category === 'Coworking').length

  function joinRoom(room: CodingRoom) {
    setJoinedRoomIds((current) => current.includes(room.id) ? current : [...current, room.id])
    const title = room.titleKey ? t(room.titleKey) : room.title
    setStatus(t('social.joinedRoomNotice', { title }))
  }

  function hostRoom() {
    const cleanTitle = roomTitle.trim()
    if (!cleanTitle) return

    const room: CodingRoom = {
      id: `room-${Date.now().toString(36)}`,
      title: cleanTitle,
      category: roomCategory,
      tags: roomTags.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean),
      participants: [{ initials: 'ME', name: t('social.you') }],
      sharedCodeSnippet: sharedCodeSnippet.trim() || t('social.codePreviewEmpty'),
    }

    setRooms((current) => [room, ...current])
    setRoomTitle('')
    setRoomCategory('SOS Debug')
    setRoomTags('')
    setSharedCodeSnippet('')
    setStatus(t('social.roomCreatedNotice', { title: cleanTitle }))
  }

  return (
    <ResponsiveLayout title={t('social.codingRoomsTitle')}>
      <div className="social-rooms-layout">
        <section className="social-rooms-main">
          <header className="social-rooms-intro">
            <p>{t('social.codingRoomsSubtitle')}</p>
          </header>
          <section aria-labelledby="coding-rooms-live-title" className="social-rooms-section">
            <div className="social-rooms-section-heading">
              <h2 id="coding-rooms-live-title">{t('social.liveNow')}</h2>
              <Badge>{rooms.length} {t('social.liveRooms')}</Badge>
            </div>
            <div className="social-room-grid">
              {rooms.map((room) => {
                const joined = joinedRoomIds.includes(room.id)
                const title = room.titleKey ? t(room.titleKey) : room.title
                return (
                  <Card
                    action={<Badge variant="success">{t('social.liveBadge')}</Badge>}
                    className="social-room-card"
                    key={room.id}
                    title={title}
                  >
                    <p className="social-room-category">{t(roomCategoryKeys[room.category])}</p>
                    <div aria-label={t('social.roomTags')} className="social-room-tags">
                      {room.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                    </div>
                    <div aria-label={t('social.connectedParticipants', { count: room.participants.length })} className="social-room-participants">
                      <div className="social-room-avatars">
                        {room.participants.slice(0, 4).map((participant) => (
                          <span aria-label={participant.name} className="social-room-avatar" key={`${room.id}-${participant.initials}`} title={participant.name}>
                            {participant.initials}
                          </span>
                        ))}
                      </div>
                      <span>{t('social.connectedParticipants', { count: room.participants.length })}</span>
                    </div>
                    <pre aria-label={t('social.sharedCodePreview')} className="social-room-code"><code>{room.sharedCodeSnippet}</code></pre>
                    <Button
                      className="social-room-join"
                      disabled={joined}
                      onClick={() => joinRoom(room)}
                      type="button"
                    >
                      {joined ? t('social.joinedRoom') : t('social.joinRoom')}
                    </Button>
                  </Card>
                )
              })}
            </div>
          </section>
          <p aria-live="polite" className="social-rooms-status">{status}</p>
        </section>
        <aside aria-label={t('social.focusSprints')} className="social-rooms-sidebar">
          <section className="social-aside-card social-prompt-card social-focus-card">
            <span className="social-eyebrow"><Clock3 aria-hidden="true" size={16} /> {t('social.focusSprints')}</span>
            <p className="social-focus-count"><strong>{focusSessions}</strong><span>{t('social.focusSessionsInProgress', { count: focusSessions })}</span></p>
            <p>{t('social.focusSprintsDescription')}</p>
            <Button onClick={() => setHostModalOpen(true)} type="button">
              <Plus aria-hidden="true" size={18} /> {t('social.hostRoom')}
            </Button>
          </section>
        </aside>
      </div>
      <Modal
        confirmDisabled={!roomTitle.trim()}
        confirmLabel={t('social.createRoom')}
        onClose={() => setHostModalOpen(false)}
        onConfirm={hostRoom}
        open={hostModalOpen}
        title={t('social.hostRoomTitle')}
      >
        <div className="social-room-form">
          <Input
            autoFocus
            label={t('social.roomTitle')}
            maxLength={90}
            onChange={(event) => setRoomTitle(event.currentTarget.value)}
            placeholder={t('social.roomTitlePlaceholder')}
            value={roomTitle}
          />
          <div className="ui-field">
            <label className="ui-label" htmlFor="coding-room-category">{t('social.roomCategory')}</label>
            <select
              className="ui-input"
              id="coding-room-category"
              onChange={(event) => setRoomCategory(event.currentTarget.value as RoomCategory)}
              value={roomCategory}
            >
              {(Object.keys(roomCategoryKeys) as RoomCategory[]).map((category) => (
                <option key={category} value={category}>{t(roomCategoryKeys[category])}</option>
              ))}
            </select>
          </div>
          <Input
            label={t('social.roomTags')}
            onChange={(event) => setRoomTags(event.currentTarget.value)}
            placeholder={t('social.roomTagsPlaceholder')}
            value={roomTags}
          />
          <div className="ui-field">
            <label className="ui-label" htmlFor="coding-room-code">{t('social.sharedCodePreview')}</label>
            <textarea
              className="ui-input social-room-code-input"
              id="coding-room-code"
              onChange={(event) => setSharedCodeSnippet(event.currentTarget.value)}
              placeholder={t('social.codePreviewPlaceholder')}
              rows={4}
              value={sharedCodeSnippet}
            />
          </div>
        </div>
      </Modal>
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
        <Link className="social-inline-link" to="/coding-rooms">
          {t('social.backToFeed')} <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
    </ResponsiveLayout>
  )
}
