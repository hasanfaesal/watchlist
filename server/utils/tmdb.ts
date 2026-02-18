import type { H3Event } from 'h3'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/**
 * Fetch from TMDB API with automatic key injection and base URL.
 * Throws 500 if the API key is not configured, 502 if TMDB request fails.
 */
export const useTmdbFetch = async <T>(path: string, query: Record<string, string> = {}): Promise<T> => {
  const config = useRuntimeConfig()
  const apiKey = config.tmdbApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key is not configured'
    })
  }

  try {
    return await $fetch(`${TMDB_BASE_URL}${path}`, {
      query: { language: 'en-US', api_key: apiKey, ...query }
    }) as T
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw createError({
      statusCode: 502,
      statusMessage: `TMDB request failed: ${message}`
    })
  }
}

/**
 * Extract and validate a numeric route parameter.
 * Throws 400 if missing or not a valid number.
 */
export const requireNumericParam = (event: H3Event, name: string): string => {
  const value = getRouterParam(event, name)

  if (!value || Number.isNaN(Number(value))) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid ${name}`
    })
  }

  return value
}
