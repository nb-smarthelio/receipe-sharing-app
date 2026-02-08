'use client'

import { useState } from 'react'
import { signup } from '@/lib/actions/auth'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    // Validate passwords match
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // If no error is returned, redirect is happening (don't set loading to false)
    } catch (err) {
      // Ignore redirect errors from Next.js
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        return
      }
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          Join RecipeShare and start sharing your recipes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            required
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-white"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-zA-Z0-9_]+"
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-white"
            placeholder="johndoe"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            3-30 characters, letters, numbers, and underscores only
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={6}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-white"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            At least 6 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            required
            minLength={6}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
