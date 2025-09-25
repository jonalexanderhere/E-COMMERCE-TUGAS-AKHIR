'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Clock, Truck, Zap, Package } from 'lucide-react'

interface ShippingMethod {
  id: string
  name: string
  code: string
  description: string
  base_cost: number
  cost_per_kg: number
  free_shipping_threshold?: number
  estimated_days_min: number
  estimated_days_max: number
  is_active: boolean
  is_cod_available: boolean
}

interface ShippingMethodsProps {
  selectedMethod?: string
  onMethodChange: (method: string, cost: number) => void
  orderTotal: number
  totalWeight: number
  paymentMethod: string
}

export function ShippingMethods({ 
  selectedMethod, 
  onMethodChange, 
  orderTotal, 
  totalWeight,
  paymentMethod 
}: ShippingMethodsProps) {
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchShippingMethods() {
      try {
        // In a real app, this would fetch from your API
        const mockMethods: ShippingMethod[] = [
          {
            id: '1',
            name: 'Regular Shipping',
            code: 'regular',
            description: 'Standard delivery service',
            base_cost: 15000,
            cost_per_kg: 5000,
            free_shipping_threshold: 500000,
            estimated_days_min: 3,
            estimated_days_max: 5,
            is_active: true,
            is_cod_available: true
          },
          {
            id: '2',
            name: 'Express Shipping',
            code: 'express',
            description: 'Fast delivery service',
            base_cost: 25000,
            cost_per_kg: 8000,
            free_shipping_threshold: 1000000,
            estimated_days_min: 1,
            estimated_days_max: 2,
            is_active: true,
            is_cod_available: true
          },
          {
            id: '3',
            name: 'Same Day Delivery',
            code: 'same_day',
            description: 'Delivery on the same day',
            base_cost: 50000,
            cost_per_kg: 10000,
            free_shipping_threshold: 2000000,
            estimated_days_min: 0,
            estimated_days_max: 1,
            is_active: true,
            is_cod_available: false
          },
          {
            id: '4',
            name: 'Next Day Delivery',
            code: 'next_day',
            description: 'Delivery the next day',
            base_cost: 35000,
            cost_per_kg: 8000,
            free_shipping_threshold: 1500000,
            estimated_days_min: 1,
            estimated_days_max: 1,
            is_active: true,
            is_cod_available: true
          }
        ]

        // Filter methods based on payment method and order total
        const availableMethods = mockMethods.filter(method => {
          if (!method.is_active) return false
          
          // If COD is selected, only show methods that support COD
          if (paymentMethod === 'cod' && !method.is_cod_available) return false
          
          return true
        })

        setMethods(availableMethods)
      } catch (error) {
        console.error('Error fetching shipping methods:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShippingMethods()
  }, [paymentMethod])

  const calculateShippingCost = (method: ShippingMethod) => {
    // Check if free shipping applies
    if (method.free_shipping_threshold && orderTotal >= method.free_shipping_threshold) {
      return 0
    }

    // Calculate cost based on weight
    const weightCost = totalWeight * method.cost_per_kg
    return method.base_cost + weightCost
  }

  const getIcon = (code: string) => {
    switch (code) {
      case 'regular':
        return <Package className="h-5 w-5" />
      case 'express':
        return <Truck className="h-5 w-5" />
      case 'same_day':
        return <Zap className="h-5 w-5" />
      case 'next_day':
        return <Clock className="h-5 w-5" />
      default:
        return <Truck className="h-5 w-5" />
    }
  }

  const getEstimatedDays = (method: ShippingMethod) => {
    if (method.estimated_days_min === method.estimated_days_max) {
      return `${method.estimated_days_min} day${method.estimated_days_min !== 1 ? 's' : ''}`
    }
    return `${method.estimated_days_min}-${method.estimated_days_max} days`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-20 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Shipping Method</h3>
        <p className="text-sm text-muted-foreground">Choose your preferred delivery option</p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={(value) => {
        const method = methods.find(m => m.code === value)
        if (method) {
          const cost = calculateShippingCost(method)
          onMethodChange(value, cost)
        }
      }} className="space-y-3">
        {methods.map((method) => {
          const cost = calculateShippingCost(method)
          const isFree = cost === 0

          return (
            <Card key={method.id} className={`cursor-pointer transition-all ${
              selectedMethod === method.code 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={method.code} id={method.code} />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-primary">
                      {getIcon(method.code)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={method.code} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          {!method.is_cod_available && (
                            <Badge variant="outline" className="text-xs">
                              No COD
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          {isFree ? (
                            <Badge variant="secondary" className="text-green-600">
                              FREE
                            </Badge>
                          ) : (
                            <span className="font-semibold">
                              Rp {cost.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>⏱️ {getEstimatedDays(method)}</span>
                        {isFree && (
                          <span className="text-green-600">✓ Free shipping</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </RadioGroup>

      {selectedMethod && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {calculateShippingCost(methods.find(m => m.code === selectedMethod)!) === 0 
                ? 'Free Shipping Applied' 
                : 'Shipping Cost Calculated'
              }
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {paymentMethod === 'cod' 
              ? 'You can pay the shipping cost along with your order when it arrives.'
              : 'Shipping cost will be added to your total payment.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
