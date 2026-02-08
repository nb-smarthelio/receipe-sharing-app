import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

export default async function FeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              RecipeShare
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/recipe/new"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Recipe
            </a>
            <a
              href={`/profile/${profile?.username}`}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
            >
              Profile
            </a>
            <SignOutButton />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Welcome back, {profile?.full_name || profile?.username}! 👋
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Your recipe feed will appear here
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
              No Recipes Yet
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Start by creating your first recipe or following other creators to
              see their recipes here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/recipe/new"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Recipe
              </a>
              <a
                href="/explore"
                className="border-2 border-zinc-200 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-500 text-zinc-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Users
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
