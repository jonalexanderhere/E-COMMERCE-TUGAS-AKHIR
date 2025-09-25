'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { PaymentMethods } from '@/components/payment-methods'
import { ShippingMethods } from '@/components/shipping-methods'
import { useCart } from '@/hooks/use-cart'
import { ShoppingCart, CreditCard, Truck, MapPin, User } from 'lucide-react'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  notes: z.string().optional()
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormEnhancedProps {
  onOrderSubmit: (orderData: any) => void
  loading?: boolean
}

export function CheckoutFormEnhanced({ onOrderSubmit, loading = false }: CheckoutFormEnhancedProps) {
  const { items, getTotalPrice, clearCart } = useCart()
  const total = getTotalPrice()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cod')
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('')
  const [shippingCost, setShippingCost] = useState<number>(0)
  const [processingFee, setProcessingFee] = useState<number>(0)
  const [tax, setTax] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema)
  })

  // Calculate total weight (mock calculation)
  const totalWeight = items.reduce((sum, item) => sum + (item.product.weight || 0.5) * item.quantity, 0)

  // Calculate final total
  const subtotal = total
  const finalTotal = subtotal + shippingCost + processingFee + tax - discount

  useEffect(() => {
    // Calculate processing fee based on payment method
    if (selectedPaymentMethod === 'credit_card') {
      setProcessingFee(2500)
    } else {
      setProcessingFee(0)
    }

    // Calculate tax (10% of subtotal)
    setTax(Math.round(subtotal * 0.1))

    // Check for free shipping
    if (subtotal >= 500000) {
      setShippingCost(0)
    }
  }, [selectedPaymentMethod, subtotal])

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handleShippingMethodChange = (method: string, cost: number) => {
    setSelectedShippingMethod(method)
    setShippingCost(cost)
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedShippingMethod) {
      alert('Please select a shipping method')
      return
    }

    const orderData = {
      ...data,
      items: items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      payment_method: selectedPaymentMethod,
      shipping_method: selectedShippingMethod,
      subtotal,
      shipping_cost: shippingCost,
      processing_fee: processingFee,
      tax_amount: tax,
      discount_amount: discount,
      total_amount: finalTotal,
      status: 'pending',
      payment_status: selectedPaymentMethod === 'cod' ? 'pending' : 'pending'
    }

    try {
      await onOrderSubmit(orderData)
      clearCart()
    } catch (error) {
      console.error('Error submitting order:', error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground">Add some items to your cart to proceed with checkout.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Enter your complete address"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    {...register('postalCode')}
                    placeholder="Enter postal code"
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Any special instructions for your order"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethods
                selectedMethod={selectedPaymentMethod}
                onMethodChange={handlePaymentMethodChange}
                orderTotal={subtotal}
              />
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ShippingMethods
                selectedMethod={selectedShippingMethod}
                onMethodChange={handleShippingMethodChange}
                orderTotal={subtotal}
                totalWeight={totalWeight}
                paymentMethod={selectedPaymentMethod}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0">
                      <img
                        src={item.product.image_url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      Rp {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Rp {shippingCost.toLocaleString()}</span>
                  </div>
                )}
                {processingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>Rp {processingFee.toLocaleString()}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>Rp {tax.toLocaleString()}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-Rp {discount.toLocaleString()}</span>
                  </div>
                )}
                {shippingCost === 0 && subtotal >= 500000 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Free Shipping</span>
                    <span>Applied</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>Rp {finalTotal.toLocaleString()}</span>
              </div>

              {/* Payment Method Info */}
              {selectedPaymentMethod === 'cod' && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-medium">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Pay with cash when your order arrives. No additional fees.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || !selectedShippingMethod}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
