<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const user = useSupabaseUser()
const route = useRoute()

const redirectTo = computed(() => {
  const value = route.query.redirectTo
  return typeof value === 'string' && value.length > 0 ? value : '/'
})

watchEffect(async () => {
  if (user.value) {
    await navigateTo(redirectTo.value)
  }
})
</script>

<template>
  <UCard>
    <div class="space-y-2 text-center">
      <h1 class="text-xl font-semibold">Confirming your sign-in</h1>
      <p class="text-sm text-muted">You will be redirected automatically.</p>
      <div class="pt-2">
        <UButton loading color="neutral" variant="soft">Please wait</UButton>
      </div>
    </div>
  </UCard>
</template>