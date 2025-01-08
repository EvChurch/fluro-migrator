import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

export type RockAttendanceOccurence =
  components['schemas']['Rock.Model.AttendanceOccurrence']

async function loadAttendanceOccurrence(
  value: RockAttendanceOccurence
): Promise<CacheObject> {
  const { data, error } = await GET('/api/AttendanceOccurrences', {
    params: {
      query: {
        $filter: f().eq('ForeignKey', value.ForeignKey).toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0].Id != null) {
    // attendance occurrence exists
    const { error } = await PATCH('/api/AttendanceOccurrences/{id}', {
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
    // attendance occurrence does not exist
    const { data, error } = await POST('/api/AttendanceOccurrences', {
      body: value
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })

    return { rockId: data as unknown as number }
  }
}

export async function load(
  value: RockAttendanceOccurence
): Promise<CacheObject> {
  const cacheObject = await loadAttendanceOccurrence(value)

  return cacheObject
}
