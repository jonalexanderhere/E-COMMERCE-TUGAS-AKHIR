'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCategories } from '@/hooks/use-database'

// Color mapping for categories
const getCategoryColor = (categoryName: string) => {
  const colorMap: { [key: string]: string } = {
    'Electronics': 'from-blue-500/20 to-purple-500/20',
    'Fashion': 'from-pink-500/20 to-rose-500/20',
    'Home & Living': 'from-green-500/20 to-emerald-500/20',
    'Sports & Fitness': 'from-orange-500/20 to-red-500/20',
    'Books & Media': 'from-yellow-500/20 to-amber-500/20',
    'Beauty & Health': 'from-purple-500/20 to-indigo-500/20'
  }
  return colorMap[categoryName] || 'from-gray-500/20 to-gray-600/20'
}

export function CategoriesSection() {
  const { categories, loading, error } = useCategories()

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of categories to find exactly what you're looking for.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of categories to find exactly what you're looking for.
            </p>
          </div>
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading categories: {error}</p>
            <p className="text-sm text-muted-foreground">Using fallback data to ensure the app works</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of categories to find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.name}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category.name)}`} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description || 'Explore our collection'}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Explore collection
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/categories">
            <Button size="lg" variant="outline">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
