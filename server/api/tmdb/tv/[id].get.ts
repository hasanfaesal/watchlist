export default defineEventHandler(async (event) => {
  const id = requireNumericParam(event, 'id')

  const response = await useTmdbFetch<{
    id: number
    name: string
    number_of_seasons: number
    number_of_episodes: number
    seasons?: Array<{
      id: number
      season_number: number
      name: string
      episode_count: number
      air_date: string | null
    }>
  }>(`/tv/${id}`)

  return {
    id: response.id,
    title: response.name,
    number_of_seasons: response.number_of_seasons,
    number_of_episodes: response.number_of_episodes,
    seasons: (response.seasons ?? [])
      .filter(season => season.season_number >= 1)
      .map(season => ({
        id: season.id,
        season_number: season.season_number,
        name: season.name,
        episode_count: season.episode_count,
        air_date: season.air_date
      }))
  }
})
