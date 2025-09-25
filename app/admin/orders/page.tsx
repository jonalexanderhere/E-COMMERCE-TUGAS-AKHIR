'use client'

import { useState } from 'react'
import { AdminAuth } from '@/components/admin-auth'
import { AdminNav } from '@/components/admin-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOrders } from '@/hooks/use-database'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  Truck, 
  Package,
  Clock,
  X
} from 'lucide-react'

export default function AdminOrdersPage() {
  const { orders, loading } = useOrders()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.payment_method === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cod':
        return 'bg-green-100 text-green-800'
      case 'credit_card':
        return 'bg-blue-100 text-blue-800'
      case 'bank_transfer':
        return 'bg-purple-100 text-purple-800'
      case 'ewallet':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    // In a real app, this would update the order status in the database
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
    // You would implement the actual update logic here
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

  return (
    <AdminAuth>
      <AdminNav>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">Manage and track customer orders</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Methods</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="ewallet">E-Wallet</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setPaymentFilter('all')
              }}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">#{order.order_number}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </div>
                        </Badge>
                        <Badge className={getPaymentMethodColor(order.payment_method)}>
                          {order.payment_method.toUpperCase()}
                        </Badge>
                        {order.payment_method === 'cod' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            COD
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                        <p className="text-lg font-semibold">{formatCurrency(order.total_amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Items</p>
                        <p className="text-lg font-semibold">{order.items?.length || 0} items</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Shipping</p>
                        <p className="text-lg font-semibold">{order.shipping_method || 'Not specified'}</p>
                      </div>
                    </div>

                    {order.shipping_address && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                        <p className="text-sm whitespace-pre-line">{order.shipping_address}</p>
                      </div>
                    )}

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Order Items</p>
                        <div className="space-y-2">
                          {order.items.slice(0, 3).map((item: any) => (
                            <div key={item.id} className="flex items-center space-x-3 text-sm">
                              <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                                <img
                                  src={item.product?.image_url}
                                  alt={item.product?.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{item.product?.name}</p>
                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-sm text-muted-foreground">
                              +{order.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* COD Notice */}
                    {order.payment_method === 'cod' && (
                      <div className="p-3 bg-green-50 rounded-lg mb-4">
                        <div className="flex items-center space-x-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Cash on Delivery Order</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Customer will pay {formatCurrency(order.total_amount)} when the order arrives.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Order
                    </Button>
                    
                    {/* Status Update Buttons */}
                    {order.status === 'pending' && (
                      <Button 
                        onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        onClick={() => handleStatusUpdate(order.id, 'processing')}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Process
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button 
                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Ship
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button 
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Deliver
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                    ? 'No orders match your current filters.'
                    : 'No orders have been placed yet.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        </div>
      </AdminNav>
    </AdminAuth>
  )
}
