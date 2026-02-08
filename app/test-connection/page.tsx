import { createClient } from '@/lib/supabase/server'
import { RefreshButton } from './RefreshButton'

export default async function TestConnectionPage() {
  const supabase = await createClient()
  
  // Test 1: Check if environment variables are set
  const hasEnvVars = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Test 2: Try to connect to Supabase
  let connectionStatus = 'Unknown'
  let connectionError = null
  let dbInfo = null

  try {
    // Try a simple query to verify connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      connectionStatus = 'Failed'
      connectionError = error.message
    } else {
      connectionStatus = 'Success'
    }

    // Get auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    dbInfo = {
      authStatus: authError ? 'Not authenticated (this is OK for testing)' : 'Authenticated',
      user: user ? { email: user.email, id: user.id } : null,
    }
  } catch (err) {
    connectionStatus = 'Failed'
    connectionError = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">
          Supabase Connection Test
        </h1>

        <div className="space-y-4">
          {/* Test 1: Environment Variables */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
              {hasEnvVars ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span className="text-red-500">✗</span>
              )}
              Environment Variables
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={hasEnvVars ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {hasEnvVars ? '✓ Configured' : '✗ Missing'}
                </span>
              </div>
              {hasEnvVars && (
                <div className="mt-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded text-zinc-600 dark:text-zinc-400 font-mono text-xs">
                  <div>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
                  <div>KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</div>
                </div>
              )}
            </div>
          </div>

          {/* Test 2: Database Connection */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
              {connectionStatus === 'Success' ? (
                <span className="text-green-500">✓</span>
              ) : connectionStatus === 'Failed' ? (
                <span className="text-red-500">✗</span>
              ) : (
                <span className="text-yellow-500">?</span>
              )}
              Database Connection
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={
                  connectionStatus === 'Success' 
                    ? 'text-green-600 dark:text-green-400' 
                    : connectionStatus === 'Failed'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }>
                  Status: {connectionStatus}
                </span>
              </div>
              {connectionError && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400 text-xs">
                  Error: {connectionError}
                </div>
              )}
              {dbInfo && (
                <div className="mt-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded text-zinc-600 dark:text-zinc-400 text-xs space-y-1">
                  <div>Auth: {dbInfo.authStatus}</div>
                  {dbInfo.user && (
                    <>
                      <div>User ID: {dbInfo.user.id}</div>
                      <div>Email: {dbInfo.user.email}</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Overall Status */}
          <div className={`rounded-lg p-6 border ${
            hasEnvVars && connectionStatus === 'Success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <h2 className="text-xl font-semibold mb-2" style={{
              color: hasEnvVars && connectionStatus === 'Success' ? '#16a34a' : '#dc2626'
            }}>
              {hasEnvVars && connectionStatus === 'Success' ? (
                '✓ Supabase is Connected!'
              ) : (
                '✗ Connection Issues Detected'
              )}
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {hasEnvVars && connectionStatus === 'Success' ? (
                'Your application is successfully connected to Supabase. You can now build your features!'
              ) : !hasEnvVars ? (
                'Please check your .env.local file and make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
              ) : (
                'Environment variables are set but connection failed. Check your Supabase credentials and make sure your database is accessible.'
              )}
            </p>
          </div>

          {/* Next Steps */}
          {hasEnvVars && connectionStatus === 'Success' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                🎉 Next Steps
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>✓ Apply database schema (supabase/schema.sql)</li>
                <li>✓ Create login and signup pages</li>
                <li>✓ Build the recipe feed</li>
                <li>✓ Implement recipe creation</li>
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-4">
            <a
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </a>
            <RefreshButton />
          </div>
        </div>
      </div>
    </div>
  )
}
