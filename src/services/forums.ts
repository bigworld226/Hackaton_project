import { supabase } from '@/lib/supabase'

export interface ForumThreadRow {
  id: string
  author_id: string
  author_name: string
  title: string
  body: string
  city: string
  country_code: string
  tags: string[]
  created_at: string
  replies: number
  views: number
}

export interface ForumReplyRow {
  id: string
  author_id: string
  author_name: string
  body: string
  created_at: string
}

export interface CreateForumThreadInput {
  title: string
  body: string
  city: string
  countryCode: string
  tags: string[]
}

export async function getForumThreads(filters?: { city?: string; countryCode?: string }) {
  let query = supabase.from('forum_thread_feed').select('*').order('created_at', { ascending: false })
  if (filters?.city) query = query.eq('city', filters.city)
  if (filters?.countryCode) query = query.eq('country_code', filters.countryCode)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ForumThreadRow[]
}

export async function getForumThread(id: string) {
  const { data, error } = await supabase
    .from('forum_thread_feed')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as ForumThreadRow | null
}

export async function getForumReplies(threadId: string) {
  const { data, error } = await supabase
    .from('thread_reply_feed')
    .select('id, author_id, author_name, body, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as ForumReplyRow[]
}

export async function createForumThread(input: CreateForumThreadInput) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('AUTH_REQUIRED')

  const { data, error } = await supabase
    .from('forum_threads')
    .insert({
      author_id: user.id,
      body: input.body,
      city: input.city,
      country_code: input.countryCode,
      tags: input.tags,
      title: input.title,
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

export async function createForumReply(threadId: string, body: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('AUTH_REQUIRED')

  const { data, error } = await supabase
    .from('thread_replies')
    .insert({ author_id: user.id, body, thread_id: threadId })
    .select('id')
    .single()
  if (error) throw error

  const { data: profile, error: profileError } = await supabase
    .rpc('get_public_profile', { p_profile_id: user.id })
  if (profileError) throw profileError
  const publicProfile = Array.isArray(profile) ? profile[0] : profile

  return {
    ...data,
    author_name: publicProfile?.display_name ?? 'Toi',
  } as ForumReplyRow
}
