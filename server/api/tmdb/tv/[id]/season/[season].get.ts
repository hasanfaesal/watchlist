export default defineEventHandler(async (event) => {
  const id = requireNumericParam(event, 'id')
  const season = requireNumericParam(event, 'season')

  const response = await useTmdbFetch<{
    id: string
    season_number: number
    episodes?: Array<{
      id: number
      episode_number: number
      name: string
      runtime: number | null
      air_date: string | null
    }>
  }>(`/tv/${id}/season/${season}`)

  return {
    season_number: response.season_number,
    episodes: (response.episodes ?? []).map(episode => ({
      id: episode.id,
      episode_number: episode.episode_number,
      name: episode.name,
      runtime: episode.runtime ?? null,
      air_date: episode.air_date
    }))
  }
})
