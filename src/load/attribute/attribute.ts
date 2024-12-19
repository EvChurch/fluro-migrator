import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

export type RockAttribute = components['schemas']['Rock.Model.Attribute']

export async function load(value: RockAttribute): Promise<CacheObject> {
  const { data } = await GET(`/api/Attributes`, {
    params: {
      query: {
        $filter: f()
          .eq('Key', value.Key)
          .eq('EntityTypeId', value.EntityTypeId)
          .toString(),
        $top: 1
      }
    }
  })

  const id = data?.[0]?.Id

  if (id != null) {
    // attribute exists
    const body = omit(value, 'Categories')
    const { error } = await PATCH(`/api/Attributes/{id}`, {
      params: { path: { id } },
      body: body as unknown as Record<string, never>
    })
    if (error != null)
      throw new RockApiError(error, {
        cause: { id, body }
      })

    return { rockId: id }
  } else {
    // attribute does not exist
    const { data, error } = await POST(`/api/Attributes`, {
      body: value
    })
    if (error != null)
      throw new RockApiError(error, { cause: { id, body: value } })

    return { rockId: data as unknown as number }
  }
}
