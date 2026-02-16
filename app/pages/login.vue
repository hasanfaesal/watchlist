<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const toast = useToast()

// reactive states
const email = ref('')
const password = ref('')
const isSignUpMode = ref(false)
const isSubmitting = ref(false)
const isGoogleOAuthLoading = ref(false)

// computed properties
const redirectTo = computed(() => {
  const value = route.query.redirectTo
  return typeof value === 'string' && value.length > 0 ? value : '/'
})

const config = useRuntimeConfig()

// TODO: is this the best implementation for this?
const isGoogleOAuthEnabled = computed(() => config.public.enableGoogleOauth === 'true')
const hasOAuthProvider = computed(() => isGoogleOAuthEnabled.value)

// watch for user changes and redirect if authenticated
watch(
  user,
  async (currentUser) => {
    if (currentUser) {
      await navigateTo(redirectTo.value)
    }
  },
  { immediate: true }
)

// authentication methods
const submitCredentials = async () => {
  isSubmitting.value = true

  const authMethod = isSignUpMode.value
    ? supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`
        }
      })
    : supabase.auth.signInWithPassword({ email: email.value, password: password.value })

  const { error } = await authMethod

  isSubmitting.value = false

  if (error) {
    toast.add({
      title: isSignUpMode.value ? 'Sign up failed' : 'Login failed',
      description: error.message,
      color: 'error'
    })
    return
  }

  if (isSignUpMode.value) {
    toast.add({
      title: 'Account created',
      description: 'Check your email to confirm your account if required.',
      color: 'success'
    })
    return
  }

  await navigateTo(redirectTo.value)
}

const signInWithGoogle = async () => {
  isGoogleOAuthLoading.value = true

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/confirm`
    }
  })

  isGoogleOAuthLoading.value = false

  if (error) {
    toast.add({
      title: 'Google login failed',
      description: error.message,
      color: 'error'
    })
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">{{ isSignUpMode ? 'Create account' : 'Welcome back' }}</h1>
        <p class="text-sm text-muted">{{ isSignUpMode ? 'Sign up to start tracking your watchlist.' : 'Sign in to access your watchlist.' }}</p>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="submitCredentials">
      <UFormField label="Email" name="email" required>
        <UInput v-model="email" type="email" autocomplete="email" placeholder="you@example.com" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="password"
          type="password"
          :autocomplete="isSignUpMode ? 'new-password' : 'current-password'"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="isSubmitting">
        {{ isSignUpMode ? 'Sign Up' : 'Login' }}
      </UButton>
    </form>

    <div v-if="hasOAuthProvider" class="mt-6 space-y-3">
      <USeparator label="Or continue with" />

      <div class="grid grid-cols-1 gap-2">
        <UButton
          v-if="isGoogleOAuthEnabled"
          color="neutral"
          variant="soft"
          block
          :loading="isGoogleOAuthLoading"
          @click="signInWithGoogle"
        >
          Google
        </UButton>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between gap-2 text-sm">
        <span class="text-muted">
          {{ isSignUpMode ? 'Already have an account?' : 'Need an account?' }}
        </span>
        <UButton color="neutral" variant="link" @click="isSignUpMode = !isSignUpMode">
          {{ isSignUpMode ? 'Login' : 'Sign Up' }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>