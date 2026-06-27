'use client'

import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

interface AppLayoutProps {
  children: React.ReactNode
  role?: 'student' | 'lecturer' | 'admin'
  userName?: string
  onLogout?: () => void
}

export function AppLayout({
  children,
  role = 'student',
  userName = 'User',
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar role={role} onLogout={onLogout} />

      {/* Main Content */}
      <div className="w-full lg:ml-64">
        {/* Navbar */}
        <Navbar userName={userName} role={role} />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)] pt-20 pb-8">
          <div className="px-4 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
