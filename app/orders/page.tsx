import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { OrdersList } from '@/components/orders-list'

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>
          <OrdersList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
