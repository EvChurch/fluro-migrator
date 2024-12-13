import f from 'odata-filter-builder'

import type { components } from '../../client'
import { GET, PATCH, POST, RockApiError } from '../../client'
import type { CacheObject } from '../../types'

export type RockDefinitionTeam =
  components['schemas']['Rock.Model.GroupType'] & {
    cache: CacheObject['data']
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

  if (data != null && data.length > 0 && data[0].Id != null) {
    await PATCH('/api/GroupTypes/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: value as unknown as Record<string, never>
    })
    return { rockId: data[0].Id, data: value.cache }
  } else {
    const { data, error } = await POST('/api/GroupTypes', {
      body: value
    })
    if (error != null) throw new RockApiError(error)

    return { rockId: data as unknown as number, data: value.cache }
  }
}
