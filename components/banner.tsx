'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, X } from 'lucide-react'
import Link from 'next/link'

const banners = [
  {
    id: 1,
    title: '🎉 New Year Sale!',
    description: 'Get up to 50% off on all electronics',
    link: '/products?category=Electronics',
    bgColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
    textColor: 'text-white'
  },
  {
    id: 2,
    title: '🚚 Free Shipping',
    description: 'Free shipping on orders over Rp 500,000',
    link: '/products',
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
    textColor: 'text-white'
  },
  {
    id: 3,
    title: '💳 Secure Payment',
    description: 'Shop with confidence with our secure checkout',
    link: '/products',
    bgColor: 'bg-gradient-to-r from-orange-500 to-red-600',
    textColor: 'text-white'
  }
]

export function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  const banner = banners[currentBanner]

  return (
    <div className={`${banner.bgColor} ${banner.textColor} py-3 px-4 relative overflow-hidden`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-1 text-center">
            <h3 className="font-bold text-lg">{banner.title}</h3>
            <p className="text-sm opacity-90">{banner.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link href={banner.link}>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Shop Now
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Banner indicators */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentBanner ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
