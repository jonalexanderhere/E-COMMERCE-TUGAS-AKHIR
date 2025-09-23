import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Star, Users, Truck } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to{' '}
                <span className="text-blue-600">JonsStore</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover amazing products at unbeatable prices. From electronics to fashion, 
                we have everything you need for your modern lifestyle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Premium Quality</h3>
                  <p className="text-gray-600">
                    Curated selection of high-quality products from trusted brands.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Fast Delivery</h3>
                  <p className="text-gray-600">
                    Quick and reliable shipping to your doorstep.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Support</h3>
                  <p className="text-gray-600">
                    Dedicated support team ready to help you 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

