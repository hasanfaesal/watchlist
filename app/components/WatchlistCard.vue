<script setup lang="ts">
import type { WatchlistItem } from '~/types'

defineProps<{
  item: WatchlistItem
}>()

const emit = defineEmits<{
  edit: [item: WatchlistItem]
  delete: [item: WatchlistItem]
}>()

const posterUrl = (path: string | null) => {
  return path ? `https://image.tmdb.org/t/p/w154${path}` : null
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UCard>
    <div class="flex gap-4">
      <img
        v-if="posterUrl(item.poster_path)"
        :src="posterUrl(item.poster_path)!"
        :alt="item.title"
        class="h-28 w-20 shrink-0 rounded object-cover"
      />
      <div v-else class="bg-muted flex h-28 w-20 shrink-0 items-center justify-center rounded">
        <UIcon name="i-lucide-film" class="text-muted size-8" />
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="text-default truncate font-semibold">{{ item.title }}</h3>

        <div class="mt-1 flex items-center gap-2">
          <UBadge
            :label="item.type === 'movie' ? 'Movie' : 'Series'"
            :color="item.type === 'movie' ? 'primary' : 'info'"
            size="xs"
            variant="subtle"
          />
          <span v-if="item.year" class="text-xs text-muted">{{ item.year }}</span>
        </div>

        <p class="mt-2 text-sm text-muted">
          Watched {{ formatDate(item.watched_at) }}
        </p>

        <div class="mt-3 flex gap-2">
          <UButton
            icon="i-lucide-pencil"
            size="xs"
            color="neutral"
            variant="soft"
            label="Edit"
            @click="emit('edit', item)"
          />
          <UButton
            icon="i-lucide-trash-2"
            size="xs"
            color="error"
            variant="soft"
            label="Delete"
            @click="emit('delete', item)"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
