<script setup lang="ts">
import type { WatchlistItem } from '~/types'

const props = defineProps<{
  item: WatchlistItem | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: [id: string, watchedAt: string]
}>()

const watchedAt = ref('')

watch(open, (isOpen) => {
  if (isOpen && props.item) {
    watchedAt.value = props.item.watched_at
  }
})

const confirm = () => {
  if (props.item) {
    emit('confirm', props.item.id, watchedAt.value)
  }
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="Edit Watch Date" description="Update when you watched this title.">
    <template #body>
      <div v-if="item" class="space-y-4">
        <p class="font-semibold">{{ item.title }}</p>

        <UFormField label="Watch date" name="watched_at" required>
          <UInput v-model="watchedAt" type="date" class="w-full" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" label="Cancel" @click="open = false" />
        <UButton label="Save" icon="i-lucide-check" @click="confirm" />
      </div>
    </template>
  </UModal>
</template>
