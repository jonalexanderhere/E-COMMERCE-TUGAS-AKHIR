'use client'

import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'

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

// Re-export Product type from lib/supabase
export type { Product }

// Fallback categories data
const fallbackCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
    parent_id: null,
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing and accessories',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    parent_id: null,
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    description: 'Home improvement and living essentials',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    parent_id: null,
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    parent_id: null,
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    description: 'Books, magazines, and digital media',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    parent_id: null,
    sort_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'beauty-health',
    name: 'Beauty & Health',
    description: 'Beauty products and health supplements',
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    parent_id: null,
    sort_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Hook untuk fetch categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)
        
        // Use imported supabase client
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setCategories(data)
          setError(null)
        } else {
          // Fallback to default categories if no data
          console.warn('No categories found, using fallback data')
          setCategories(fallbackCategories)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        
        // Always set fallback categories on error
        setCategories(fallbackCategories)
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
        setError(null)
        
        // Use imported supabase client
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

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setProducts(data)
          setError(null)
        } else {
          // Fallback to default products if no data
          console.warn('No products found, using fallback data')
          const fallbackProducts: Product[] = [
            {
              id: '1',
              name: 'iPhone 15 Pro',
              slug: 'iphone-15-pro',
              description: 'Latest iPhone with advanced camera system and A17 Pro chip',
              short_description: 'Premium iPhone with titanium build',
              price: 15999000,
              compare_price: 17999000,
              cost_price: 12000000,
              sku: 'IPH15PRO',
              barcode: '1234567890001',
              weight: 0.2,
              dimensions: { length: 15.0, width: 7.0, height: 0.8 },
              image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
              gallery: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'],
              category_id: null,
              category: 'Electronics',
              stock: 50,
              min_stock: 5,
              max_stock: 100,
              is_active: true,
              is_featured: true,
              is_digital: false,
              tags: ['smartphone', 'apple', 'premium'],
              meta_title: 'iPhone 15 Pro - Premium Smartphone',
              meta_description: 'Latest iPhone with advanced camera system',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              name: 'MacBook Air M2',
              slug: 'macbook-air-m2',
              description: 'Ultra-thin laptop with M2 chip and all-day battery life',
              short_description: 'Ultra-thin laptop with M2 chip',
              price: 18999000,
              compare_price: 20999000,
              cost_price: 14000000,
              sku: 'MBAIRM2',
              barcode: '1234567890002',
              weight: 1.2,
              dimensions: { length: 30.0, width: 21.0, height: 1.1 },
              image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
              gallery: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'],
              category_id: null,
              category: 'Electronics',
              stock: 25,
              min_stock: 3,
              max_stock: 50,
              is_active: true,
              is_featured: true,
              is_digital: false,
              tags: ['laptop', 'apple', 'm2'],
              meta_title: 'MacBook Air M2 - Ultra-thin Laptop',
              meta_description: 'Ultra-thin laptop with M2 chip and all-day battery life',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
          setProducts(fallbackProducts)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        
        // Set fallback products even on error
        const fallbackProducts: Product[] = [
          {
            id: '1',
            name: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            description: 'Latest iPhone with advanced camera system and A17 Pro chip',
            short_description: 'Premium iPhone with titanium build',
            price: 15999000,
            compare_price: 17999000,
            cost_price: 12000000,
            sku: 'IPH15PRO',
            barcode: '1234567890001',
            weight: 0.2,
            dimensions: { length: 15.0, width: 7.0, height: 0.8 },
            image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
            gallery: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'],
            category_id: null,
            category: 'Electronics',
            stock: 50,
            min_stock: 5,
            max_stock: 100,
            is_active: true,
            is_featured: true,
            is_digital: false,
            tags: ['smartphone', 'apple', 'premium'],
            meta_title: 'iPhone 15 Pro - Premium Smartphone',
            meta_description: 'Latest iPhone with advanced camera system',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'MacBook Air M2',
            slug: 'macbook-air-m2',
            description: 'Ultra-thin laptop with M2 chip and all-day battery life',
            short_description: 'Ultra-thin laptop with M2 chip',
            price: 18999000,
            compare_price: 20999000,
            cost_price: 14000000,
            sku: 'MBAIRM2',
            barcode: '1234567890002',
            weight: 1.2,
            dimensions: { length: 30.0, width: 21.0, height: 1.1 },
            image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
            gallery: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'],
            category_id: null,
            category: 'Electronics',
            stock: 25,
            min_stock: 3,
            max_stock: 50,
            is_active: true,
            is_featured: true,
            is_digital: false,
            tags: ['laptop', 'apple', 'm2'],
            meta_title: 'MacBook Air M2 - Ultra-thin Laptop',
            meta_description: 'Ultra-thin laptop with M2 chip and all-day battery life',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        setProducts(fallbackProducts)
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
        // Use imported supabase client
        
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
