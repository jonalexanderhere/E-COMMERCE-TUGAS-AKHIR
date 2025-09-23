'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { mockProducts } from '@/lib/mock-data'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(8)
          .order('created_at', { ascending: false })

        if (error || !data || data.length === 0) {
          // Fallback to mock data
          console.log('Using mock data for products')
          setProducts(mockProducts.slice(0, 8))
        } else {
          setProducts(data)
        }
      } catch (error) {
        // Fallback to mock data on error
        console.log('Error fetching products, using mock data:', error)
        setProducts(mockProducts.slice(0, 8))
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">Loading amazing products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that combine 
            quality, style, and exceptional value.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/products">
                <Button size="lg" variant="outline">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon for amazing products!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
