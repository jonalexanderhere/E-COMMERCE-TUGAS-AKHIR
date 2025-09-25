'use client'

import { AdminAuth } from '@/components/admin-auth'
import { AdminNav } from '@/components/admin-nav'
import { AdminDashboardEnhanced } from '@/components/admin-dashboard-enhanced'

export default function AdminPage() {
  return (
    <AdminAuth>
      <AdminNav>
        <AdminDashboardEnhanced />
      </AdminNav>
    </AdminAuth>
  )
}