'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import StudentDashboardContent from '@/components/dashboards/student-dashboard'
import LecturerDashboardContent from '@/components/dashboards/lecturer-dashboard'
import AdminDashboardContent from '@/components/dashboards/admin-dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('User')
  const [role, setRole] = useState<'student' | 'lecturer' | 'admin'>('student')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = sessionStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name || 'User')
      setRole(userData.role || 'student')
      setIsLoading(false)
    } else {
      // Redirect to login if no user data
      router.push('/auth/login')
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout role={role} userName={userName} onLogout={() => {
      sessionStorage.removeItem('user')
      router.push('/')
    }}>
      {role === 'student' && <StudentDashboardContent />}
      {role === 'lecturer' && <LecturerDashboardContent />}
      {role === 'admin' && <AdminDashboardContent />}
    </AppLayout>
  )
}
