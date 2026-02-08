export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipes: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          ingredients: Json
          steps: Json
          prep_time: number | null
          cook_time: number | null
          servings: number | null
          image_url: string | null
          visibility: 'public' | 'followers'
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description?: string | null
          ingredients?: Json
          steps?: Json
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          image_url?: string | null
          visibility?: 'public' | 'followers'
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string | null
          ingredients?: Json
          steps?: Json
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          image_url?: string | null
          visibility?: 'public' | 'followers'
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      profile_stats: {
        Row: {
          id: string | null
          username: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          followers_count: number | null
          following_count: number | null
          recipes_count: number | null
          created_at: string | null
        }
      }
      recipe_feed: {
        Row: {
          id: string | null
          title: string | null
          description: string | null
          image_url: string | null
          prep_time: number | null
          cook_time: number | null
          servings: number | null
          visibility: 'public' | 'followers' | null
          created_at: string | null
          creator_id: string | null
          creator_username: string | null
          creator_name: string | null
          creator_avatar: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      recipe_visibility: 'public' | 'followers'
      recipe_status: 'draft' | 'published'
    }
  }
}
