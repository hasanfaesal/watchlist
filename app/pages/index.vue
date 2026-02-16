<script setup lang="ts">
import type { TMDBSearchResult, WatchlistItem, WatchlistType, WatchlistSort } from '~/types'

useSeoMeta({ title: 'Watchlist' })

const toast = useToast()
const { items, isLoading, error, fetchWatchlist, addToWatchlist, updateWatchlistItem, removeFromWatchlist } = useWatchlist()

// Filters
const typeFilter = ref<WatchlistType | 'all'>('all')
const sortOrder = ref<WatchlistSort>('watched_desc')

const typeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'Series', value: 'series' }
]

const sortOptions = [
  { label: 'Newest first', value: 'watched_desc' },
  { label: 'Oldest first', value: 'watched_asc' },
  { label: 'Title A-Z', value: 'title_asc' }
]

const loadWatchlist = () => {
  fetchWatchlist({
    type: typeFilter.value === 'all' ? undefined : typeFilter.value,
    sort: sortOrder.value
  })
}

watch([typeFilter, sortOrder], () => loadWatchlist())
onMounted(() => loadWatchlist())

// Add item modal
const addModalOpen = ref(false)
const selectedResult = ref<TMDBSearchResult | null>(null)

const onSearchSelect = (result: TMDBSearchResult) => {
  selectedResult.value = result
  addModalOpen.value = true
}

const onConfirmAdd = async (watchedAt: string) => {
  if (!selectedResult.value) return

  const result = selectedResult.value
  const success = await addToWatchlist({
    tmdb_id: result.id,
    title: result.title,
// TODO: 'tv' instead of 'series'? 
    type: result.media_type === 'movie' ? 'movie' : 'series',
    poster_path: result.poster_path,
    year: result.release_date ? new Date(result.release_date).getFullYear() : null,
    watched_at: watchedAt
  })

  if (success) {
    toast.add({ title: 'Added to watchlist', description: result.title, color: 'success', icon: 'i-lucide-check' })
    loadWatchlist()
  } else {
    toast.add({ title: 'Failed to add', description: error.value || 'Please sign in or check your connection', color: 'error', icon: 'i-lucide-x' })
  }

  selectedResult.value = null
}

// Edit modal
const editModalOpen = ref(false)
const editingItem = ref<WatchlistItem | null>(null)

const onEdit = (item: WatchlistItem) => {
  editingItem.value = item
  editModalOpen.value = true
}

const onConfirmEdit = async (id: string, watchedAt: string) => {
  const success = await updateWatchlistItem(id, { watched_at: watchedAt })

  if (success) {
    toast.add({ title: 'Updated', color: 'success', icon: 'i-lucide-check' })
    loadWatchlist()
  } else {
    toast.add({ title: 'Failed to update', color: 'error', icon: 'i-lucide-x' })
  }

  editingItem.value = null
}

// Delete confirmation
const deleteModalOpen = ref(false)
const deletingItem = ref<WatchlistItem | null>(null)

const onDelete = (item: WatchlistItem) => {
  deletingItem.value = item
  deleteModalOpen.value = true
}

const onConfirmDelete = async () => {
  if (!deletingItem.value) return

  const success = await removeFromWatchlist(deletingItem.value.id)

  if (success) {
    toast.add({ title: 'Removed from watchlist', color: 'success', icon: 'i-lucide-check' })
    loadWatchlist()
  } else {
    toast.add({ title: 'Failed to remove', color: 'error', icon: 'i-lucide-x' })
  }

  deletingItem.value = null
  deleteModalOpen.value = false
}
</script>

<template>
  <UContainer class="py-8">
    <div class="space-y-6">
      <!-- Search -->
      <SearchBar @select="onSearchSelect" />

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-3">
        <USelect
          v-model="typeFilter"
          :items="typeOptions"
          placeholder="Filter by type"
        />
        <USelect
          v-model="sortOrder"
          :items="sortOptions"
          placeholder="Sort by"
        />
      </div>

      <!-- 1.Loading skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="n in 6" :key="n">
          <div class="flex gap-4">
            <USkeleton class="h-28 w-20 rounded" />
            <div class="flex-1 space-y-2">
              <USkeleton class="h-4 w-3/4" />
              <USkeleton class="h-3 w-1/2" />
              <USkeleton class="h-3 w-1/3" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- 2.Empty state -->
      <div v-else-if="items.length === 0" class="py-16 text-center">
        <UIcon name="i-lucide-film" class="text-muted mx-auto size-12" />
        <h3 class="text-default mt-4 text-lg font-semibold">No items yet</h3>
        <p class="mt-1 text-sm text-muted">Search for a movie or TV show above to get started.</p>
      </div>

      <!-- 3.Watchlist grid -->
      <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WatchlistCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @edit="onEdit"
          @delete="onDelete"
        />
      </div>
    </div>

    <!-- Modals -->
    <AddItemModal
      v-model:open="addModalOpen"
      :result="selectedResult"
      @confirm="onConfirmAdd"
    />

    <EditItemModal
      v-model:open="editModalOpen"
      :item="editingItem"
      @confirm="onConfirmEdit"
    />

    <UModal v-model:open="deleteModalOpen" title="Delete Item" description="Are you sure you want to remove this from your watchlist?">
      <template #body>
        <p v-if="deletingItem" class="text-sm">
          This will permanently remove <strong>{{ deletingItem.title }}</strong> from your watchlist.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="deleteModalOpen = false" />
          <UButton color="error" label="Delete" icon="i-lucide-trash-2" @click="onConfirmDelete" />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
