'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

// Types
export interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string | null
  description: string | null
  short_description: string | null
  price: number
  compare_price: number | null
  cost_price: number | null
  sku: string | null
  barcode: string | null
  weight: number | null
  dimensions: any
  image_url: string | null
  gallery: any
  category_id: string | null
  category: string
  stock: number
  min_stock: number
  max_stock: number | null
  is_active: boolean
  is_featured: boolean
  is_digital: boolean
  tags: string[] | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

// Hook untuk fetch categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (error) throw error

        setCategories(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook untuk fetch products
export function useProducts(filters?: {
  category?: string
  search?: string
  priceRange?: [number, number]
  sortBy?: string
  featured?: boolean
  limit?: number
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        let query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true)

        // Apply filters
        if (filters?.category) {
          query = query.eq('category', filters.category)
        }

        if (filters?.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
        }

        if (filters?.priceRange) {
          query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1])
        }

        if (filters?.featured) {
          query = query.eq('is_featured', true)
        }

        // Apply sorting
        if (filters?.sortBy) {
          switch (filters.sortBy) {
            case 'price_low':
              query = query.order('price', { ascending: true })
              break
            case 'price_high':
              query = query.order('price', { ascending: false })
              break
            case 'name':
              query = query.order('name', { ascending: true })
              break
            case 'created_at':
            default:
              query = query.order('created_at', { ascending: false })
              break
          }
        } else {
          query = query.order('created_at', { ascending: false })
        }

        // Apply limit
        if (filters?.limit) {
          query = query.limit(filters.limit)
        }

        const { data, error } = await query

        if (error) throw error

        setProducts(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  return { products, loading, error }
}

// Hook untuk fetch single product
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single()

        if (error) throw error

        setProduct(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}

// Hook untuk fetch products by category
export function useProductsByCategory(category: string) {
  return useProducts({ category })
}

// Hook untuk fetch featured products
export function useFeaturedProducts(limit: number = 8) {
  return useProducts({ featured: true, limit })
}

// Hook untuk fetch products with search
export function useSearchProducts(search: string, limit?: number) {
  return useProducts({ search, limit })
}

// Hook untuk fetch products with price range
export function useProductsByPriceRange(priceRange: [number, number], limit?: number) {
  return useProducts({ priceRange, limit })
}
