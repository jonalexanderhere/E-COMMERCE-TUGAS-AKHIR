import { createClient } from '@supabase/supabase-js'

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have real Supabase configuration
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20

// Use fallback values if no real Supabase config is provided
const finalSupabaseUrl = hasSupabaseConfig ? supabaseUrl : 'https://placeholder.supabase.co'
const finalSupabaseAnonKey = hasSupabaseConfig ? supabaseAnonKey : 'placeholder-key'

// Create Supabase client with safe configuration
export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    persistSession: Boolean(hasSupabaseConfig),
    autoRefreshToken: Boolean(hasSupabaseConfig),
    detectSessionInUrl: Boolean(hasSupabaseConfig)
  }
})

// Export configuration status for use in components
export const isSupabaseConfigured = hasSupabaseConfig

// Log configuration status only in development
if (process.env.NODE_ENV === 'development' && !hasSupabaseConfig) {
  console.warn('⚠️  Development Mode: Using placeholder Supabase configuration')
  console.warn('📝 To use real authentication, please:')
  console.warn('   1. Create a Supabase project at https://supabase.com')
  console.warn('   2. Get your API keys from Settings > API')
  console.warn('   3. Create .env.local file with your credentials')
  console.warn('   4. Restart the development server')
}

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}
