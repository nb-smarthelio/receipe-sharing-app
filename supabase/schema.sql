-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Note: Supabase Auth already manages the 'users' table (auth.users)
-- We create a 'profiles' table for additional user information

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Create index for username lookups
CREATE INDEX idx_profiles_username ON profiles(username);

-- ============================================================================
-- RECIPES TABLE
-- ============================================================================

CREATE TYPE recipe_visibility AS ENUM ('public', 'followers');
CREATE TYPE recipe_status AS ENUM ('draft', 'published');

CREATE TABLE recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  image_url TEXT,
  visibility recipe_visibility DEFAULT 'public' NOT NULL,
  status recipe_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200)
);

-- Create indexes for common queries
CREATE INDEX idx_recipes_creator_id ON recipes(creator_id);
CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_visibility ON recipes(visibility);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);

-- ============================================================================
-- FOLLOWS TABLE
-- ============================================================================

CREATE TABLE follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Composite primary key
  PRIMARY KEY (follower_id, following_id),
  
  -- Prevent self-following
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Create indexes for follower/following lookups
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RECIPES POLICIES
-- ============================================================================

-- Public recipes are viewable by everyone
CREATE POLICY "Public recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (
    status = 'published' AND 
    visibility = 'public'
  );

-- Followers can view followers-only recipes
CREATE POLICY "Followers can view followers-only recipes"
  ON recipes FOR SELECT
  USING (
    status = 'published' AND
    visibility = 'followers' AND
    (
      creator_id IN (
        SELECT following_id FROM follows WHERE follower_id = auth.uid()
      )
      OR creator_id = auth.uid()
    )
  );

-- Creators can view their own recipes (including drafts)
CREATE POLICY "Creators can view their own recipes"
  ON recipes FOR SELECT
  USING (creator_id = auth.uid());

-- Authenticated users can create recipes
CREATE POLICY "Authenticated users can create recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own recipes
CREATE POLICY "Creators can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Creators can delete their own recipes
CREATE POLICY "Creators can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = creator_id);

-- ============================================================================
-- FOLLOWS POLICIES
-- ============================================================================

-- Anyone can view follows
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

-- Users can follow others
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================================================
-- HELPER VIEWS (Optional - for easier queries)
-- ============================================================================

-- View to get follower/following counts
CREATE OR REPLACE VIEW profile_stats AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.bio,
  p.avatar_url,
  (SELECT COUNT(*) FROM follows WHERE following_id = p.id) as followers_count,
  (SELECT COUNT(*) FROM follows WHERE follower_id = p.id) as following_count,
  (SELECT COUNT(*) FROM recipes WHERE creator_id = p.id AND status = 'published') as recipes_count,
  p.created_at
FROM profiles p;

-- View to get recipe feed with creator info
CREATE OR REPLACE VIEW recipe_feed AS
SELECT 
  r.id,
  r.title,
  r.description,
  r.image_url,
  r.prep_time,
  r.cook_time,
  r.servings,
  r.visibility,
  r.created_at,
  p.id as creator_id,
  p.username as creator_username,
  p.full_name as creator_name,
  p.avatar_url as creator_avatar
FROM recipes r
JOIN profiles p ON r.creator_id = p.id
WHERE r.status = 'published';
