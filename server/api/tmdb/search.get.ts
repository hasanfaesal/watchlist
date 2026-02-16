// receives an Event instance and returns a response
export default defineEventHandler(async (event) => {
  
  // access runtime config variables (composable)
  const config = useRuntimeConfig()
  
  const tmdbApiKey = config.tmdbApiKey

  if (!tmdbApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key is not configured'
    })
  }

  const { query } = getQuery(event)

// TODO: is there a need for this? It shouldn't be sent to the server if it's empty in the first place?
  if (typeof query !== 'string' || query.trim().length === 0) {
    return []
  }

  const searchParams = new URLSearchParams({
    query,
    include_adult: 'true',
    language: 'en-US',
    page: '1',
    api_key: tmdbApiKey
  })

  const response = await $fetch<{ results?: Array<Record<string, unknown>> }>(
    `https://api.themoviedb.org/3/search/multi?${searchParams.toString()}`
  )

// Typescript supremacy -> defensive programming
  const results = Array.isArray(response?.results) ? response.results : []

  return results
    .filter((result) => {
      const mediaType = result.media_type
// TODO: isn't there a way to only query for movies and tv shows in the first place? Or is it just easier to filter them out here?
      return mediaType === 'movie' || mediaType === 'tv'
    })
    .map((result) => ({
      id: result.id,
// Nullish Coalescing Operator (??)
      title: result.title ?? result.name ?? '',
      media_type: result.media_type,
// Handling missing images
      poster_path: result.poster_path ?? null,
      release_date: result.release_date ?? result.first_air_date ?? null
    }))
})
