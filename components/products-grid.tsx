'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
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
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const itemsPerPage = 12

  useEffect(() => {
    fetchProducts()
  }, [category, searchQuery, priceRange, sortBy, page])

  const fetchProducts = async () => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })

      // Apply filters
      if (category) {
        query = query.eq('category', category)
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (priceRange) {
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1])
      }

      // Apply sorting
      const sortField = sortBy === 'price_low' ? 'price' : 
                       sortBy === 'price_high' ? 'price' : 
                       sortBy === 'name' ? 'name' : 'created_at'
      
      const ascending = sortBy === 'price_low' || sortBy === 'name'
      query = query.order(sortField, { ascending })

      // Apply pagination
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        if (page === 1) {
          setProducts(data || [])
        } else {
          setProducts(prev => [...prev, ...(data || [])])
        }
        setTotalCount(count || 0)
        setHasMore((data?.length || 0) === itemsPerPage)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {totalCount} products
        </p>
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="text-center pt-8">
              <Button 
                onClick={loadMore} 
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Products'
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search criteria or browse all products.
          </p>
        </div>
      )}
    </div>
  )
}
