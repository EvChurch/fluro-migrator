import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

export type RockAttendance = components['schemas']['Rock.Model.Attendance']

async function loadAttendance(value: RockAttendance): Promise<CacheObject> {
  const { data, error } = await GET('/api/Attendances', {
    params: {
      query: {
        $filter: f()
          .eq('ForeignKey', value.ForeignKey)
          .or(
            f()
              .eq('OccurrenceId', value.OccurrenceId)
              .eq('PersonAliasId', value.PersonAliasId)
          )
          .toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0].Id != null) {
    // attendance exists
    const { error } = await PATCH('/api/Attendances/{id}', {
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
    // attendance does not exist
    const { data, error } = await POST('/api/Attendances', {
      body: value
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })

    return { rockId: data as unknown as number }
  }
}

export async function load(value: RockAttendance): Promise<CacheObject> {
  const cacheObject = await loadAttendance(value)

  return cacheObject
}
