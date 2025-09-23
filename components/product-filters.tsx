'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'
import { mockCategories } from '@/lib/mock-data'

const categories = mockCategories

const sortOptions = [
  { value: 'created_at', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' }
]

interface ProductFiltersProps {
  onFiltersChange?: (filters: {
    search: string
    category: string
    priceRange: [number, number]
    sortBy: string
  }) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [sortBy, setSortBy] = useState('created_at')

  const handleApplyFilters = () => {
    onFiltersChange?.({
      search,
      category: selectedCategory,
      priceRange,
      sortBy
    })
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setPriceRange([0, 1000000])
    setSortBy('created_at')
    onFiltersChange?.({
      search: '',
      category: '',
      priceRange: [0, 1000000],
      sortBy: 'created_at'
    })
  }

  const hasActiveFilters = search || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000000 || sortBy !== 'created_at'

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle>Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'ghost'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange([value[0], value[1]])}
              max={1000000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Rp {priceRange[0].toLocaleString()}</span>
              <span>Rp {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Active Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearch('')}
                  />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCategory}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategory('')}
                  />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: Rp {priceRange[0].toLocaleString()} - Rp {priceRange[1].toLocaleString()}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setPriceRange([0, 1000000])}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button onClick={handleClearFilters} variant="outline" className="w-full">
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  )
}
