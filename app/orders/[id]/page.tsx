'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { OrderStatusCOD } from '@/components/order-status-cod'
import { useOrders } from '@/hooks/use-database'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const { orders, loading, error } = useOrders()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (orders.length > 0) {
      const foundOrder = orders.find(o => o.id === orderId)
      setOrder(foundOrder)
    }
  }, [orders, orderId])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    // In a real app, this would update the order status in the database
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
    
    // For demo purposes, just update the local state
    if (order) {
      setOrder({
        ...order,
        status: newStatus,
        payment_status: newStatus === 'delivered' ? 'paid' : order.payment_status
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Order</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link href="/orders">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/orders">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>

          <OrderStatusCOD 
            order={order}
            onStatusUpdate={handleStatusUpdate}
            isAdmin={false} // In real app, check user role
          />
        </div>
      </div>
    </div>
  )
}