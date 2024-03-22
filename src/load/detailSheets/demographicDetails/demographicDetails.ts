import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../../client'
import { GET, POST, PUT, RockApiError } from '../../client'
import type { CacheObject } from '../../types'

let EntityTypeIdAttribute: number
let EntityTypeIdPerson: number
export type RockDemographicDetails = Omit<
  components['schemas']['Rock.Model.Category'],
  'EntityTypeId'
>
export async function load(
  value: RockDemographicDetails
): Promise<CacheObject> {
  if (EntityTypeIdAttribute === undefined) {
    const { data, error } = await GET('/api/EntityTypes', {
      params: {
        query: {
          $filter: f().eq('Name', 'Rock.Model.Attribute').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data[0].Id == null)
      throw new Error(
        "Couldn't find EntityTypeId for Rock.Model.Attribute in Demographic Details Sheet"
      )

    EntityTypeIdAttribute = data?.[0].Id
  }

  const { data, error } = await GET('/api/Categories', {
    params: {
      query: {
        $filter: f().eq('Name', 'Demographics Details').toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)
  if (data != null && data.length > 0 && data[0].Id != null) {
    // update the record
    const { error } = await PUT('/api/Categories/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: omit(
        { ...value, Id: data[0].Id, EntityTypeId: EntityTypeIdAttribute },
        'cache'
      )
    })
    if (error != null)
      throw new Error(
        (error as { Message: string })?.Message ?? 'Unknown Error'
      )
    return {
      rockId: data[0].Id,
      data: {
        log: `${value.ForeignKey} already exsits, updated entry`
      }
    }
  } else {
    // get id for entity type person
    if (EntityTypeIdPerson === undefined) {
      const { data, error } = await GET('/api/EntityTypes', {
        params: {
          query: {
            $filter: f().eq('Name', 'Rock.Model.Person').toString(),
            $select: 'Id'
          }
        }
      })
      if (error != null) throw new RockApiError(error)

      if (data[0].Id == null)
        throw new Error(
          "Couldn't find EntityTypeId for Rock.Model.Person in Demographic Details Sheet"
        )

      EntityTypeIdPerson = data?.[0].Id
    }

    // create a new record
    const { data, error } = await POST('/api/Categories', {
      body: omit(
        {
          ...value,
          EntityTypeId: EntityTypeIdAttribute,
          EntityTypeQualifierColumn: 'EntityTypeId',
          EntityTypeQualifierValue: EntityTypeIdPerson.toString()
        },
        'cache'
      )
    })
    if (error != null) throw new RockApiError(error)

    return {
      rockId: data as unknown as number,
      data: {
        log: `${value.Name} created,`
      }
    }
  }
}
