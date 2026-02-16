import type { WatchlistItem, WatchlistItemInput, WatchlistItemUpdate, WatchlistFilters } from '~/types'
import type { Database } from '~/types/database.types'

export const useWatchlist = () => {
  const supabase = useSupabaseClient<Database>()

  const items = useState<WatchlistItem[]>('watchlist-items', () => [])
  const isLoading = useState<boolean>('watchlist-loading', () => false)
  const error = useState<string | null>('watchlist-error', () => null)
  const currentFilters = useState<WatchlistFilters>('watchlist-filters', () => ({}))

  const fetchWatchlist = async (filters?: WatchlistFilters) => {
    if (filters) currentFilters.value = filters
    const active = currentFilters.value

    isLoading.value = true
    error.value = null

    let query = supabase
      .from('watchlist')
      .select('*')

    if (active.type) {
      query = query.eq('type', active.type)
    }

    if (active.sort === 'watched_asc') {
      query = query.order('watched_at', { ascending: true })
    } else if (active.sort === 'title_asc') {
      query = query.order('title', { ascending: true })
    } else {
      query = query.order('watched_at', { ascending: false })
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      error.value = fetchError.message
      items.value = []
    } else {
      items.value = (data as WatchlistItem[]) ?? []
    }

    isLoading.value = false
  }

  const addToWatchlist = async (item: WatchlistItemInput) => {
    error.value = null

    const { error: insertError } = await supabase
      .from('watchlist')
      .insert(item)

    if (insertError) {
      error.value = insertError.message
      return false
    }

    await fetchWatchlist()
    return true
  }

  const updateWatchlistItem = async (id: string, updates: WatchlistItemUpdate) => {
    error.value = null

    const { error: updateError } = await supabase
      .from('watchlist')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      error.value = updateError.message
      return false
    }

    await fetchWatchlist()
    return true
  }

  const removeFromWatchlist = async (id: string) => {
    error.value = null

    const { error: deleteError } = await supabase
      .from('watchlist')
      .delete()
      .eq('id', id)

    if (deleteError) {
      error.value = deleteError.message
      return false
    }

    await fetchWatchlist()
    return true
  }

  return {
    items,
    isLoading,
    currentFilters,
    error,
    fetchWatchlist,
    addToWatchlist,
    updateWatchlistItem,
    removeFromWatchlist
  }
}
