import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RegisterForm } from '@/components/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">J</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground">
                Join JonsStore and start shopping
              </p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
