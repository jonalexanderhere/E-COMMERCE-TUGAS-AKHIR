// Universal database adapter that supports both Supabase and D1
import { supabase, isSupabaseConfigured } from './supabase'
import { D1DatabaseAdapter, D1Database } from './d1-adapter'

export interface DatabaseProduct {
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

export interface DatabaseCartItem {
  id: string
  product_id: string
  user_id: string
  quantity: number
  created_at: string
  product?: DatabaseProduct
}

export interface DatabaseOrder {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  items?: DatabaseOrderItem[]
}

export interface DatabaseOrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  product?: DatabaseProduct
}

export interface DatabaseUserProfile {
  id: string
  full_name: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

// Universal database class
export class UniversalDatabase {
  private d1Db: D1DatabaseAdapter | null = null
  private useD1: boolean = false

  constructor(d1Database?: D1Database) {
    this.d1Db = d1Database ? new D1DatabaseAdapter(d1Database) : null
    this.useD1 = this.d1Db?.isAvailable() || false
  }

  // Products
  async getProducts(limit?: number, offset?: number): Promise<DatabaseProduct[]> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getProducts(limit, offset)
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit || 100)
        .range(offset || 0, (offset || 0) + (limit || 100) - 1)

      if (error) {
        console.error('Error fetching products:', error)
        return []
      }

      return data || []
    }

    // Fallback to mock data
    const { mockProducts } = await import('./mock-data')
    return mockProducts.slice(offset || 0, (offset || 0) + (limit || 100))
  }

  async getProductById(id: string): Promise<DatabaseProduct | null> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getProductById(id)
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return null
      }

      return data
    }

    // Fallback to mock data
    const { mockProducts } = await import('./mock-data')
    return mockProducts.find(p => p.id === id) || null
  }

  async getProductsByCategory(category: string): Promise<DatabaseProduct[]> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getProductsByCategory(category)
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products by category:', error)
        return []
      }

      return data || []
    }

    // Fallback to mock data
    const { mockProducts } = await import('./mock-data')
    return mockProducts.filter(p => p.category === category)
  }

  async searchProducts(searchTerm: string): Promise<DatabaseProduct[]> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.searchProducts(searchTerm)
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching products:', error)
        return []
      }

      return data || []
    }

    // Fallback to mock data
    const { mockProducts } = await import('./mock-data')
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Cart
  async getCartItems(userId: string): Promise<DatabaseCartItem[]> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getCartItems(userId)
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching cart items:', error)
        return []
      }

      return data?.map(item => ({
        ...item,
        product: item.products
      })) || []
    }

    return []
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.addToCart(userId, productId, quantity)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity
        })

      if (error) {
        console.error('Error adding to cart:', error)
        throw error
      }
    }
  }

  async updateCartItem(cartItemId: string, quantity: number): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.updateCartItem(cartItemId, quantity)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)

      if (error) {
        console.error('Error updating cart item:', error)
        throw error
      }
    }
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.removeFromCart(cartItemId)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

      if (error) {
        console.error('Error removing from cart:', error)
        throw error
      }
    }
  }

  async clearCart(userId: string): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.clearCart(userId)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Error clearing cart:', error)
        throw error
      }
    }
  }

  // Orders
  async createOrder(userId: string, totalAmount: number): Promise<string> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.createOrder(userId, totalAmount)
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error creating order:', error)
        throw error
      }

      return data.id
    }

    return ''
  }

  async addOrderItem(orderId: string, productId: string, quantity: number, price: number): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.addOrderItem(orderId, productId, quantity, price)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: productId,
          quantity,
          price_at_purchase: price
        })

      if (error) {
        console.error('Error adding order item:', error)
        throw error
      }
    }
  }

  async getOrders(userId: string): Promise<DatabaseOrder[]> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getOrders(userId)
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return []
      }

      return data?.map(order => ({
        ...order,
        items: order.order_items?.map((item: any) => ({
          ...item,
          product: item.products
        })) || []
      })) || []
    }

    return []
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.updateOrderStatus(orderId, status)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order status:', error)
        throw error
      }
    }
  }

  // User Profiles
  async getUserProfile(userId: string): Promise<DatabaseUserProfile | null> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getUserProfile(userId)
    }

    if (isSupabaseConfigured) {
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
    }

    return null
  }

  async createUserProfile(userId: string, fullName: string, role: 'user' | 'admin' = 'user'): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.createUserProfile(userId, fullName, role)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          full_name: fullName,
          role
        })

      if (error) {
        console.error('Error creating user profile:', error)
        throw error
      }
    }
  }

  async updateUserProfile(userId: string, updates: Partial<DatabaseUserProfile>): Promise<void> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.updateUserProfile(userId, updates)
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)

      if (error) {
        console.error('Error updating user profile:', error)
        throw error
      }
    }
  }

  // Admin functions
  async getAllOrders(): Promise<DatabaseOrder[]> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getAllOrders()
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all orders:', error)
        return []
      }

      return data?.map(order => ({
        ...order,
        items: order.order_items?.map((item: any) => ({
          ...item,
          product: item.products
        })) || []
      })) || []
    }

    return []
  }

  async getAllUsers(): Promise<DatabaseUserProfile[]> {
    if (this.useD1 && this.d1Db) {
      return await this.d1Db.getAllUsers()
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all users:', error)
        return []
      }

      return data || []
    }

    return []
  }

  // Check if database is available
  isAvailable(): boolean {
    return Boolean(this.useD1 || isSupabaseConfigured)
  }

  // Get database type
  getDatabaseType(): 'd1' | 'supabase' | 'mock' {
    if (this.useD1) return 'd1'
    if (isSupabaseConfigured) return 'supabase'
    return 'mock'
  }
}

// Export singleton instance
export const database = new UniversalDatabase()
