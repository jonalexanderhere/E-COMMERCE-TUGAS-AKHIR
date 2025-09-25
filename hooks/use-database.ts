import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'

// Category interface
export interface Category {
  id: string
  name: string
  description?: string
  image_url?: string
  parent_id?: string | null
  sort_order?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Re-export Product type from lib/supabase
export type { Product }

// Fallback categories data - Always available
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

// Fallback products data - Always available
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
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Comfortable running shoes with Max Air cushioning',
    short_description: 'Premium running shoes',
    price: 2499000,
    compare_price: 2799000,
    cost_price: 1800000,
    sku: 'NAM270',
    barcode: '1234567890004',
    weight: 0.8,
    dimensions: { length: 32.0, width: 12.0, height: 10.0 },
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
    category_id: null,
    category: 'Fashion',
    stock: 40,
    min_stock: 5,
    max_stock: 80,
    is_active: true,
    is_featured: true,
    is_digital: false,
    tags: ['shoes', 'nike', 'running'],
    meta_title: 'Nike Air Max 270 - Running Shoes',
    meta_description: 'Comfortable running shoes with Max Air cushioning',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'IKEA Billy Bookcase',
    slug: 'ikea-billy-bookcase',
    description: 'Classic white bookcase with adjustable shelves',
    short_description: 'Classic white bookcase',
    price: 1299000,
    compare_price: 1499000,
    cost_price: 800000,
    sku: 'IBB',
    barcode: '1234567890007',
    weight: 15.0,
    dimensions: { length: 80.0, width: 28.0, height: 202.0 },
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'],
    category_id: null,
    category: 'Home & Living',
    stock: 20,
    min_stock: 2,
    max_stock: 40,
    is_active: true,
    is_featured: true,
    is_digital: false,
    tags: ['bookcase', 'ikea', 'furniture'],
    meta_title: 'IKEA Billy Bookcase - Classic Storage',
    meta_description: 'Classic white bookcase with adjustable shelves',
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
          console.warn('No categories found, using fallback data')
          setCategories(fallbackCategories)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        setCategories(fallbackCategories) // Always set fallback on error
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
          console.warn('No products found, using fallback data')
          setProducts(fallbackProducts)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        setProducts(fallbackProducts) // Always set fallback on error
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  return { products, loading, error }
}

// Hook untuk fetch featured products
export function useFeaturedProducts(limit?: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(limit || 8)

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setProducts(data)
          setError(null)
        } else {
          console.warn('No featured products found, using fallback data')
          setProducts(fallbackProducts.filter(p => p.is_featured))
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch featured products')
        setProducts(fallbackProducts.filter(p => p.is_featured)) // Always set fallback on error
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

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
        setError(null)
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single()

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data) {
          setProduct(data)
          setError(null)
        } else {
          console.warn('Product not found, using fallback data')
          const fallbackProduct = fallbackProducts.find(p => p.id === id)
          setProduct(fallbackProduct || null)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
        const fallbackProduct = fallbackProducts.find(p => p.id === id)
        setProduct(fallbackProduct || null) // Always set fallback on error
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
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProductsByCategory() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setProducts(data)
          setError(null)
        } else {
          console.warn('No products found for category, using fallback data')
          setProducts(fallbackProducts.filter(p => p.category === category))
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching products by category:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products by category')
        setProducts(fallbackProducts.filter(p => p.category === category)) // Always set fallback on error
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchProductsByCategory()
    }
  }, [category])

  return { products, loading, error }
}

// Hook untuk search products
export function useSearchProducts(searchTerm: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function searchProducts() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setProducts(data)
          setError(null)
        } else {
          console.warn('No products found for search, using fallback data')
          setProducts(fallbackProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
          ))
          setError(null)
        }
      } catch (err) {
        console.error('Error searching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to search products')
        setProducts(fallbackProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )) // Always set fallback on error
      } finally {
        setLoading(false)
      }
    }

    if (searchTerm) {
      searchProducts()
    }
  }, [searchTerm])

  return { products, loading, error }
}

// Hook untuk fetch products by price range
export function useProductsByPriceRange(minPrice: number, maxPrice: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProductsByPriceRange() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .order('price', { ascending: true })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setProducts(data)
          setError(null)
        } else {
          console.warn('No products found for price range, using fallback data')
          setProducts(fallbackProducts.filter(p => p.price >= minPrice && p.price <= maxPrice))
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching products by price range:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products by price range')
        setProducts(fallbackProducts.filter(p => p.price >= minPrice && p.price <= maxPrice)) // Always set fallback on error
      } finally {
        setLoading(false)
      }
    }

    if (minPrice >= 0 && maxPrice > 0) {
      fetchProductsByPriceRange()
    }
  }, [minPrice, maxPrice])

  return { products, loading, error }
}

// Hook untuk fetch payment methods
export function usePaymentMethods() {
  const [methods, setMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setMethods(data)
          setError(null)
        } else {
          // Fallback data
          const fallbackMethods = [
            {
              id: '1',
              name: 'Cash on Delivery',
              code: 'cod',
              description: 'Pay when your order arrives',
              is_active: true,
              is_cod: true,
              processing_fee: 0,
              display_order: 1
            },
            {
              id: '2',
              name: 'Bank Transfer',
              code: 'bank_transfer',
              description: 'Transfer to our bank account',
              is_active: true,
              is_cod: false,
              processing_fee: 0,
              display_order: 2
            },
            {
              id: '3',
              name: 'Credit Card',
              code: 'credit_card',
              description: 'Pay with Visa, Mastercard, or JCB',
              is_active: true,
              is_cod: false,
              processing_fee: 2500,
              display_order: 3
            }
          ]
          setMethods(fallbackMethods)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching payment methods:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch payment methods')
        setMethods([])
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  return { methods, loading, error }
}

// Hook untuk fetch shipping methods
export function useShippingMethods() {
  const [methods, setMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchShippingMethods() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('shipping_methods')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (data && data.length > 0) {
          setMethods(data)
          setError(null)
        } else {
          // Fallback data
          const fallbackMethods = [
            {
              id: '1',
              name: 'Regular Shipping',
              code: 'regular',
              description: 'Standard delivery service',
              base_cost: 15000,
              cost_per_kg: 5000,
              free_shipping_threshold: 500000,
              estimated_days_min: 3,
              estimated_days_max: 5,
              is_active: true,
              is_cod_available: true,
              display_order: 1
            },
            {
              id: '2',
              name: 'Express Shipping',
              code: 'express',
              description: 'Fast delivery service',
              base_cost: 25000,
              cost_per_kg: 8000,
              free_shipping_threshold: 1000000,
              estimated_days_min: 1,
              estimated_days_max: 2,
              is_active: true,
              is_cod_available: true,
              display_order: 2
            }
          ]
          setMethods(fallbackMethods)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching shipping methods:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch shipping methods')
        setMethods([])
      } finally {
        setLoading(false)
      }
    }

    fetchShippingMethods()
  }, [])

  return { methods, loading, error }
}

// Hook untuk create order
export function useCreateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (orderData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    } catch (err) {
      console.error('Error creating order:', err)
      setError(err instanceof Error ? err.message : 'Failed to create order')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}

// Hook untuk fetch orders
export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        setError(null)
        
        let query = supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .order('created_at', { ascending: false })

        if (userId) {
          query = query.eq('user_id', userId)
        }

        const { data, error } = await query

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        setOrders(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch orders')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  return { orders, loading, error }
}