<script setup lang="ts">
import type { TMDBSearchResult } from '~/types'

const props = defineProps<{
  result: TMDBSearchResult | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: [watchedAt: string]
}>()

const watchedAt = ref<string>(new Date().toISOString().split('T')[0]!)

watch(open, (isOpen) => {
  if (isOpen) {
    watchedAt.value = new Date().toISOString().split('T')[0]!
  }
})

const posterUrl = computed(() => {
  return props.result?.poster_path
    ? `https://image.tmdb.org/t/p/w154${props.result.poster_path}`
    : null
})

const releaseYear = computed(() => {
  return props.result?.release_date
    ? new Date(props.result.release_date).getFullYear()
    : null
})

const confirm = () => {
  if (watchedAt.value) {
    emit('confirm', watchedAt.value)
  }
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="Add to Watchlist" description="Set the date you watched this title.">
    <template #body>
      <div v-if="result" class="space-y-4">
        <div class="flex items-center gap-3">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="result.title"
            class="h-20 w-14 rounded object-cover"
          />
          <div>
            <p class="font-semibold">{{ result.title }}</p>
            <div class="mt-1 flex items-center gap-2">
              <UBadge
                :label="result.media_type === 'movie' ? 'Movie' : 'Series'"
                :color="result.media_type === 'movie' ? 'primary' : 'info'"
                size="xs"
                variant="subtle"
              />
              <span v-if="releaseYear" class="text-xs text-muted">{{ releaseYear }}</span>
            </div>
          </div>
        </div>

        <UFormField label="Watch date" name="watched_at" required>
          <UInput v-model="watchedAt" type="date" class="w-full" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" label="Cancel" @click="open = false" />
        <UButton label="Add" icon="i-lucide-plus" @click="confirm" />
      </div>
    </template>
  </UModal>
</template>
