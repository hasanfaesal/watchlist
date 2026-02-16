<script setup lang="ts">
useSeoMeta({
  title: 'Watchlist',
  description: 'Track the movies and TV shows you\'ve watched.'
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <UApp>
      <NuxtLoadingIndicator /><NuxtLayout><NuxtPage /></NuxtLayout>
    </UApp>
  </div>
</template>
