import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

export type RockTag = components['schemas']['Rock.Model.Tag']

export async function load(value: RockTag): Promise<CacheObject> {
  const { data } = await GET(`/api/Tags`, {
    params: {
      query: {
        $filter: f().eq('ForeignKey', value.ForeignKey).toString(),
        $top: 1
      }
    }
  })

  const id = data?.[0]?.Id

  if (id != null) {
    // tag exists
    const body = value
    const { error } = await PATCH(`/api/Tags/{id}`, {
      params: { path: { id } },
      body: body as unknown as Record<string, never>
    })
    if (error != null)
      throw new RockApiError(error, {
        cause: { id, body }
      })

    return { rockId: id }
  } else {
    // tag does not exist
    const { data, error } = await POST(`/api/Tags`, {
      body: value
    })
    if (error != null)
      throw new RockApiError(error, { cause: { id, body: value } })

    return { rockId: data as unknown as number }
  }
}
