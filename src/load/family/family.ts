import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

let GroupTypeId: number
export type RockFamily = Omit<
  components['schemas']['Rock.Model.Group'],
  'GroupTypeId'
>

export async function load(value: RockFamily): Promise<CacheObject> {
  if (GroupTypeId === undefined) {
    const { data, error } = await GET('/api/GroupTypes', {
      params: {
        query: {
          $filter: f().eq('Name', 'Family').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data?.[0].Id == null) throw new Error("Couldn't find Family GroupType")

    GroupTypeId = data?.[0].Id
  }
  const { data, error } = await GET('/api/Groups', {
    params: {
      query: {
        $filter: f().eq('ForeignKey', value.ForeignKey).toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0].Id != null) {
    const { error } = await PATCH('/api/Groups/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: { ...value, Id: data[0].Id, GroupTypeId } as unknown as Record<
        string,
        never
      >
    })
    if (error != null) throw new RockApiError(error)
    return { rockId: data[0].Id }
  } else {
    const { data, error } = await POST('/api/Groups', {
      body: {
        ...value,
        GroupTypeId
      }
    })
    if (error != null) throw new RockApiError(error)

    return { rockId: data as unknown as number }
  }
}
