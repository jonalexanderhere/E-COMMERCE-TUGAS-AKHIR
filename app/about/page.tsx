import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">About JonsStore</h1>
              <p className="text-xl text-muted-foreground">
                Your trusted partner for quality products and exceptional shopping experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2024, JonsStore has been committed to providing customers with 
                  high-quality products at competitive prices. We believe that shopping should 
                  be convenient, enjoyable, and accessible to everyone.
                </p>
                <p className="text-muted-foreground">
                  Our mission is to connect customers with the products they love while 
                  maintaining the highest standards of service and quality.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Quality: We only offer products that meet our high standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Customer Service: Your satisfaction is our priority</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Innovation: We embrace new technologies to improve your experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Transparency: Honest pricing and clear communication</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-8">Why Choose JonsStore?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <h3 className="font-semibold mb-2">Fast Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders over Rp 500,000 with fast delivery
                  </p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="font-semibold mb-2">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is protected with industry-standard security
                  </p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">↩️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy for your peace of mind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
