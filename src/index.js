// Cloudflare Worker for JonsStore E-commerce
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger())

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM products 
      ORDER BY created_at DESC 
      LIMIT 100
    `).all()

    return c.json({ products: results })
  } catch (error) {
    return c.json({ error: 'Failed to fetch products' }, 500)
  }
})

app.get('/api/products/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const product = await c.env.DB.prepare(`
      SELECT * FROM products WHERE id = ?
    `).bind(id).first()

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json({ product })
  } catch (error) {
    return c.json({ error: 'Failed to fetch product' }, 500)
  }
})

app.get('/api/products/category/:category', async (c) => {
  try {
    const category = c.req.param('category')
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM products 
      WHERE category = ? 
      ORDER BY created_at DESC
    `).bind(category).all()

    return c.json({ products: results })
  } catch (error) {
    return c.json({ error: 'Failed to fetch products by category' }, 500)
  }
})

app.get('/api/search', async (c) => {
  try {
    const query = c.req.query('q')
    if (!query) {
      return c.json({ error: 'Search query is required' }, 400)
    }

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM products 
      WHERE name LIKE ? OR description LIKE ? 
      ORDER BY created_at DESC
    `).bind(`%${query}%`, `%${query}%`).all()

    return c.json({ products: results })
  } catch (error) {
    return c.json({ error: 'Failed to search products' }, 500)
  }
})

// Cart endpoints
app.get('/api/cart/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { results } = await c.env.DB.prepare(`
      SELECT c.*, p.* 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `).bind(userId).all()

    return c.json({ cartItems: results })
  } catch (error) {
    return c.json({ error: 'Failed to fetch cart items' }, 500)
  }
})

app.post('/api/cart', async (c) => {
  try {
    const { userId, productId, quantity } = await c.req.json()
    
    await c.env.DB.prepare(`
      INSERT INTO cart_items (id, user_id, product_id, quantity, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(crypto.randomUUID(), userId, productId, quantity).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to add to cart' }, 500)
  }
})

// Orders endpoints
app.get('/api/orders/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { results } = await c.env.DB.prepare(`
      SELECT o.*, oi.*, p.*
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).bind(userId).all()

    // Group by order
    const ordersMap = new Map()
    for (const row of results) {
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
        ordersMap.get(orderId).items.push({
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

    return c.json({ orders: Array.from(ordersMap.values()) })
  } catch (error) {
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

app.post('/api/orders', async (c) => {
  try {
    const { userId, totalAmount, items } = await c.req.json()
    
    const orderId = crypto.randomUUID()
    
    // Create order
    await c.env.DB.prepare(`
      INSERT INTO orders (id, user_id, total_amount, status, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', datetime('now'), datetime('now'))
    `).bind(orderId, userId, totalAmount).run()

    // Add order items
    for (const item of items) {
      await c.env.DB.prepare(`
        INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase)
        VALUES (?, ?, ?, ?, ?)
      `).bind(crypto.randomUUID(), orderId, item.productId, item.quantity, item.price).run()
    }

    return c.json({ orderId, success: true })
  } catch (error) {
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// Admin endpoints
app.get('/api/admin/orders', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT o.*, oi.*, p.*
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `).all()

    // Group by order (same logic as above)
    const ordersMap = new Map()
    for (const row of results) {
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
        ordersMap.get(orderId).items.push({
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

    return c.json({ orders: Array.from(ordersMap.values()) })
  } catch (error) {
    return c.json({ error: 'Failed to fetch all orders' }, 500)
  }
})

app.put('/api/admin/orders/:orderId/status', async (c) => {
  try {
    const orderId = c.req.param('orderId')
    const { status } = await c.req.json()
    
    await c.env.DB.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = datetime('now') 
      WHERE id = ?
    `).bind(status, orderId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update order status' }, 500)
  }
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
