import f from 'odata-filter-builder'

import type { components } from '../../client'
import { GET, POST, PUT, RockApiError } from '../../client'
import type { CacheObject } from '../../types'

export type RockTeamMember = components['schemas']['Rock.Model.GroupMember']

export async function load(value: RockTeamMember): Promise<CacheObject> {
  const { data, error } = await GET('/api/GroupMembers', {
    params: {
      query: {
        $filter: f().eq('ForeignKey', value.ForeignKey).toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0].Id != null) {
    const { error } = await PUT('/api/GroupMembers/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: {
        ...value,
        Id: data[0].Id
      }
    })
    if (error != null) {
      throw new RockApiError(error)
    }
    return {
      rockId: data[0].Id,
      data: {
        log: 'group member exists'
      }
    }
  } else {
    const { data, error } = await POST('/api/GroupMembers', {
      body: {
        ...value
      }
    })
    if (error != null) {
      throw new RockApiError(error)
    }
    return {
      rockId: data as unknown as number,
      data: {
        log: 'group member does not exist'
      }
    }
  }
}
