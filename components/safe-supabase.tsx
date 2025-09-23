'use client'

import { isSupabaseConfigured } from '@/lib/supabase'

// Safe wrapper for Supabase operations
export const useSupabaseSafe = () => {
  return {
    isConfigured: isSupabaseConfigured,
    // Add more safe operations here as needed
  }
}

// Safe data fetching hook
export const useSafeDataFetch = () => {
  const { isConfigured } = useSupabaseSafe()
  
  const fetchProducts = async () => {
    if (!isConfigured) {
      // Return mock data for development
      const { mockProducts } = await import('@/lib/mock-data')
      return { data: mockProducts, error: null }
    }
    
    // Real Supabase fetch would go here
    return { data: [], error: null }
  }
  
  const fetchCategories = async () => {
    if (!isConfigured) {
      // Return mock data for development
      const { mockCategories } = await import('@/lib/mock-data')
      return { data: mockCategories, error: null }
    }
    
    // Real Supabase fetch would go here
    return { data: [], error: null }
  }
  
  return {
    fetchProducts,
    fetchCategories,
    isConfigured
  }
}

