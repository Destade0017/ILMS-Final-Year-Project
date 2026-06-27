'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get('role') as 'student' | 'lecturer' | 'admin') || 'student'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const roleLabels = {
    student: 'Student',
    lecturer: 'Instructor',
    admin: 'Administrator',
  }

  const passwordStrength = {
    weak: password => password.length < 8,
    medium: password => password.length >= 8 && !/[A-Z]/.test(password),
    strong: password => password.length >= 8 && /[A-Z]/.test(password),
  }

  const getPasswordStrengthColor = () => {
    const pwd = formData.password
    if (!pwd) return 'bg-muted'
    if (passwordStrength.strong(pwd)) return 'bg-green-500'
    if (passwordStrength.medium(pwd)) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }

      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address')
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSuccess(true)
      setTimeout(() => {
        // Store user info
        sessionStorage.setItem(
          'user',
          JSON.stringify({
            email: formData.email,
            role,
            name: formData.name,
          })
        )
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome!</h2>
          <p className="text-muted-foreground">Your account has been created successfully.</p>
          <p className="text-muted-foreground text-sm mt-4">Redirecting to dashboard...</p>
        </div>
      </div>
    )
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
            <h2 className="text-2xl font-bold text-foreground mb-1">Create Your Account</h2>
            <p className="text-sm text-muted-foreground">
              Join as {roleLabels[role]}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all`}
                      style={{
                        width: passwordStrength.weak(formData.password)
                          ? '33%'
                          : passwordStrength.medium(formData.password)
                            ? '66%'
                            : '100%',
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {passwordStrength.weak(formData.password)
                      ? 'Weak'
                      : passwordStrength.medium(formData.password)
                        ? 'Medium'
                        : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? (
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="inline mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Already have an account?{' '}
              <Link
                href={`/auth/login?role=${role}`}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
            <Link
              href="/"
              className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change role
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
