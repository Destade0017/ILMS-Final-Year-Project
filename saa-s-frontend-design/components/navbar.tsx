'use client'

import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface NavbarProps {
  userName?: string
  role?: 'student' | 'lecturer' | 'admin'
}

export function Navbar({ userName = 'User', role = 'student' }: NavbarProps) {
  const [isDark, setIsDark] = useState(true)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      if (isDark) {
        html.classList.remove('dark')
      } else {
        html.classList.add('dark')
      }
    }
  }

  const roleLabel = {
    student: 'Student',
    lecturer: 'Instructor',
    admin: 'Administrator',
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm lg:left-64">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Search Bar */}
        <div className="hidden flex-1 max-w-md lg:flex">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses, assignments..."
              className="flex-1 border-0 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </div>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <div className="hidden flex-col items-end sm:flex">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">
                {roleLabel[role as keyof typeof roleLabel]}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </Button>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}
