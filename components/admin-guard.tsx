'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers'
import { isAdmin, UserProfile } from '@/lib/auth-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (loading) return

      if (!user) {
        router.push('/auth/login')
        return
      }

      try {
        const adminStatus = await isAdmin(user)
        setIsAdminUser(adminStatus)
        setChecking(false)

        if (!adminStatus) {
          // Redirect non-admin users
          router.push('/')
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdminUser(false)
        setChecking(false)
      }
    }

    checkAdminStatus()
  }, [user, loading, router])

  // Show loading state
  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Checking Access</h3>
            <p className="text-gray-600 text-center">
              Verifying admin permissions...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show access denied for non-admin users
  if (!isAdminUser) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Admin access required
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button onClick={() => router.push('/')} className="w-full">
                Go to Homepage
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/login')} 
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show admin content
  return <>{children}</>
}

export default AdminGuard
