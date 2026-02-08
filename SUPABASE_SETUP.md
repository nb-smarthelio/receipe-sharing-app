# Supabase Setup Guide

## ✅ What's Been Set Up

The following files have been created for your Supabase integration:

```
lib/
├── supabase/
│   ├── client.ts       # Client-side Supabase client
│   ├── server.ts       # Server-side Supabase client
│   └── middleware.ts   # Middleware-specific client
middleware.ts           # Next.js middleware for auth
types/
└── database.types.ts   # TypeScript types for your database
.env.local.example      # Example environment variables
```

---

## 🚀 Quick Start

### Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (under "Configuration")
   - **anon/public key** (under "Project API keys")

### Step 2: Create Your Environment File

Create a `.env.local` file in the root of your project:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Apply the Database Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql`
5. Paste and click **Run** (or press `Ctrl/Cmd + Enter`)

### Step 4: Restart Your Dev Server

```bash
npm run dev
```

---

## 📚 Usage Guide

### Client Components (use client)

For interactive components that run in the browser:

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const supabase = createClient()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return <div>User: {user?.email}</div>
}
```

### Server Components (default)

For components that render on the server:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Not logged in</div>
  }

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .eq('creator_id', user.id)

  return (
    <div>
      <h1>My Recipes</h1>
      {recipes?.map(recipe => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
    </div>
  )
}
```

### Server Actions

For form submissions and mutations:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRecipe(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('recipes')
    .insert({
      creator_id: user.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      visibility: 'public',
      status: 'published',
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/feed')
  return data
}
```

### Route Handlers (API Routes)

For API endpoints:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('visibility', 'public')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ recipes })
}
```

---

## 🔒 Authentication Examples

### Sign Up

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        username: formData.get('username') as string,
        full_name: formData.get('full_name') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    throw error
  }

  redirect('/feed')
}
```

### Sign In

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw error
  }

  redirect('/feed')
}
```

### Sign Out

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### Get Current User

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.bio}</p>
    </div>
  )
}
```

---

## 🛡️ Protected Routes

The middleware automatically protects these routes:

- `/feed` - Requires authentication
- `/profile` - Requires authentication
- `/recipe/new` - Requires authentication

To add more protected routes, edit `lib/supabase/middleware.ts`:

```typescript
const protectedRoutes = ['/feed', '/profile', '/recipe/new', '/settings']
```

---

## 🔍 Database Queries Examples

### Get Public Recipes

```typescript
const { data: recipes } = await supabase
  .from('recipes')
  .select('*, profiles(username, avatar_url)')
  .eq('status', 'published')
  .eq('visibility', 'public')
  .order('created_at', { ascending: false })
```

### Get Feed (recipes from followed users)

```typescript
const { data: followedUsers } = await supabase
  .from('follows')
  .select('following_id')
  .eq('follower_id', user.id)

const followingIds = followedUsers?.map(f => f.following_id) || []

const { data: recipes } = await supabase
  .from('recipes')
  .select('*, profiles(username, avatar_url)')
  .eq('status', 'published')
  .or(`visibility.eq.public,and(visibility.eq.followers,creator_id.in.(${followingIds.join(',')}))`)
  .order('created_at', { ascending: false })
```

### Follow/Unfollow User

```typescript
// Follow
await supabase
  .from('follows')
  .insert({ follower_id: currentUserId, following_id: targetUserId })

// Unfollow
await supabase
  .from('follows')
  .delete()
  .eq('follower_id', currentUserId)
  .eq('following_id', targetUserId)
```

### Check if Following

```typescript
const { data } = await supabase
  .from('follows')
  .select('*')
  .eq('follower_id', currentUserId)
  .eq('following_id', targetUserId)
  .maybeSingle()

const isFollowing = !!data
```

---

## 🎨 TypeScript Types

All your database types are available in `types/database.types.ts`. Use them like this:

```typescript
import type { Database } from '@/types/database.types'

type Recipe = Database['public']['Tables']['recipes']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type RecipeInsert = Database['public']['Tables']['recipes']['Insert']
type RecipeUpdate = Database['public']['Tables']['recipes']['Update']
```

---

## 🐛 Troubleshooting

### "User not found" or session issues

Make sure:
1. Your `.env.local` file is in the root directory
2. You've restarted the dev server after creating `.env.local`
3. Your Supabase project URL and anon key are correct

### Type errors

If you see TypeScript errors about the `@/` alias:
1. Check that `tsconfig.json` has the paths configured
2. Restart your TypeScript server in VS Code/Cursor

### RLS Policy errors

If you get permission denied errors:
1. Make sure you've run the full `schema.sql` file in Supabase
2. Check that RLS policies are enabled in the Supabase dashboard
3. Verify you're authenticated when trying to access protected data

---

## 📝 Next Steps

Now that Supabase is set up, you can:

1. ✅ Create login/signup pages
2. ✅ Build the recipe creation form
3. ✅ Implement the feed page
4. ✅ Create profile pages
5. ✅ Add follow/unfollow functionality

Happy coding!
