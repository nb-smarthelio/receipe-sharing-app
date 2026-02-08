export default function EmailConfirmedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">
            Email Confirmed!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Your email has been successfully verified. You can now sign in to your account and start sharing recipes!
          </p>

          {/* Action */}
          <a
            href="/"
            className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg text-center transition-all"
          >
            Sign In Now
          </a>
        </div>
      </div>
    </div>
  )
}
