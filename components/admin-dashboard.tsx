'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers'
import { database, DatabaseProduct, DatabaseOrder, DatabaseUserProfile } from '@/lib/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, ShoppingCart, Users, DollarSign, Plus, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [orders, setOrders] = useState<DatabaseOrder[]>([])
  const [users, setUsers] = useState<DatabaseUserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Check if user is admin
    checkAdminStatus()
    fetchData()
  }, [user, router])

  const checkAdminStatus = async () => {
    try {
      const profile = await database.getUserProfile(user?.id || '')

      if (profile?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        })
        router.push('/')
        return
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch all data in parallel
      const [productsData, ordersData, usersData] = await Promise.all([
        database.getProducts(100),
        database.getAllOrders(),
        database.getAllUsers()
      ])

      setProducts(productsData)
      setOrders(ordersData)
      setUsers(usersData)

      // Calculate stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.total_amount, 0)
      const pendingOrders = ordersData.filter(order => order.status === 'pending').length

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        pendingOrders
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      // Note: In a real implementation, you would add a deleteProduct method to the database class
      // For now, we'll just show a message that this feature needs to be implemented
      toast({
        title: "Feature Not Implemented",
        description: "Product deletion will be implemented in the database layer.",
        variant: "destructive",
      })

      // fetchData() // Refresh data after deletion
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await database.updateOrderStatus(orderId, newStatus)

      toast({
        title: "Order updated",
        description: `Order status updated to ${newStatus}.`,
      })

      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)} • {formatPrice(order.total_amount)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    order.status === 'pending' ? 'default' :
                    order.status === 'processing' ? 'secondary' :
                    order.status === 'shipped' ? 'outline' :
                    order.status === 'delivered' ? 'default' : 'destructive'
                  }>
                    {order.status}
                  </Badge>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products Management</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 10).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • Stock: {product.stock} • {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
