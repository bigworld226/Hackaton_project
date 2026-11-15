import { supabase } from '@/lib/supabase'

export interface SocialPostRecord {
  id: string
  author_id: string
  display_name: string
  handle: string
  city: string | null
  body: string
  tags: string[]
  attachments: unknown[]
  created_at: string
  likes: number
  replies: number
  reposts: number
}

export interface SocialCommentRecord {
  id: string
  post_id: string
  author_id: string
  author_name: string
  city: string | null
  body: string
  created_at: string
}

export async function getSocialPosts() {
  const { data, error } = await supabase
    .from('social_post_feed')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as SocialPostRecord[]
}

export async function getSocialPost(id: string) {
  const { data, error } = await supabase
    .from('social_post_feed')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as SocialPostRecord | null
}

export async function getSocialComments(postId: string) {
  const { data, error } = await supabase
    .from('post_comment_feed')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as SocialCommentRecord[]
}

export async function addSocialComment(postId: string, body: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('AUTH_REQUIRED')

  const { data, error } = await supabase
    .from('post_comments')
    .insert({ author_id: user.id, body, post_id: postId })
    .select('id, post_id, author_id, body, created_at')
    .single()
  if (error) throw error

  const { data: profile, error: profileError } = await supabase
    .rpc('get_public_profile', { p_profile_id: user.id })
  if (profileError) throw profileError
  const publicProfile = Array.isArray(profile) ? profile[0] : profile

  return {
    ...data,
    author_name: publicProfile?.display_name ?? 'Toi',
    city: publicProfile?.city ?? null,
  } as SocialCommentRecord
}

export async function getMyPostReactions(postIds: string[]) {
  if (postIds.length === 0) return new Set<string>()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) return new Set<string>()

  const { data, error } = await supabase
    .from('post_reactions')
    .select('post_id, reaction')
    .eq('profile_id', user.id)
    .in('post_id', postIds)
  if (error) throw error
  return new Set((data ?? []).map((reaction) => `${reaction.post_id}:${reaction.reaction}`))
}

export async function togglePostReaction(postId: string, reaction: 'like' | 'repost') {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('AUTH_REQUIRED')

  const { data: existing, error: queryError } = await supabase
    .from('post_reactions')
    .select('post_id')
    .eq('post_id', postId)
    .eq('profile_id', user.id)
    .eq('reaction', reaction)
    .maybeSingle()
  if (queryError) throw queryError

  if (existing) {
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('profile_id', user.id)
      .eq('reaction', reaction)
    if (error) throw error
    return false
  }

  const { error } = await supabase
    .from('post_reactions')
    .insert({ post_id: postId, profile_id: user.id, reaction })
  if (error) throw error
  return true
}
