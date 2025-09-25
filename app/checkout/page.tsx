'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutFormEnhanced } from '@/components/checkout-form-enhanced'
import { useCreateOrder } from '@/hooks/use-database'
import { useToast } from '@/hooks/use-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createOrder, loading } = useCreateOrder()

  const handleOrderSubmit = async (orderData: any) => {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`
      
      // Prepare order data
      const order = {
        ...orderData,
        order_number: orderNumber,
        user_id: 'current-user-id', // In real app, get from auth
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Create order in database
      const createdOrder = await createOrder(order)

      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderNumber} has been placed. ${
          orderData.payment_method === 'cod' 
            ? 'You will pay when your order arrives.' 
            : 'Please complete your payment.'
        }`,
      })

      // Redirect to order confirmation
      router.push(`/orders/${createdOrder.id}`)
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order with our secure checkout process
            </p>
          </div>

          <CheckoutFormEnhanced 
            onOrderSubmit={handleOrderSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}