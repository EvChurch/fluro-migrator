import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, POST, PUT, RockApiError } from '../client'
import type { CacheObject } from '../types'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

let GroupTypeId: number | undefined
export type RockTeam = Optional<
  components['schemas']['Rock.Model.Group'],
  'GroupTypeId'
>

export async function load(value: RockTeam): Promise<CacheObject> {
  if (GroupTypeId === undefined) {
    const { data, error } = await GET('/api/GroupTypes', {
      params: {
        query: {
          $filter: f().eq('Name', 'General Group').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data?.[0].Id == null)
      throw new Error("Couldn't find General Group GroupType")

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
    const { error } = await PUT('/api/Groups/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: {
        ...value,
        GroupTypeId: value.GroupTypeId ?? GroupTypeId,
        Id: data[0].Id
      }
    })
    if (error != null) {
      throw new RockApiError(error)
    }
    return {
      rockId: data[0].Id,
      data: {
        GroupTypeId: value.GroupTypeId ?? GroupTypeId,
        log: 'group exists'
      }
    }
  } else {
    const { data, error } = await POST('/api/Groups', {
      body: {
        ...value,
        GroupTypeId: value.GroupTypeId ?? GroupTypeId
      }
    })
    if (error != null) {
      throw new RockApiError(error)
    }
    return {
      rockId: data as unknown as number,
      data: {
        GroupTypeId: value.GroupTypeId ?? GroupTypeId,
        log: 'group does not exist'
      }
    }
  }
}
