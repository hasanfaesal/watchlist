export type WatchlistType = 'movie' | 'series'

export interface WatchlistItem {
  id: string
  user_id: string
  tmdb_id: number
  title: string
  type: WatchlistType
  poster_path: string | null
  year: number | null
  watched_at: string
  created_at: string
}

export interface WatchlistItemInput {
  tmdb_id: number
  title: string
  type: WatchlistType
  poster_path?: string | null
  year?: number | null
  watched_at?: string
}

export interface WatchlistItemUpdate {
  watched_at?: string
}

export type WatchlistSort = 'watched_desc' | 'watched_asc' | 'title_asc'

export interface WatchlistFilters {
  type?: WatchlistType
  sort?: WatchlistSort
}

export interface TMDBSearchResult {
  id: number
  title: string
  media_type: 'movie' | 'tv'
  poster_path: string | null
  release_date: string | null
}
