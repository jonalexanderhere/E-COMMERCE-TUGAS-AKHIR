'use client'

import { useProducts } from '@/hooks/use-database'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ProductsGridProps {
  category?: string
  searchQuery?: string
  priceRange?: [number, number]
  sortBy?: string
}

export function ProductsGrid({ 
  category, 
  searchQuery, 
  priceRange, 
  sortBy = 'created_at' 
}: ProductsGridProps) {
  const { products, loading, error } = useProducts({
    category,
    search: searchQuery,
    priceRange,
    sortBy
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
