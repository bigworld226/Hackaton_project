import { supabase } from '@/lib/supabase'

export interface NearbyProfile {
  profile_id: string
  display_name: string
  handle: string
  avatar_url: string | null
  city: string | null
  languages: string[]
  points: number
  latitude: number
  longitude: number
  distance_km: number
}

export async function getNearbyProfiles(latitude: number, longitude: number, radiusKm = 5) {
  const { data, error } = await supabase.rpc('get_nearby_developers', {
    p_latitude: latitude,
    p_longitude: longitude,
    p_radius_km: radiusKm,
  })
  if (error) throw error
  return (data ?? []) as NearbyProfile[]
}

export interface PublicProfile {
  profile_id: string
  display_name: string
  handle: string
  bio: string
  avatar_url: string | null
  city: string | null
  languages: string[]
  points: number
}

export async function getPublicProfile(profileId: string) {
  const { data, error } = await supabase.rpc('get_public_profile', { p_profile_id: profileId })
  if (error) throw error
  return (Array.isArray(data) ? data[0] : data) as PublicProfile | null
}
