# Supabase Database Schema Guide

## Overview

This schema includes all tables and policies needed for the Recipe Sharing Platform.

## Tables Structure

### 1. **profiles**
Stores user profile information (extends Supabase Auth users table)

**Columns:**
- `id` - UUID (references auth.users)
- `username` - Unique username (3-30 chars, alphanumeric + underscore)
- `full_name` - User's full name
- `bio` - User bio/description
- `avatar_url` - Profile picture URL
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Automatic Creation:** A profile is automatically created when a user signs up via a trigger.

---

### 2. **recipes**
Stores all recipe data

**Columns:**
- `id` - UUID (auto-generated)
- `creator_id` - References profiles.id
- `title` - Recipe title (3-200 chars)
- `description` - Recipe description
- `ingredients` - JSONB array of ingredients
- `steps` - JSONB array of cooking steps
- `prep_time` - Preparation time in minutes
- `cook_time` - Cooking time in minutes
- `servings` - Number of servings
- `image_url` - Recipe image URL
- `visibility` - Enum: 'public', 'followers'
- `status` - Enum: 'draft', 'published'
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**JSONB Structure Examples:**

```json
// ingredients format
[
  {
    "item": "Flour",
    "amount": "2",
    "unit": "cups"
  },
  {
    "item": "Sugar",
    "amount": "1",
    "unit": "cup"
  }
]

// steps format
[
  {
    "order": 1,
    "instruction": "Preheat oven to 350°F"
  },
  {
    "order": 2,
    "instruction": "Mix flour and sugar in a bowl"
  }
]
```

---

### 3. **follows**
Manages follower/following relationships

**Columns:**
- `follower_id` - User who is following
- `following_id` - User being followed
- `created_at` - When the follow occurred

**Constraints:**
- Users cannot follow themselves
- Each follow relationship is unique (composite primary key)

---

## Row Level Security (RLS) Policies

### Profiles
- ✅ Everyone can view profiles
- ✅ Users can create their own profile
- ✅ Users can update only their own profile

### Recipes
- ✅ Everyone can view public published recipes
- ✅ Followers can view followers-only recipes from people they follow
- ✅ Creators can view all their own recipes (including drafts)
- ✅ Authenticated users can create recipes
- ✅ Creators can update/delete only their own recipes

### Follows
- ✅ Everyone can view follow relationships
- ✅ Users can follow others
- ✅ Users can unfollow others

---

## Helper Views

### profile_stats
Aggregates profile information with counts:
- Followers count
- Following count
- Published recipes count

### recipe_feed
Combines recipes with creator information for easy feed display

---

## How to Apply This Schema

### Option 1: Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `schema.sql`
5. Click **Run** or press `Ctrl/Cmd + Enter`

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

---

## Example Queries

### Get a user's feed (recipes from people they follow)

```sql
SELECT r.*
FROM recipes r
WHERE r.status = 'published'
  AND (
    r.visibility = 'public'
    OR (
      r.visibility = 'followers' 
      AND r.creator_id IN (
        SELECT following_id 
        FROM follows 
        WHERE follower_id = auth.uid()
      )
    )
  )
ORDER BY r.created_at DESC;
```

### Get profile with stats

```sql
SELECT * FROM profile_stats
WHERE username = 'john_doe';
```

### Follow a user

```sql
INSERT INTO follows (follower_id, following_id)
VALUES (auth.uid(), 'target-user-id');
```

### Create a recipe

```sql
INSERT INTO recipes (
  creator_id, 
  title, 
  description, 
  ingredients, 
  steps, 
  visibility, 
  status
) VALUES (
  auth.uid(),
  'Chocolate Chip Cookies',
  'Delicious homemade cookies',
  '[{"item": "Flour", "amount": "2", "unit": "cups"}]'::jsonb,
  '[{"order": 1, "instruction": "Mix ingredients"}]'::jsonb,
  'public',  -- or 'followers' for followers-only
  'published'
);
```

---

## Next Steps

After applying this schema:

1. ✅ Test user registration and profile creation
2. ✅ Test recipe creation with different visibility settings
3. ✅ Test follow/unfollow functionality
4. ✅ Set up Supabase client in your Next.js app
5. ✅ Create API routes/server actions for CRUD operations

---

## Security Notes

- All tables have Row Level Security (RLS) enabled
- Policies ensure users can only modify their own data
- Auth checks use `auth.uid()` which returns the currently authenticated user's ID
- JSONB validation should also be done on the application layer
