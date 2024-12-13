import f from 'odata-filter-builder'

import type { components } from '../../client'
import { GET, PATCH, POST, RockApiError } from '../../client'
import type { CacheObject } from '../../types'

let DefinedTypeId: number
export type RockMaritalStatus = Omit<
  components['schemas']['Rock.Model.DefinedValue'],
  'DefinedTypeId'
>

export async function load(value: RockMaritalStatus): Promise<CacheObject> {
  if (DefinedTypeId === undefined) {
    const { data, error } = await GET('/api/DefinedTypes', {
      params: {
        query: {
          $filter: f().eq('Name', 'Marital Status').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data?.[0].Id == null)
      throw new Error("Couldn't find Marital Status DefinedType")

    DefinedTypeId = data?.[0].Id
  }

  const { data, error } = await GET('/api/DefinedValues', {
    params: {
      query: {
        $filter: f()
          .eq('DefinedTypeId', DefinedTypeId)
          .eq('Value', value.Value)
          .toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0].Id != null) {
    // maritalStatus exists
    const { error } = await PATCH('/api/DefinedValues/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: { ...value, DefinedTypeId } as unknown as Record<string, never>
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })
    return { rockId: data[0].Id }
  } else {
    // maritalStatus does not exist
    const { data, error } = await POST('/api/DefinedValues', {
      body: { ...value, DefinedTypeId }
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })

    return { rockId: data as unknown as number }
  }
}
