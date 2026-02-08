'use client'

import { signout } from '@/lib/actions/auth'
import { useState } from 'react'

export function SignOutButton() {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signout()
    } catch (err) {
      // Ignore redirect errors
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        return
      }
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium disabled:opacity-50"
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
