<script setup lang="ts">
import type { TMDBSearchResult } from '~/types'

const emit = defineEmits<{
  select: [result: TMDBSearchResult]
}>()

const query = ref('')
const debouncedQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

watch(query, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val.trim()
  }, 400)
})

const results = ref<TMDBSearchResult[]>([])
const isSearching = ref(false)

watch(debouncedQuery, async (val) => {
  if (!val) {
    results.value = []
    return
  }
  isSearching.value = true
  try {
    const data = await $fetch<TMDBSearchResult[]>('/api/tmdb/search', {
      query: { query: val }
    })
    results.value = data ?? []
  } catch {
    results.value = []
  } finally {
    isSearching.value = false
  }
})

const showResults = computed(() => debouncedQuery.value.length > 0 && results.value.length > 0)

const selectResult = (result: TMDBSearchResult) => {
  emit('select', result)
  query.value = ''
  debouncedQuery.value = ''
}

const posterUrl = (path: string | null) => {
  return path ? `https://image.tmdb.org/t/p/w92${path}` : null
}

const releaseYear = (date: string | null) => {
  return date ? new Date(date).getFullYear() : null
}
</script>

<template>
  <div class="relative">
    <UInput
      v-model="query"
      icon="i-lucide-search"
      placeholder="Search movies & TV shows..."
      :loading="isSearching"
      class="w-full"
    />

    <div
      v-if="showResults"
      class="bg-elevated ring-default absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg shadow-lg ring"
    >
      <button
        v-for="result in results"
        :key="result.id"
        class="hover:bg-muted flex w-full items-center gap-3 p-3 text-left transition-colors"
        @click="selectResult(result)"
      >
        <img
          v-if="posterUrl(result.poster_path)"
          :src="posterUrl(result.poster_path)!"
          :alt="result.title"
          class="h-14 w-10 shrink-0 rounded object-cover"
        />
        <div v-else class="bg-muted flex h-14 w-10 shrink-0 items-center justify-center rounded">
          <UIcon name="i-lucide-film" class="text-muted size-5" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-default truncate text-sm font-medium">{{ result.title }}</p>
          <div class="mt-0.5 flex items-center gap-2">
            <UBadge
              :label="result.media_type === 'movie' ? 'Movie' : 'Series'"
              :color="result.media_type === 'movie' ? 'primary' : 'info'"
              size="xs"
              variant="subtle"
            />
            <span v-if="releaseYear(result.release_date)" class="text-xs text-muted">
              {{ releaseYear(result.release_date) }}
            </span>
          </div>
        </div>
      </button>
    </div>

    <div
      v-else-if="debouncedQuery.length > 0 && !isSearching && results?.length === 0"
      class="bg-elevated ring-default absolute z-50 mt-1 w-full rounded-lg p-4 text-center text-sm text-muted shadow-lg ring"
    >
      No results found for "{{ debouncedQuery }}"
    </div>
  </div>
</template>
