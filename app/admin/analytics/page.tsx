'use client'

import { useState, useEffect } from 'react'
import { AdminAuth } from '@/components/admin-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOrders, useProducts } from '@/hooks/use-database'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Download,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  codRevenue: number
  onlinePaymentRevenue: number
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  orderStatusBreakdown: Record<string, number>
  paymentMethodBreakdown: Record<string, number>
  monthlyRevenue: Array<{ month: string; revenue: number }>
}

export default function AdminAnalyticsPage() {
  const { orders, loading: ordersLoading } = useOrders()
  const { products, loading: productsLoading } = useProducts()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ordersLoading && !productsLoading) {
      calculateAnalytics()
    }
  }, [orders, products, timeRange])

  const calculateAnalytics = () => {
    const filteredOrders = filterOrdersByTimeRange(orders, timeRange)
    
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const totalOrders = filteredOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    const codOrders = filteredOrders.filter(order => order.payment_method === 'cod')
    const codRevenue = codOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const onlinePaymentRevenue = totalRevenue - codRevenue

    // Top products calculation
    const productSales: Record<string, { sales: number; revenue: number }> = {}
    filteredOrders.forEach(order => {
      order.items?.forEach((item: any) => {
        const productName = item.product?.name || 'Unknown Product'
        if (!productSales[productName]) {
          productSales[productName] = { sales: 0, revenue: 0 }
        }
        productSales[productName].sales += item.quantity
        productSales[productName].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Order status breakdown
    const orderStatusBreakdown = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Payment method breakdown
    const paymentMethodBreakdown = filteredOrders.reduce((acc, order) => {
      acc[order.payment_method] = (acc[order.payment_method] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Monthly revenue (simplified)
    const monthlyRevenue = getMonthlyRevenue(filteredOrders)

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      codRevenue,
      onlinePaymentRevenue,
      topProducts,
      orderStatusBreakdown,
      paymentMethodBreakdown,
      monthlyRevenue
    })
    setLoading(false)
  }

  const filterOrdersByTimeRange = (orders: any[], range: string) => {
    const now = new Date()
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    return orders.filter(order => new Date(order.created_at) >= cutoffDate)
  }

  const getMonthlyRevenue = (orders: any[]) => {
    const monthlyData: Record<string, number> = {}
    
    orders.forEach(order => {
      const date = new Date(order.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + order.total_amount
    })

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  if (loading) {
    return (
      <AdminAuth>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminAuth>
    )
  }

  if (!analytics) {
    return (
      <AdminAuth>
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground">No data available for the selected time range.</p>
        </div>
      </AdminAuth>
    )
  }

  return (
    <AdminAuth>
      <AdminNav>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Insights and performance metrics</p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalOrders} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                Per order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">COD Revenue</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(analytics.codRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((analytics.codRevenue / analytics.totalRevenue) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Payments</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(analytics.onlinePaymentRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((analytics.onlinePaymentRevenue / analytics.totalRevenue) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(product.sales)} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.orderStatusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'delivered' ? 'bg-green-500' :
                        status === 'shipped' ? 'bg-indigo-500' :
                        status === 'processing' ? 'bg-purple-500' :
                        status === 'confirmed' ? 'bg-blue-500' :
                        status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((count / analytics.totalOrders) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.paymentMethodBreakdown).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={method === 'cod' ? 'default' : 'secondary'}>
                        {method.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((count / analytics.totalOrders) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyRevenue.map(({ month, revenue }) => (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{formatCurrency(revenue)}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(revenue / Math.max(...analytics.monthlyRevenue.map(m => m.revenue))) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COD vs Online Payment Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Revenue Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cash on Delivery</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(analytics.codRevenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full" 
                    style={{ width: `${(analytics.codRevenue / analytics.totalRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((analytics.codRevenue / analytics.totalRevenue) * 100)}% of total revenue
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Online Payments</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(analytics.onlinePaymentRevenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full" 
                    style={{ width: `${(analytics.onlinePaymentRevenue / analytics.totalRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((analytics.onlinePaymentRevenue / analytics.totalRevenue) * 100)}% of total revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </AdminNav>
    </AdminAuth>
  )
}
