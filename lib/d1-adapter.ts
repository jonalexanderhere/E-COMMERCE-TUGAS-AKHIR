// D1 Database Adapter for Cloudflare
export interface D1Database {
  prepare(query: string): D1PreparedStatement
  exec(query: string): Promise<D1Result>
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement
  first(): Promise<any>
  all(): Promise<D1Result>
  run(): Promise<D1Result>
}

export interface D1Result {
  results: any[]
  success: boolean
  meta: any
}

export interface D1Product {
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

export interface D1CartItem {
  id: string
  product_id: string
  user_id: string
  quantity: number
  created_at: string
}

export interface D1Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface D1OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
}

export interface D1UserProfile {
  id: string
  full_name: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

// D1 Database operations
export class D1DatabaseAdapter {
  private db: D1Database | null = null

  constructor(database?: D1Database) {
    this.db = database || null
  }

  // Check if D1 is available
  isAvailable(): boolean {
    return typeof this.db !== 'undefined' && this.db !== null
  }

  // Products
  async getProducts(limit?: number, offset?: number): Promise<D1Product[]> {
    if (!this.isAvailable()) return []
    
    const query = this.db!.prepare(`
      SELECT * FROM products 
      ORDER BY created_at DESC 
      ${limit ? `LIMIT ${limit}` : ''} 
      ${offset ? `OFFSET ${offset}` : ''}
    `)
    
    const result = await query.all()
    return result.results as D1Product[]
  }

  async getProductById(id: string): Promise<D1Product | null> {
    if (!this.isAvailable()) return null
    
    const query = this.db!.prepare('SELECT * FROM products WHERE id = ?')
    const result = await query.bind(id).first()
    return result as D1Product | null
  }

  async getProductsByCategory(category: string): Promise<D1Product[]> {
    if (!this.isAvailable()) return []
    
    const query = this.db!.prepare('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC')
    const result = await query.bind(category).all()
    return result.results as D1Product[]
  }

  async searchProducts(searchTerm: string): Promise<D1Product[]> {
    if (!this.isAvailable()) return []
    
    const query = this.db!.prepare(`
      SELECT * FROM products 
      WHERE name LIKE ? OR description LIKE ? 
      ORDER BY created_at DESC
    `)
    const result = await query.bind(`%${searchTerm}%`, `%${searchTerm}%`).all()
    return result.results as D1Product[]
  }

  // Cart
  async getCartItems(userId: string): Promise<(D1CartItem & { product: D1Product })[]> {
    if (!this.isAvailable()) return []
    
    const query = this.db!.prepare(`
      SELECT c.*, p.* 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `)
    const result = await query.bind(userId).all()
    return result.results as (D1CartItem & { product: D1Product })[]
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<void> {
    if (!this.isAvailable()) return
    
    const query = this.db!.prepare(`
      INSERT INTO cart_items (id, user_id, product_id, quantity, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `)
    await query.bind(crypto.randomUUID(), userId, productId, quantity).run()
  }

  async updateCartItem(cartItemId: string, quantity: number): Promise<void> {
    if (!this.isAvailable()) return
    
    const query = this.db!.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?')
    await query.bind(quantity, cartItemId).run()
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    if (!this.isAvailable()) return
    
    const query = this.db!.prepare('DELETE FROM cart_items WHERE id = ?')
    await query.bind(cartItemId).run()
  }

  async clearCart(userId: string): Promise<void> {
    if (!this.isAvailable()) return
    
    const query = this.db!.prepare('DELETE FROM cart_items WHERE user_id = ?')
    await query.bind(userId).run()
  }

  // Orders
  async createOrder(userId: string, totalAmount: number): Promise<string> {
    if (!this.isAvailable()) return ''
    
    const orderId = crypto.randomUUID()
    const query = this.db!.prepare(`
      INSERT INTO orders (id, user_id, total_amount, status, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', datetime('now'), datetime('now'))
    `)
    await query.bind(orderId, userId, totalAmount).run()
    return orderId
  }

  async addOrderItem(orderId: string, productId: string, quantity: number, price: number): Promise<void> {
    if (!this.isAvailable()) return
    
    const query = this.db!.prepare(`
      INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase)
      VALUES (?, ?, ?, ?, ?)
    `)
    await query.bind(crypto.randomUUID(), orderId, productId, quantity, price).run()
  }

  async getOrders(userId: string): Promise<(D1Order & { items: (D1OrderItem & { product: D1Product })[] })[]> {
    if (!this.isAvailable()) return []
    
    const query = this.db!.prepare(`
      SELECT o.*, oi.*, p.*
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `)
    const result = await query.bind(userId).all()
    
    // Group by order
    const ordersMap = new Map<string, D1Order & { items: (D1OrderItem & { product: D1Product })[] }>()
    
    for (const row of result.results as any[]) {
      const orderId = row.id
      
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: row.id,
          user_id: row.user_id,
          total_amount: row.total_amount,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: []
        })
      }
      
      if (row.product_id) {
        ordersMap.get(orderId)!.items.push({
          id: row.id,
          order_id: row.order_id,
          product_id: row.product_id,
          quantity: row.quantity,
          price_at_purchase: row.price_at_purchase,
          product: {
            id: row.product_id,
            name: row.name,
            description: row.description,
            price: row.price,
            image_url: row.image_url,
            category: row.category,
            stock: row.stock,
            created_at: row.created_at,
            updated_at: row.updated_at
          }
        })
      }
    }
    
    return Array.from(ordersMap.values())
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    if (!this.isAvailable()) return
    
    const query = this.db!.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = datetime('now') 
      WHERE id = ?
    `)
    await query.bind(status, orderId).run()
  }

  // User Profiles
  async getUserProfile(userId: string): Promise<D1UserProfile | null> {
    if (!this.isAvailable()) return null
    
    const query = this.db!.prepare('SELECT * FROM user_profiles WHERE id = ?')
    const result = await query.bind(userId).first()
    return result as D1UserProfile | null
  }

  async createUserProfile(userId: string, fullName: string, role: 'user' | 'admin' = 'user'): Promise<void> {
    if (!this.isAvailable()) return
    
    const query = this.db!.prepare(`
      INSERT INTO user_profiles (id, full_name, role, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `)
    await query.bind(userId, fullName, role).run()
  }

  async updateUserProfile(userId: string, updates: Partial<D1UserProfile>): Promise<void> {
    if (!this.isAvailable()) return
    
    const fields = Object.keys(updates).filter(key => key !== 'id')
    const setClause = fields.map(field => `${field} = ?`).join(', ')
    const values = fields.map(field => updates[field as keyof D1UserProfile])
    
    const query = this.db!.prepare(`
      UPDATE user_profiles 
      SET ${setClause}, updated_at = datetime('now') 
      WHERE id = ?
    `)
    await query.bind(...values, userId).run()
  }

  // Admin functions
  async getAllOrders(): Promise<(D1Order & { items: (D1OrderItem & { product: D1Product })[] })[]> {
    if (!this.isAvailable()) return []
    
    const query = this.db!.prepare(`
      SELECT o.*, oi.*, p.*
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `)
    const result = await query.all()
    
    // Group by order (same logic as getOrders)
    const ordersMap = new Map<string, D1Order & { items: (D1OrderItem & { product: D1Product })[] }>()
    
    for (const row of result.results as any[]) {
      const orderId = row.id
      
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: row.id,
          user_id: row.user_id,
          total_amount: row.total_amount,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: []
        })
      }
      
      if (row.product_id) {
        ordersMap.get(orderId)!.items.push({
          id: row.id,
          order_id: row.order_id,
          product_id: row.product_id,
          quantity: row.quantity,
          price_at_purchase: row.price_at_purchase,
          product: {
            id: row.product_id,
            name: row.name,
            description: row.description,
            price: row.price,
            image_url: row.image_url,
            category: row.category,
            stock: row.stock,
            created_at: row.created_at,
            updated_at: row.updated_at
          }
        })
      }
    }
    
    return Array.from(ordersMap.values())
  }

  async getAllUsers(): Promise<D1UserProfile[]> {
    if (!this.isAvailable()) return []
    
    const query = this.db!.prepare('SELECT * FROM user_profiles ORDER BY created_at DESC')
    const result = await query.all()
    return result.results as D1UserProfile[]
  }
}
