import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false

  try {
    const profile = await getUserProfile(user.id)
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export async function requireAdmin(user: User | null): Promise<boolean> {
  const adminStatus = await isAdmin(user)
  if (!adminStatus) {
    throw new Error('Admin access required')
  }
  return true
}

export function formatUserRole(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'user':
      return 'User'
    default:
      return 'Unknown'
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800'
    case 'user':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
