'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get('role') as 'student' | 'lecturer' | 'admin') || 'student'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const roleLabels = {
    student: 'Student',
    lecturer: 'Instructor',
    admin: 'Administrator',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate login - in a real app, this would call an API
    try {
      // For demo purposes, accept any credentials
      if (!email || !password) {
        setError('Please fill in all fields')
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Store user info in session storage (demo only - should use secure cookies in production)
      sessionStorage.setItem(
        'user',
        JSON.stringify({
          email,
          role,
          name: email.split('@')[0],
        })
      )

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">ILMS</h1>
          <p className="text-muted-foreground">Learning Management System</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 shadow-xl">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in as {roleLabels[role]}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="inline mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Don&apos;t have an account?{' '}
              <Link
                href={`/auth/register?role=${role}`}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
            <Link
              href="/"
              className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change role
            </Link>
          </div>

          {/* Demo Info */}
          <div className="mt-6 rounded-lg bg-accent/10 border border-accent/20 p-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-accent">Demo:</span> Use any email and password to login
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
