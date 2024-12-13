import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

export type RockCampus = components['schemas']['Rock.Model.Campus']

export async function load(value: RockCampus): Promise<CacheObject> {
  const { data, error } = await GET('/api/Campuses', {
    params: {
      query: {
        $filter: f()
          .eq('ForeignKey', value.ForeignKey)
          .or(f().eq('Name', value.Name).eq('ForeignKey', null))
          .toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0] != null) {
    // campus exists
    const { error } = await PATCH('/api/Campuses/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: value as unknown as Record<string, never>
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })
    return { rockId: data[0].Id }
  } else {
    // campus does not exist
    const { data, error } = await POST('/api/Campuses', {
      body: value
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })

    return { rockId: data as unknown as number }
  }
}
