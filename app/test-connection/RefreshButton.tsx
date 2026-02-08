'use client'

export function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="inline-block bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
    >
      Refresh Test
    </button>
  )
}
