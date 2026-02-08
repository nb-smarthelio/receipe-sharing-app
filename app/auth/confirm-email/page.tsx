export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">
              Check Your Email
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We&apos;ve sent you a confirmation email. Please click the link in the email to verify your account and complete your registration.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Check your inbox
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Look for an email from RecipeShare
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Click the confirmation link
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  This will verify your email address
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Sign in to your account
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Return here and log in
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> If you don&apos;t see the email, check your spam or junk folder.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-center transition-colors"
            >
              Back to Home
            </a>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already confirmed?{' '}
              <a href="/" className="text-orange-500 hover:text-orange-600 font-semibold">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
          Didn&apos;t receive the email? Contact support or try signing up again.
        </p>
      </div>
    </div>
  )
}
