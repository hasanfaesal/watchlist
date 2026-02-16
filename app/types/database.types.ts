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
      watchlist: {
        Row: {
          id: string
          user_id: string
          tmdb_id: number
          title: string
          type: 'movie' | 'series'
          poster_path: string | null
          year: number | null
          watched_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          tmdb_id: number
          title: string
          type: 'movie' | 'series'
          poster_path?: string | null
          year?: number | null
          watched_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tmdb_id?: number
          title?: string
          type?: 'movie' | 'series'
          poster_path?: string | null
          year?: number | null
          watched_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
