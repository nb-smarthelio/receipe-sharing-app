# Quick Start - Supabase Integration

## ✅ What's Ready

Your Next.js app is now fully configured with Supabase! Here's what's been set up:

### 📁 Files Created

```
lib/
├── supabase/
│   ├── client.ts          # Client-side Supabase
│   ├── server.ts          # Server-side Supabase  
│   └── middleware.ts      # Auth middleware
├── hooks/
│   └── useUser.ts         # React hook for current user
└── actions/
    └── auth.ts            # Server actions for auth

middleware.ts              # Route protection
types/
└── database.types.ts      # Database TypeScript types

.env.local.example         # Environment variables template
```

---

## 🚀 3 Steps to Get Started

### 1️⃣ Add Your Supabase Credentials

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API

### 2️⃣ Apply Database Schema

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Copy contents of `supabase/schema.sql`
3. Paste and click **Run**

### 3️⃣ Restart Dev Server

```bash
npm run dev
```

---

## 💻 Quick Usage Examples

### Get Current User in Server Component

```typescript
import { getCurrentUser } from '@/lib/actions/auth'

export default async function Page() {
  const user = await getCurrentUser()
  return <div>Hello {user?.email}</div>
}
```

### Get Current User in Client Component

```typescript
'use client'
import { useUser } from '@/lib/hooks/useUser'

export default function Component() {
  const { user, loading } = useUser()
  
  if (loading) return <div>Loading...</div>
  return <div>Hello {user?.email}</div>
}
```

### Login Form (Server Action)

```typescript
import { login } from '@/lib/actions/auth'

export default function LoginPage() {
  return (
    <form action={login}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Fetch Data (Server Component)

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function RecipesPage() {
  const supabase = await createClient()
  
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*, profiles(username, avatar_url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div>
      {recipes?.map(recipe => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
    </div>
  )
}
```

---

## 🛡️ Protected Routes

These routes require authentication (configured in middleware):
- `/feed`
- `/profile`
- `/recipe/new`

Users will be redirected to `/login` if not authenticated.

---

## 📚 Full Documentation

For complete examples and advanced usage, see `SUPABASE_SETUP.md`

---

## ⚠️ Important Note About Node Version

You're currently using Node.js 18.16.1, but Next.js 16 requires Node.js >= 20.9.0.

Please upgrade Node.js:

```bash
nvm install 20
nvm use 20
```

Then restart your dev server.
