'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  role?: 'student' | 'lecturer' | 'admin'
  onLogout?: () => void
}

export function Sidebar({ role = 'student', onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const navItems = {
    student: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Courses', icon: BookOpen, href: '/courses' },
      { label: 'Assignments', icon: Users, href: '/assignments' },
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
    lecturer: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'My Courses', icon: BookOpen, href: '/my-courses' },
      { label: 'Students', icon: Users, href: '/students' },
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
    admin: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Users', icon: Users, href: '/users' },
      { label: 'Courses', icon: BookOpen, href: '/courses-admin' },
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
  }

  const items = navItems[role]

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-sidebar-border px-6 py-4">
            <h1 className="text-xl font-bold text-primary">ILMS</h1>
            <p className="text-xs text-sidebar-foreground/60">Learning Hub</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-sidebar-border px-3 py-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-red-500/10 hover:text-red-400"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
