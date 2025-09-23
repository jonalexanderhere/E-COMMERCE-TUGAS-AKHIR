import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { CategoriesGrid } from '@/components/categories-grid'
import { Banner } from '@/components/banner'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  )
}