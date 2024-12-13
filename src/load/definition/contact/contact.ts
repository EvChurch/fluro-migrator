import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../../client'
import { GET, PATCH, POST, RockApiError } from '../../client'
import type { CacheObject } from '../../types'

let DefinedTypeId: number
export type RockDefinitionContact = Omit<
  components['schemas']['Rock.Model.DefinedValue'],
  'DefinedTypeId'
> & {
  cache: CacheObject['data']
}

export async function load(value: RockDefinitionContact): Promise<CacheObject> {
  if (DefinedTypeId === undefined) {
    const { data, error } = await GET('/api/DefinedTypes', {
      params: {
        query: {
          $filter: f().eq('Name', 'Connection Status').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data?.[0].Id == null) throw new Error("Couldn't find Family GroupType")

    DefinedTypeId = data?.[0].Id
  }

  const { data, error } = await GET('/api/DefinedValues', {
    params: {
      query: {
        $filter: f()
          .eq('DefinedTypeId', DefinedTypeId)
          .and(
            f()
              .eq('ForeignKey', value.ForeignKey)
              .or(
                f()
                  .eq('Value', value.Value.replaceAll("'", "''"))
                  .eq('ForeignKey', null)
              )
          )
          .toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0].Id != null) {
    const { error } = await PATCH('/api/DefinedValues/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: omit({ ...value, Id: data[0].Id, DefinedTypeId }, [
        'cache'
      ]) as unknown as Record<string, never>
    })
    if (error != null)
      throw new Error(
        (error as { Message: string })?.Message ?? 'Unknown Error'
      )
    return {
      rockId: data[0].Id,
      data: value.cache
    }
  } else {
    const { data, error } = await POST('/api/DefinedValues', {
      body: omit({ ...value, DefinedTypeId }, 'cache')
    })
    if (error != null) throw new RockApiError(error)

    return {
      rockId: data as unknown as number,
      data: value.cache
    }
  }
}
