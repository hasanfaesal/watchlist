<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="text-lg font-semibold">Watchlist</NuxtLink>
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <UButton to="/" variant="ghost" label="Home" />
          <UButton to="/stats" variant="ghost" label="Stats" />

          <template v-if="user">
            <span class="hidden text-sm text-muted md:inline">{{ user.email }}</span>
            <UButton color="neutral" variant="soft" label="Logout" @click="logout" />
          </template>

          <UButton v-else to="/login" color="primary" variant="soft" label="Login" />
        </div>
      </template>
    </UHeader>

    <main class="flex-1">
      <slot />
    </main>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">Watchlist</p>
      </template>
    </UFooter>
  </div>
</template>
