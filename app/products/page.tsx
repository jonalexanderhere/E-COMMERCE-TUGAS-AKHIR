import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductsGrid } from '@/components/products-grid'
import { ProductFilters } from '@/components/product-filters'

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">
              Discover our complete collection of premium products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <ProductFilters />
            </div>
            <div className="lg:w-3/4">
              <ProductsGrid />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
