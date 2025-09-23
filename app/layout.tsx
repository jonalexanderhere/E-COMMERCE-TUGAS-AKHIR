import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JonsStore - Modern E-commerce Platform',
  description: 'A modern, professional e-commerce platform built with Next.js, TypeScript, and Supabase. Features 100+ products, secure authentication, and admin dashboard.',
  keywords: ['e-commerce', 'online store', 'shopping', 'nextjs', 'typescript', 'supabase'],
  authors: [{ name: 'JonsStore Team' }],
  openGraph: {
    title: 'JonsStore - Modern E-commerce Platform',
    description: 'A modern, professional e-commerce platform with 100+ products and secure authentication.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JonsStore - Modern E-commerce Platform',
    description: 'A modern, professional e-commerce platform with 100+ products and secure authentication.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}