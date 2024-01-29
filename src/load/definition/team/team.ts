import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../../client'
import { GET, POST, PUT, RockApiError } from '../../client'
import type { CacheObject } from '../../types'

export type RockDefinitionTeam =
  components['schemas']['Rock.Model.GroupType'] & {
    cache: CacheObject['data']
    GroupTypeRoles: components['schemas']['Rock.Model.GroupTypeRole'][]
  }

export async function load(value: RockDefinitionTeam): Promise<CacheObject> {
  const { data, error } = await GET('/api/GroupTypes', {
    params: {
      query: {
        $filter: f()
          .eq('ForeignKey', value.ForeignKey)
          .or(
            f()
              .eq('Name', value.Name.replaceAll("'", "''"))
              .eq('ForeignKey', null)
          )
          .toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  let rockId: number
  if (data != null && data.length > 0 && data[0].Id != null) {
    await PUT('/api/GroupTypes/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: omit(value, ['cache', 'GroupTypeRoles'])
    })
    rockId = data[0].Id
  } else {
    const { data, error } = await POST('/api/GroupTypes', {
      body: omit(value, ['cache', 'GroupTypeRoles'])
    })
    if (error != null) throw new RockApiError(error)

    rockId = data as unknown as number
  }

  return { rockId, data: value.cache }
}
