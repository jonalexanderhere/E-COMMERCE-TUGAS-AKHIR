'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Welcome to{' '}
                <span className="text-primary">JonsStore</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Discover amazing products with modern design and exceptional quality. 
                Your one-stop destination for all your shopping needs.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">100% secure checkout</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Headphones className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">24/7 Support</p>
                  <p className="text-sm text-muted-foreground">Always here to help</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
              <div className="h-full w-full rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="h-32 w-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">Premium Products</h3>
                  <p className="text-muted-foreground">Quality you can trust</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-secondary/20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
