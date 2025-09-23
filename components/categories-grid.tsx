'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { mockProducts } from '@/lib/mock-data'

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and tech',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    color: 'from-blue-500/20 to-purple-500/20',
    productCount: mockProducts.filter(p => p.category === 'Electronics').length
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Trendy clothing & accessories',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    color: 'from-pink-500/20 to-rose-500/20',
    productCount: mockProducts.filter(p => p.category === 'Fashion').length
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Beautiful home essentials',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    color: 'from-green-500/20 to-emerald-500/20',
    productCount: mockProducts.filter(p => p.category === 'Home & Living').length
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    description: 'Active lifestyle gear',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    color: 'from-orange-500/20 to-red-500/20',
    productCount: mockProducts.filter(p => p.category === 'Sports & Fitness').length
  },
  {
    id: 'books',
    name: 'Books & Media',
    description: 'Knowledge and entertainment',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    color: 'from-yellow-500/20 to-amber-500/20',
    productCount: mockProducts.filter(p => p.category === 'Books & Media').length
  },
  {
    id: 'beauty',
    name: 'Beauty & Health',
    description: 'Self-care essentials',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    color: 'from-purple-500/20 to-indigo-500/20',
    productCount: mockProducts.filter(p => p.category === 'Beauty & Health').length
  }
]

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/products?category=${category.name}`}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
            <div className="relative aspect-video overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {category.productCount} products
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
