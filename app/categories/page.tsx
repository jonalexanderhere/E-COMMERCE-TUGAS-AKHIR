import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CategoriesGrid } from '@/components/categories-grid'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Categories</h1>
            <p className="text-muted-foreground">
              Browse products by category
            </p>
          </div>
          <CategoriesGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
