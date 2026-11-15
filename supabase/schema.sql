-- Common: initial Supabase schema
-- Run once in Supabase Dashboard > SQL Editor on a new project.
-- Auth identities stay in auth.users; never insert passwords or user rows here.

begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (handle = lower(handle) and handle ~ '^[a-z0-9_.-]{3,30}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text not null default '' check (char_length(bio) <= 500),
  avatar_url text,
  city text,
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  languages text[] not null default '{}',
  profile_visibility text not null default 'public' check (profile_visibility in ('public', 'private')),
  show_city boolean not null default true,
  map_visibility text not null default 'ghost' check (map_visibility in ('visible', 'ghost')),
  map_latitude double precision,
  map_longitude double precision,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  language text not null default 'fr' check (language in ('fr', 'en')),
  activity_status boolean not null default true,
  personalized_content boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((map_latitude is null) = (map_longitude is null)),
  check (map_latitude is null or map_latitude between -90 and 90),
  check (map_longitude is null or map_longitude between -180 and 180)
);

create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);

create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 10000),
  tags text[] not null default '{}',
  attachments jsonb not null default '[]'::jsonb check (jsonb_typeof(attachments) = 'array'),
  visibility text not null default 'public' check (visibility in ('public', 'followers')),
  status text not null default 'published' check (status in ('draft', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.social_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.post_comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_reactions (
  post_id uuid not null references public.social_posts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null check (reaction in ('like', 'repost')),
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id, reaction)
);

create table public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 8 and 180),
  body text not null check (char_length(body) between 12 and 20000),
  city text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  tags text[] not null default '{}',
  status text not null default 'published' check (status in ('published', 'locked', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.thread_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_reply_id uuid references public.thread_replies(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.thread_views (
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  viewer_id uuid not null references public.profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (thread_id, viewer_id)
);

create table public.coding_rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  category text not null check (category in ('SOS Debug', 'Mini-Hackathon', 'Code Review', 'Coworking')),
  tags text[] not null default '{}',
  shared_code_snippet text not null default '' check (char_length(shared_code_snippet) <= 20000),
  city text,
  status text not null default 'live' check (status in ('live', 'ended', 'cancelled')),
  max_participants smallint not null default 12 check (max_participants between 2 and 100),
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

create table public.room_members (
  room_id uuid not null references public.coding_rooms(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'participant' check (role in ('host', 'participant')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (room_id, profile_id)
);

create table public.room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.coding_rooms(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  member_a uuid not null references public.profiles(id) on delete cascade,
  member_b uuid not null references public.profiles(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (member_a <> member_b)
);

create unique index conversations_unique_pair
  on public.conversations (least(member_a, member_b), greatest(member_a, member_b));

create table public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 10000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  kind text not null check (kind in ('like', 'reply', 'follow', 'quiz', 'badge', 'message', 'room_invite', 'system')),
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null default 'sparkles',
  points_reward integer not null default 0 check (points_reward >= 0)
);

create table public.user_badges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

create table public.point_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null check (points <> 0),
  event_type text not null check (event_type in ('post_created', 'room_hosted', 'helpful_reply', 'quiz_completion', 'contest_bonus', 'admin_adjustment')),
  related_id uuid,
  created_at timestamptz not null default now(),
  unique (profile_id, event_type, related_id)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) between 12 and 3000),
  topic text not null,
  difficulty text not null check (difficulty in ('Débutant', 'Intermédiaire', 'Avancé')),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  position smallint not null check (position > 0),
  prompt text not null check (char_length(prompt) between 8 and 2000),
  explanation text not null default '',
  created_at timestamptz not null default now(),
  unique (quiz_id, position)
);

create table public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  position smallint not null check (position > 0),
  body text not null check (char_length(body) between 1 and 1000),
  is_correct boolean not null default false,
  unique (question_id, position),
  unique (question_id, id)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null default 0 check (score >= 0),
  total_questions integer not null default 0 check (total_questions >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.quiz_attempt_answers (
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  selected_option_id uuid not null,
  is_correct boolean not null,
  primary key (attempt_id, question_id),
  foreign key (question_id, selected_option_id)
    references public.quiz_options(question_id, id) on delete cascade
);

create table public.monthly_challenges (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  unique (city, country_code, starts_at)
);

insert into public.monthly_challenges (city, country_code, title, starts_at, ends_at)
values (
  'Dakar',
  'SN',
  'Tournoi des champions - Dakar',
  date_trunc('month', now()),
  date_trunc('month', now()) + interval '1 month'
)
on conflict (city, country_code, starts_at) do nothing;

create table public.monthly_challenge_finalists (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.monthly_challenges(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  position smallint not null check (position between 1 and 3),
  points integer not null default 0 check (points >= 0),
  tech_score smallint not null check (tech_score between 0 and 100),
  created_at timestamptz not null default now(),
  unique (challenge_id, profile_id),
  unique (challenge_id, position),
  unique (challenge_id, id)
);

create table public.monthly_challenge_votes (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.monthly_challenges(id) on delete cascade,
  finalist_id uuid not null,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (challenge_id, voter_id),
  foreign key (challenge_id, finalist_id)
    references public.monthly_challenge_finalists(challenge_id, id) on delete cascade
);

create index follows_followed_id_idx on public.follows (followed_id);
create index social_posts_feed_idx on public.social_posts (status, created_at desc);
create index social_posts_author_idx on public.social_posts (author_id, created_at desc);
create index post_comments_post_idx on public.post_comments (post_id, created_at);
create index forum_threads_city_idx on public.forum_threads (country_code, city, status, created_at desc);
create index thread_replies_thread_idx on public.thread_replies (thread_id, created_at);
create index coding_rooms_live_idx on public.coding_rooms (status, city, created_at desc);
create index room_messages_room_idx on public.room_messages (room_id, created_at);
create index direct_messages_conversation_idx on public.direct_messages (conversation_id, created_at);
create index notifications_recipient_idx on public.notifications (recipient_id, created_at desc);
create index point_events_profile_idx on public.point_events (profile_id, created_at desc);
create index quizzes_public_idx on public.quizzes (is_published, created_at desc);
create index monthly_challenges_city_idx on public.monthly_challenges (country_code, city, starts_at desc);
create index map_profiles_idx on public.profiles (map_visibility, country_code, city)
  where map_latitude is not null and map_longitude is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger posts_set_updated_at before update on public.social_posts
for each row execute function public.set_updated_at();
create trigger comments_set_updated_at before update on public.post_comments
for each row execute function public.set_updated_at();
create trigger threads_set_updated_at before update on public.forum_threads
for each row execute function public.set_updated_at();
create trigger thread_replies_set_updated_at before update on public.thread_replies
for each row execute function public.set_updated_at();
create trigger quizzes_set_updated_at before update on public.quizzes
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_source text;
  v_handle text;
  v_display_name text;
begin
  v_source := coalesce(new.raw_user_meta_data ->> 'handle', split_part(coalesce(new.email, 'developer'), '@', 1));
  v_handle := lower(regexp_replace(v_source, '[^a-zA-Z0-9_.-]', '', 'g'));
  if char_length(v_handle) < 3 then
    v_handle := 'dev';
  end if;
  v_handle := left(v_handle, 22) || '_' || substr(replace(new.id::text, '-', ''), 1, 7);
  v_display_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    split_part(coalesce(new.email, 'Developer'), '@', 1)
  );

  insert into public.profiles (id, handle, display_name, city, country_code)
  values (
    new.id,
    v_handle,
    v_display_name,
    nullif(new.raw_user_meta_data ->> 'city', ''),
    upper(nullif(new.raw_user_meta_data ->> 'country_code', ''))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.add_room_host_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.room_members (room_id, profile_id, role)
  values (new.id, new.host_id, 'host')
  on conflict (room_id, profile_id) do nothing;
  return new;
end;
$$;

create trigger coding_room_add_host
  after insert on public.coding_rooms
  for each row execute function public.add_room_host_membership();

create or replace function public.is_public_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_profile_id and p.profile_visibility = 'public'
  );
$$;

revoke all on function public.is_public_profile(uuid) from public;
grant execute on function public.is_public_profile(uuid) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.social_posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.forum_threads enable row level security;
alter table public.thread_replies enable row level security;
alter table public.thread_views enable row level security;
alter table public.coding_rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.room_messages enable row level security;
alter table public.conversations enable row level security;
alter table public.direct_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.point_events enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_attempt_answers enable row level security;
alter table public.monthly_challenges enable row level security;
alter table public.monthly_challenge_finalists enable row level security;
alter table public.monthly_challenge_votes enable row level security;

create policy profiles_read_self on public.profiles
for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_self on public.profiles
for update to authenticated using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy follows_read on public.follows
for select to anon, authenticated using (
  follower_id = (select auth.uid())
  or followed_id = (select auth.uid())
  or public.is_public_profile(followed_id)
);
create policy follows_insert_self on public.follows
for insert to authenticated with check (follower_id = (select auth.uid()));
create policy follows_delete_self on public.follows
for delete to authenticated using (follower_id = (select auth.uid()));

create policy social_posts_read on public.social_posts
for select to anon, authenticated using (
  author_id = (select auth.uid())
  or (
    status = 'published'
    and (
      public.is_public_profile(author_id)
      and (
        visibility = 'public'
        or exists (
          select 1 from public.follows f
          where f.follower_id = (select auth.uid()) and f.followed_id = author_id
        )
      )
    )
  )
);
create policy social_posts_insert_self on public.social_posts
for insert to authenticated with check (author_id = (select auth.uid()));
create policy social_posts_update_self on public.social_posts
for update to authenticated using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));
create policy social_posts_delete_self on public.social_posts
for delete to authenticated using (author_id = (select auth.uid()));

create policy post_comments_read on public.post_comments
for select to anon, authenticated using (
  author_id = (select auth.uid())
  or exists (
    select 1
    from public.social_posts p
    where p.id = post_id
      and p.status = 'published'
      and (
        (p.visibility = 'public' and public.is_public_profile(p.author_id))
        or exists (
          select 1 from public.follows f
          where f.follower_id = (select auth.uid()) and f.followed_id = p.author_id
        )
      )
  )
);
create policy post_comments_insert_self on public.post_comments
for insert to authenticated with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.social_posts p
    where p.id = post_id and p.status = 'published'
      and (
        p.author_id = (select auth.uid())
        or p.visibility = 'public'
        or exists (
          select 1 from public.follows f
          where f.follower_id = (select auth.uid()) and f.followed_id = p.author_id
        )
      )
  )
);
create policy post_comments_update_self on public.post_comments
for update to authenticated using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));
create policy post_comments_delete_self on public.post_comments
for delete to authenticated using (author_id = (select auth.uid()));

create policy post_reactions_read on public.post_reactions
for select to anon, authenticated using (
  exists (
    select 1 from public.social_posts p
    where p.id = post_id and p.status = 'published'
      and (
        p.author_id = (select auth.uid())
        or (p.visibility = 'public' and public.is_public_profile(p.author_id))
        or exists (
          select 1 from public.follows f
          where f.follower_id = (select auth.uid()) and f.followed_id = p.author_id
        )
      )
  )
);
create policy post_reactions_insert_self on public.post_reactions
for insert to authenticated with check (
  profile_id = (select auth.uid())
  and exists (
    select 1 from public.social_posts p where p.id = post_id and p.status = 'published'
      and (
        p.author_id = (select auth.uid())
        or p.visibility = 'public'
        or exists (
          select 1 from public.follows f
          where f.follower_id = (select auth.uid()) and f.followed_id = p.author_id
        )
      )
  )
);
create policy post_reactions_delete_self on public.post_reactions
for delete to authenticated using (profile_id = (select auth.uid()));

create policy forum_threads_read on public.forum_threads
for select to anon, authenticated using (
  author_id = (select auth.uid())
  or (
    status = 'published'
    and public.is_public_profile(author_id)
  )
);
create policy forum_threads_insert_self on public.forum_threads
for insert to authenticated with check (author_id = (select auth.uid()));
create policy forum_threads_update_self on public.forum_threads
for update to authenticated using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));
create policy forum_threads_delete_self on public.forum_threads
for delete to authenticated using (author_id = (select auth.uid()));

create policy thread_replies_read on public.thread_replies
for select to anon, authenticated using (
  author_id = (select auth.uid())
  or exists (select 1 from public.forum_threads t where t.id = thread_id and t.status = 'published')
);
create policy thread_replies_insert_self on public.thread_replies
for insert to authenticated with check (
  author_id = (select auth.uid())
  and exists (select 1 from public.forum_threads t where t.id = thread_id and t.status = 'published')
);
create policy thread_replies_update_self on public.thread_replies
for update to authenticated using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));
create policy thread_replies_delete_self on public.thread_replies
for delete to authenticated using (author_id = (select auth.uid()));

create policy thread_views_read_self on public.thread_views
for select to authenticated using (viewer_id = (select auth.uid()));
create policy thread_views_insert_self on public.thread_views
for insert to authenticated with check (viewer_id = (select auth.uid()));

create policy coding_rooms_read_live on public.coding_rooms
for select to anon, authenticated using (status = 'live' or host_id = (select auth.uid()));
create policy coding_rooms_insert_self on public.coding_rooms
for insert to authenticated with check (host_id = (select auth.uid()));
create policy coding_rooms_update_host on public.coding_rooms
for update to authenticated using (host_id = (select auth.uid()))
with check (host_id = (select auth.uid()));
create policy coding_rooms_delete_host on public.coding_rooms
for delete to authenticated using (host_id = (select auth.uid()));

create policy room_members_read on public.room_members
for select to authenticated using (
  profile_id = (select auth.uid())
  or exists (select 1 from public.coding_rooms r where r.id = room_id and r.host_id = (select auth.uid()))
);
create policy room_members_join_self on public.room_members
for insert to authenticated with check (
  profile_id = (select auth.uid())
  and role = 'participant'
  and exists (select 1 from public.coding_rooms r where r.id = room_id and r.status = 'live')
);
create policy room_members_leave_self on public.room_members
for update to authenticated using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()) and role = 'participant');
create policy room_members_delete_self on public.room_members
for delete to authenticated using (profile_id = (select auth.uid()) and role = 'participant');

create policy room_messages_read_members on public.room_messages
for select to authenticated using (
  exists (
    select 1 from public.room_members m
    where m.room_id = public.room_messages.room_id
      and m.profile_id = (select auth.uid())
      and m.left_at is null
  )
);
create policy room_messages_insert_members on public.room_messages
for insert to authenticated with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.room_members m
    where m.room_id = public.room_messages.room_id
      and m.profile_id = (select auth.uid())
      and m.left_at is null
  )
);

create policy conversations_read_members on public.conversations
for select to authenticated using ((select auth.uid()) in (member_a, member_b));
create policy conversations_insert_member on public.conversations
for insert to authenticated with check (
  created_by = (select auth.uid())
  and (select auth.uid()) in (member_a, member_b)
);
create policy direct_messages_read_members on public.direct_messages
for select to authenticated using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (select auth.uid()) in (c.member_a, c.member_b)
  )
);
create policy direct_messages_insert_sender on public.direct_messages
for insert to authenticated with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (select auth.uid()) in (c.member_a, c.member_b)
  )
);
create policy direct_messages_mark_read on public.direct_messages
for update to authenticated using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (select auth.uid()) in (c.member_a, c.member_b)
  )
) with check (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (select auth.uid()) in (c.member_a, c.member_b)
  )
);

create policy notifications_read_recipient on public.notifications
for select to authenticated using (recipient_id = (select auth.uid()));
create policy notifications_update_recipient on public.notifications
for update to authenticated using (recipient_id = (select auth.uid()))
with check (recipient_id = (select auth.uid()));
create policy notifications_delete_recipient on public.notifications
for delete to authenticated using (recipient_id = (select auth.uid()));

create policy badges_read on public.badges
for select to anon, authenticated using (true);
create policy user_badges_read on public.user_badges
for select to anon, authenticated using (
  profile_id = (select auth.uid()) or public.is_public_profile(profile_id)
);
create policy point_events_read_self on public.point_events
for select to authenticated using (profile_id = (select auth.uid()));

create policy quizzes_read on public.quizzes
for select to anon, authenticated using (is_published or creator_id = (select auth.uid()));
create policy quizzes_insert_self on public.quizzes
for insert to authenticated with check (creator_id = (select auth.uid()));
create policy quizzes_update_self on public.quizzes
for update to authenticated using (creator_id = (select auth.uid()))
with check (creator_id = (select auth.uid()));
create policy quizzes_delete_self on public.quizzes
for delete to authenticated using (creator_id = (select auth.uid()));

create policy quiz_questions_read on public.quiz_questions
for select to anon, authenticated using (
  exists (select 1 from public.quizzes q where q.id = quiz_id and (q.is_published or q.creator_id = (select auth.uid())))
);
create policy quiz_questions_manage on public.quiz_questions
for all to authenticated using (
  exists (select 1 from public.quizzes q where q.id = quiz_id and q.creator_id = (select auth.uid()))
) with check (
  exists (select 1 from public.quizzes q where q.id = quiz_id and q.creator_id = (select auth.uid()))
);

-- Correct answers are hidden from players; use get_quiz_for_play() to fetch choices.
create policy quiz_options_owner_read on public.quiz_options
for select to authenticated using (
  exists (
    select 1 from public.quiz_questions q join public.quizzes z on z.id = q.quiz_id
    where q.id = question_id and z.creator_id = (select auth.uid())
  )
);
create policy quiz_options_manage on public.quiz_options
for all to authenticated using (
  exists (
    select 1 from public.quiz_questions q join public.quizzes z on z.id = q.quiz_id
    where q.id = question_id and z.creator_id = (select auth.uid())
  )
) with check (
  exists (
    select 1 from public.quiz_questions q join public.quizzes z on z.id = q.quiz_id
    where q.id = question_id and z.creator_id = (select auth.uid())
  )
);

create policy quiz_attempts_read_self on public.quiz_attempts
for select to authenticated using (profile_id = (select auth.uid()));
create policy quiz_attempt_answers_read_self on public.quiz_attempt_answers
for select to authenticated using (
  exists (select 1 from public.quiz_attempts a where a.id = attempt_id and a.profile_id = (select auth.uid()))
);

create policy monthly_challenges_read on public.monthly_challenges
for select to anon, authenticated using (true);
create policy monthly_finalists_read on public.monthly_challenge_finalists
for select to anon, authenticated using (public.is_public_profile(profile_id));
create policy monthly_votes_read_self on public.monthly_challenge_votes
for select to authenticated using (voter_id = (select auth.uid()));
create policy monthly_votes_insert_one on public.monthly_challenge_votes
for insert to authenticated with check (
  voter_id = (select auth.uid())
  and exists (
    select 1
    from public.monthly_challenges c
    join public.monthly_challenge_finalists f on f.challenge_id = c.id
    where c.id = public.monthly_challenge_votes.challenge_id
      and f.id = public.monthly_challenge_votes.finalist_id
      and f.profile_id <> (select auth.uid())
      and now() between c.starts_at and c.ends_at
  )
);

-- Client permissions are explicit; RLS below decides which rows are accessible.
revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (handle, display_name, bio, avatar_url, city, country_code, languages,
  profile_visibility, show_city, map_visibility, map_latitude, map_longitude,
  theme, language, activity_status, personalized_content) on public.profiles to authenticated;

grant select, insert, delete on public.follows to authenticated;
grant select on public.follows to anon;
grant select, insert, update, delete on public.social_posts to authenticated;
grant select on public.social_posts to anon;
grant select, insert, update, delete on public.post_comments to authenticated;
grant select on public.post_comments to anon;
grant select, insert, delete on public.post_reactions to authenticated;
grant select on public.post_reactions to anon;
grant select, insert, update, delete on public.forum_threads to authenticated;
grant select on public.forum_threads to anon;
grant select, insert, update, delete on public.thread_replies to authenticated;
grant select on public.thread_replies to anon;
grant select, insert on public.thread_views to authenticated;
grant select, insert, update, delete on public.coding_rooms to authenticated;
grant select on public.coding_rooms to anon;
grant select, insert, delete on public.room_members to authenticated;
grant update (left_at) on public.room_members to authenticated;
grant select, insert on public.room_messages to authenticated;
grant select, insert on public.conversations to authenticated;
grant select, insert on public.direct_messages to authenticated;
grant update (read_at) on public.direct_messages to authenticated;
grant select, delete on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant select on public.badges, public.user_badges to anon, authenticated;
grant select on public.point_events to authenticated;
grant select, insert, update, delete on public.quizzes to authenticated;
grant select on public.quizzes to anon;
grant select, insert, update, delete on public.quiz_questions, public.quiz_options to authenticated;
grant select on public.quiz_questions to anon;
grant select on public.quiz_attempts, public.quiz_attempt_answers to authenticated;
grant select on public.monthly_challenges, public.monthly_challenge_finalists to anon, authenticated;
grant select, insert on public.monthly_challenge_votes to authenticated;

create or replace view public.social_post_feed as
select
  p.id,
  p.author_id,
  pr.display_name,
  pr.handle,
  case when pr.show_city then pr.city else null end as city,
  p.body,
  p.tags,
  p.attachments,
  p.created_at,
  count(distinct r.profile_id) filter (where r.reaction = 'like') as likes,
  count(distinct c.id) as replies,
  count(distinct r.profile_id) filter (where r.reaction = 'repost') as reposts
from public.social_posts p
join public.profiles pr on pr.id = p.author_id and pr.profile_visibility = 'public'
left join public.post_reactions r on r.post_id = p.id
left join public.post_comments c on c.post_id = p.id
where p.status = 'published' and p.visibility = 'public'
group by p.id, pr.id;

grant select on public.social_post_feed to anon, authenticated;

create or replace view public.post_comment_feed as
select
  c.id,
  c.post_id,
  c.author_id,
  p.display_name as author_name,
  case when p.show_city then p.city else null end as city,
  c.body,
  c.created_at
from public.post_comments c
join public.profiles p on p.id = c.author_id and p.profile_visibility = 'public'
join public.social_posts post on post.id = c.post_id and post.status = 'published'
where (post.visibility = 'public' and public.is_public_profile(post.author_id));

grant select on public.post_comment_feed to anon, authenticated;

create or replace view public.forum_thread_feed as
select
  t.id,
  t.author_id,
  p.display_name as author_name,
  t.title,
  t.body,
  t.city,
  t.country_code,
  t.tags,
  t.created_at,
  count(distinct r.id) as replies,
  count(distinct v.viewer_id) as views
from public.forum_threads t
join public.profiles p on p.id = t.author_id and p.profile_visibility = 'public'
left join public.thread_replies r on r.thread_id = t.id
left join public.thread_views v on v.thread_id = t.id
where t.status = 'published'
group by t.id, p.id;

grant select on public.forum_thread_feed to anon, authenticated;

create or replace view public.thread_reply_feed as
select
  r.id,
  r.thread_id,
  r.author_id,
  p.display_name as author_name,
  r.body,
  r.created_at
from public.thread_replies r
join public.profiles p on p.id = r.author_id and p.profile_visibility = 'public';

grant select on public.thread_reply_feed to anon, authenticated;

create or replace view public.monthly_challenge_results as
select
  f.id as finalist_id,
  f.challenge_id,
  c.city,
  c.country_code,
  f.profile_id,
  p.display_name,
  p.handle,
  f.position,
  f.points,
  f.tech_score,
  count(v.id)::bigint as public_votes
from public.monthly_challenge_finalists f
join public.monthly_challenges c on c.id = f.challenge_id
join public.profiles p on p.id = f.profile_id and p.profile_visibility = 'public'
left join public.monthly_challenge_votes v on v.finalist_id = f.id
group by f.id, c.id, p.id;

grant select on public.monthly_challenge_results to anon, authenticated;

create or replace view public.monthly_city_leaderboard as
with month_points as (
  select profile_id, sum(points)::bigint as points
  from public.point_events
  where created_at >= date_trunc('month', now())
    and created_at < date_trunc('month', now()) + interval '1 month'
  group by profile_id
), ranked as (
  select
    p.id as profile_id,
    p.display_name,
    p.handle,
    case when p.show_city then p.city else null end as city,
    coalesce(mp.points, 0)::bigint as points,
    row_number() over (partition by p.country_code, p.city order by coalesce(mp.points, 0) desc, p.created_at) as rank
  from public.profiles p
  left join month_points mp on mp.profile_id = p.id
  where p.profile_visibility = 'public' and p.show_city and p.city is not null
)
select * from ranked;

grant select on public.monthly_city_leaderboard to anon, authenticated;

create or replace view public.global_leaderboard as
select
  p.id as profile_id,
  p.display_name,
  p.handle,
  case when p.show_city then p.city else null end as city,
  coalesce(sum(e.points), 0)::bigint as points,
  row_number() over (order by coalesce(sum(e.points), 0) desc, p.created_at) as rank
from public.profiles p
left join public.point_events e on e.profile_id = p.id
where p.profile_visibility = 'public'
group by p.id;

grant select on public.global_leaderboard to anon, authenticated;

create or replace function public.get_nearby_developers(
  p_latitude double precision,
  p_longitude double precision,
  p_radius_km double precision default 5
)
returns table (
  profile_id uuid,
  display_name text,
  handle text,
  avatar_url text,
  city text,
  languages text[],
  points bigint,
  latitude double precision,
  longitude double precision,
  distance_km double precision
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_latitude is null or p_latitude not between -90 and 90
    or p_longitude is null or p_longitude not between -180 and 180
    or p_radius_km is null or p_radius_km not between 0.1 and 100 then
    raise exception 'Invalid map coordinates or radius';
  end if;

  return query
  select
    p.id,
    p.display_name,
    p.handle,
    p.avatar_url,
    case when p.show_city then p.city else null end,
    p.languages,
    coalesce((select sum(e.points)::bigint from public.point_events e where e.profile_id = p.id), 0),
    round(p.map_latitude::numeric, 3)::double precision,
    round(p.map_longitude::numeric, 3)::double precision,
    d.distance_km
  from public.profiles p
  cross join lateral (
    select 6371.0::double precision * acos(least(1.0::double precision, greatest(-1.0::double precision,
      sin(radians(p_latitude)) * sin(radians(p.map_latitude))
      + cos(radians(p_latitude)) * cos(radians(p.map_latitude))
      * cos(radians(p.map_longitude - p_longitude))
    ))) as distance_km
  ) d
  where p.profile_visibility = 'public'
    and p.map_visibility = 'visible'
    and p.map_latitude is not null
    and d.distance_km <= p_radius_km
  order by d.distance_km
  limit 200;
end;
$$;

revoke all on function public.get_nearby_developers(double precision, double precision, double precision) from public;
grant execute on function public.get_nearby_developers(double precision, double precision, double precision) to anon, authenticated;

create or replace function public.get_public_profile(p_profile_id uuid)
returns table (
  profile_id uuid,
  display_name text,
  handle text,
  bio text,
  avatar_url text,
  city text,
  languages text[],
  points bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.display_name,
    p.handle,
    p.bio,
    p.avatar_url,
    case when p.show_city then p.city else null end,
    p.languages,
    coalesce((select sum(e.points)::bigint from public.point_events e where e.profile_id = p.id), 0)
  from public.profiles p
  where p.id = p_profile_id and p.profile_visibility = 'public';
$$;

revoke all on function public.get_public_profile(uuid) from public;
grant execute on function public.get_public_profile(uuid) to anon, authenticated;

create or replace function public.get_quiz_for_play(p_quiz_id uuid)
returns table (
  question_id uuid,
  question_position smallint,
  prompt text,
  options jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    q.id,
    q.position,
    q.prompt,
    coalesce(jsonb_agg(jsonb_build_object('id', o.id, 'body', o.body) order by o.position), '[]'::jsonb)
  from public.quiz_questions q
  join public.quizzes z on z.id = q.quiz_id and z.is_published
  left join public.quiz_options o on o.question_id = q.id
  where q.quiz_id = p_quiz_id
  group by q.id
  order by q.position;
$$;

revoke all on function public.get_quiz_for_play(uuid) from public;
grant execute on function public.get_quiz_for_play(uuid) to authenticated;

create or replace function public.submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt_id uuid;
  v_question_count integer;
  v_score integer := 0;
  v_item jsonb;
  v_question_id uuid;
  v_option_id uuid;
  v_is_correct boolean;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'array' then
    raise exception 'Answers must be a JSON array';
  end if;
  if not exists (select 1 from public.quizzes q where q.id = p_quiz_id and q.is_published) then
    raise exception 'Quiz not found';
  end if;

  select count(*) into v_question_count
  from public.quiz_questions q where q.quiz_id = p_quiz_id;
  if v_question_count = 0 or jsonb_array_length(p_answers) <> v_question_count then
    raise exception 'One answer is required for every quiz question';
  end if;

  insert into public.quiz_attempts (quiz_id, profile_id, total_questions)
  values (p_quiz_id, auth.uid(), v_question_count)
  returning id into v_attempt_id;

  for v_item in select value from jsonb_array_elements(p_answers) as answers(value) loop
    v_question_id := (v_item ->> 'question_id')::uuid;
    v_option_id := (v_item ->> 'option_id')::uuid;

    if not exists (
      select 1 from public.quiz_questions q where q.id = v_question_id and q.quiz_id = p_quiz_id
    ) then
      raise exception 'Question does not belong to this quiz';
    end if;

    select o.is_correct into v_is_correct
    from public.quiz_options o
    where o.id = v_option_id and o.question_id = v_question_id;
    if not found then
      raise exception 'Answer option does not belong to this question';
    end if;

    insert into public.quiz_attempt_answers (attempt_id, question_id, selected_option_id, is_correct)
    values (v_attempt_id, v_question_id, v_option_id, v_is_correct);
    if v_is_correct then
      v_score := v_score + 1;
    end if;
  end loop;

  update public.quiz_attempts
  set score = v_score, completed_at = now()
  where id = v_attempt_id;

  if v_score > 0 then
    insert into public.point_events (profile_id, points, event_type, related_id)
    values (auth.uid(), v_score * 10, 'quiz_completion', p_quiz_id)
    on conflict (profile_id, event_type, related_id) do nothing;
  end if;

  return v_attempt_id;
end;
$$;

revoke all on function public.submit_quiz_attempt(uuid, jsonb) from public;
grant execute on function public.submit_quiz_attempt(uuid, jsonb) to authenticated;

-- Seed only global badge definitions; real profiles are created by Supabase Auth.
insert into public.badges (id, name, description, icon, points_reward) values
  ('first-post', 'Première publication', 'Publie ton premier contenu.', 'sparkles', 10),
  ('helpful', 'Coup de main', 'Aide cinq personnes dans les forums.', 'heart-handshake', 25),
  ('quiz-master', 'Quiz master', 'Obtiens trois scores parfaits.', 'trophy', 30),
  ('room-host', 'Hôte de Coding Rooms', 'Anime dix sessions de code en direct.', 'code', 25),
  ('local-legend', 'Légende locale', 'Gagne 1 000 points dans ta ville.', 'map-pin', 50)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  points_reward = excluded.points_reward;

-- Storage bucket for profile pictures. Upload object paths as <auth.uid()>/<filename>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar images are public" on storage.objects;
create policy "Avatar images are public" on storage.objects
for select to public using (bucket_id = 'avatars');
drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar" on storage.objects
for insert to authenticated with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar" on storage.objects
for update to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
) with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar" on storage.objects
for delete to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Enable realtime for live room chat and direct messages when the publication exists.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'room_messages') then
      alter publication supabase_realtime add table public.room_messages;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'direct_messages') then
      alter publication supabase_realtime add table public.direct_messages;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications') then
      alter publication supabase_realtime add table public.notifications;
    end if;
  end if;
end;
$$;

commit;
