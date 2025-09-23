import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminDashboard } from '@/components/admin-dashboard'

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your store and orders
            </p>
          </div>
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
