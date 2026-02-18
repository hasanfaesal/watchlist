// receives an Event instance and returns a response
export default defineEventHandler(async (event) => {
  const { query } = getQuery(event)

// TODO: is there a need for this? It shouldn't be sent to the server if it's empty in the first place?
  if (typeof query !== 'string' || query.trim().length === 0) {
    return []
  }

  const response = await useTmdbFetch<{ results?: Array<Record<string, unknown>> }>(
    '/search/multi',
    { query, include_adult: 'true', page: '1' }
  )

  const results = Array.isArray(response?.results) ? response.results : []

  return results
    .filter((result) => {
      const mediaType = result.media_type
// TODO: double check here
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
