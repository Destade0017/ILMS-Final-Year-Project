'use client'

import Link from 'next/link'
import { BookOpen, Users, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Page() {
  const roles = [
    {
      title: 'Student',
      description: 'Access your courses, assignments, and progress',
      icon: BookOpen,
      href: '/auth/login?role=student',
      color: 'from-blue-600 to-blue-400',
    },
    {
      title: 'Instructor',
      description: 'Manage courses, create assignments and quizzes',
      icon: Users,
      href: '/auth/login?role=lecturer',
      color: 'from-purple-600 to-purple-400',
    },
    {
      title: 'Administrator',
      description: 'Oversee the entire learning platform',
      icon: BarChart3,
      href: '/auth/login?role=admin',
      color: 'from-cyan-600 to-cyan-400',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">ILMS</h1>
        <p className="text-xl text-muted-foreground mb-2">
          Integrated Learning Management System
        </p>
        <p className="text-muted-foreground">
          Select your role to get started
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-8">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <Link
              key={role.title}
              href={role.href}
              className="group"
            >
              <div className="relative h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-gradient-to-br ${role.color} transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                  <div className={`rounded-lg bg-gradient-to-br ${role.color} p-3`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {role.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Demo Button */}
      <Button asChild variant="outline" className="border-border">
        <a href="#demo">Learn More</a>
      </Button>

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>ILMS - Modern Learning Platform for the 21st Century</p>
      </div>
    </div>
  )
}
