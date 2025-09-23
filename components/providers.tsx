'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Mock user for development
// No mock user - use real authentication

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we have real Supabase configuration
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

    if (!hasSupabaseConfig) {
      // Development mode without Supabase - set loading to false
      console.log('Development mode: No Supabase configuration found')
      setUser(null)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.log('Supabase auth error:', error)
      setUser(null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    // Check if we have real Supabase configuration
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

    if (hasSupabaseConfig) {
      try {
        await supabase.auth.signOut()
        setUser(null)
      } catch (error) {
        console.log('Sign out error:', error)
        setUser(null)
      }
    } else {
      // Development mode - just clear the user
      setUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    // Check if we have real Supabase configuration
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

    if (!hasSupabaseConfig) {
      // Development mode - show error message
      return { 
        data: null, 
        error: { 
          message: 'Supabase configuration required. Please set up your .env.local file with Supabase credentials.' 
        } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.log('Sign in error:', error)
        return { data: null, error }
      }
      
      setUser(data.user)
      return { data, error }
    } catch (error) {
      console.log('Sign in error:', error)
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const signUp = async (email: string, password: string) => {
    // Check if we have real Supabase configuration
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

    if (!hasSupabaseConfig) {
      // Development mode - show error message
      return { 
        data: null, 
        error: { 
          message: 'Supabase configuration required. Please set up your .env.local file with Supabase credentials.' 
        } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.log('Sign up error:', error)
        return { data: null, error }
      }
      
      setUser(data.user)
      return { data, error }
    } catch (error) {
      console.log('Sign up error:', error)
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
