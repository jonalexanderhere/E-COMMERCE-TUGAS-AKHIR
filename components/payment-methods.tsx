'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Smartphone, QrCode, Banknote, Truck } from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  code: string
  description: string
  icon_url: string
  is_active: boolean
  is_cod: boolean
  processing_fee: number
  min_amount?: number
  max_amount?: number
}

interface PaymentMethodsProps {
  selectedMethod?: string
  onMethodChange: (method: string) => void
  orderTotal: number
}

export function PaymentMethods({ selectedMethod, onMethodChange, orderTotal }: PaymentMethodsProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        // In a real app, this would fetch from your API
        const mockMethods: PaymentMethod[] = [
          {
            id: '1',
            name: 'Cash on Delivery',
            code: 'cod',
            description: 'Pay when your order arrives',
            icon_url: '',
            is_active: true,
            is_cod: true,
            processing_fee: 0,
            min_amount: 0,
            max_amount: 10000000
          },
          {
            id: '2',
            name: 'Bank Transfer',
            code: 'bank_transfer',
            description: 'Transfer to our bank account',
            icon_url: '',
            is_active: true,
            is_cod: false,
            processing_fee: 0,
            min_amount: 0,
            max_amount: 10000000
          },
          {
            id: '3',
            name: 'Credit Card',
            code: 'credit_card',
            description: 'Pay with Visa, Mastercard, or JCB',
            icon_url: '',
            is_active: true,
            is_cod: false,
            processing_fee: 2500,
            min_amount: 10000,
            max_amount: 50000000
          },
          {
            id: '4',
            name: 'E-Wallet',
            code: 'ewallet',
            description: 'Pay with OVO, GoPay, DANA, or LinkAja',
            icon_url: '',
            is_active: true,
            is_cod: false,
            processing_fee: 0,
            min_amount: 10000,
            max_amount: 10000000
          },
          {
            id: '5',
            name: 'QRIS',
            code: 'qris',
            description: 'Scan QR code to pay',
            icon_url: '',
            is_active: true,
            is_cod: false,
            processing_fee: 0,
            min_amount: 10000,
            max_amount: 5000000
          }
        ]

        setMethods(mockMethods.filter(method => 
          method.is_active && 
          (!method.min_amount || orderTotal >= method.min_amount) &&
          (!method.max_amount || orderTotal <= method.max_amount)
        ))
      } catch (error) {
        console.error('Error fetching payment methods:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [orderTotal])

  const getIcon = (code: string) => {
    switch (code) {
      case 'cod':
        return <Banknote className="h-5 w-5" />
      case 'bank_transfer':
        return <CreditCard className="h-5 w-5" />
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />
      case 'ewallet':
        return <Smartphone className="h-5 w-5" />
      case 'qris':
        return <QrCode className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
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
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <p className="text-sm text-muted-foreground">Choose your preferred payment method</p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={onMethodChange} className="space-y-3">
        {methods.map((method) => (
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
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={method.code} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      {method.is_cod && (
                        <Badge variant="secondary" className="text-xs">
                          COD
                        </Badge>
                      )}
                      {method.processing_fee > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +Rp {method.processing_fee.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      {selectedMethod && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {selectedMethod === 'cod' 
                ? 'Cash on Delivery Available' 
                : 'Payment Required Before Shipping'
              }
            </span>
          </div>
          {selectedMethod === 'cod' && (
            <p className="text-xs text-muted-foreground mt-1">
              You can pay with cash when your order arrives. No additional fees.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
