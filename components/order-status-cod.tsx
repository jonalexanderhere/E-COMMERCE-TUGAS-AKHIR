'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image_url: string
    price: number
  }
}

interface Order {
  id: string
  order_number: string
  user_id: string
  total_amount: number
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
  payment_reference?: string
  shipping_address: string
  shipping_method: string
  tracking_number?: string
  estimated_delivery?: string
  notes?: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

interface OrderStatusCODProps {
  order: Order
  onStatusUpdate?: (orderId: string, newStatus: string) => void
  isAdmin?: boolean
}

export function OrderStatusCOD({ order, onStatusUpdate, isAdmin = false }: OrderStatusCODProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Package, color: 'bg-blue-500' },
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, color: 'bg-green-500' },
    { key: 'processing', label: 'Processing', icon: Clock, color: 'bg-yellow-500' },
    { key: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-purple-500' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-600' }
  ]

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEstimatedDelivery = () => {
    if (order.estimated_delivery) {
      return new Date(order.estimated_delivery).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return 'TBD'
  }

  const handleStatusUpdate = (newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, newStatus)
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Order #{order.order_number}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              {order.payment_method === 'cod' && (
                <Badge className={getPaymentStatusColor(order.payment_status)}>
                  {order.payment_status === 'pending' ? 'COD Pending' : order.payment_status}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Order Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index <= getStatusIndex(order.status)
              const isCurrent = index === getStatusIndex(order.status)

              return (
                <div key={step.key} className="flex flex-col items-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? step.color : 'bg-gray-200'
                  }`}>
                    <StepIcon className={`h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-muted-foreground">Current</p>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`absolute w-full h-0.5 ${
                      isActive ? 'bg-primary' : 'bg-gray-200'
                    }`} style={{ left: '50%', top: '20px', width: '100%', zIndex: -1 }} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      {order.payment_method === 'cod' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Cash on Delivery</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700 mb-2">
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Payment on Delivery</span>
              </div>
              <p className="text-sm text-blue-600">
                You will pay <strong>Rp {order.total_amount.toLocaleString()}</strong> when your order arrives.
                No additional fees for COD orders.
              </p>
            </div>

            {order.payment_status === 'pending' && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-700 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Payment Pending</span>
                </div>
                <p className="text-sm text-yellow-600">
                  Payment will be collected upon delivery. Please have the exact amount ready.
                </p>
              </div>
            )}

            {order.payment_status === 'paid' && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Payment Received</span>
                </div>
                <p className="text-sm text-green-600">
                  Payment has been received. Thank you for your order!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Shipping Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Shipping Method</Label>
              <p className="text-sm">{order.shipping_method}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Estimated Delivery</Label>
              <p className="text-sm">{getEstimatedDelivery()}</p>
            </div>
          </div>

          {order.tracking_number && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tracking Number</Label>
              <p className="text-sm font-mono">{order.tracking_number}</p>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Shipping Address</Label>
            <p className="text-sm whitespace-pre-line">{order.shipping_address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rp {item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>Rp {order.subtotal.toLocaleString()}</span>
            </div>
            {order.shipping_cost > 0 && (
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Rp {order.shipping_cost.toLocaleString()}</span>
              </div>
            )}
            {order.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>Rp {order.tax_amount.toLocaleString()}</span>
              </div>
            )}
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-Rp {order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Rp {order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.status === 'pending' && (
              <Button 
                onClick={() => handleStatusUpdate('confirmed')}
                className="w-full"
                variant="outline"
              >
                Confirm Order
              </Button>
            )}
            {order.status === 'confirmed' && (
              <Button 
                onClick={() => handleStatusUpdate('processing')}
                className="w-full"
                variant="outline"
              >
                Start Processing
              </Button>
            )}
            {order.status === 'processing' && (
              <Button 
                onClick={() => handleStatusUpdate('shipped')}
                className="w-full"
                variant="outline"
              >
                Mark as Shipped
              </Button>
            )}
            {order.status === 'shipped' && (
              <Button 
                onClick={() => handleStatusUpdate('delivered')}
                className="w-full"
                variant="outline"
              >
                Mark as Delivered
              </Button>
            )}
            {order.payment_method === 'cod' && order.payment_status === 'pending' && (
              <Button 
                onClick={() => handleStatusUpdate('paid')}
                className="w-full"
                variant="default"
              >
                Mark Payment as Received
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
