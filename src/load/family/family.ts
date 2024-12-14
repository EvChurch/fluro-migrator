import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

import { load as loadAddress } from './address'

let GroupTypeId: number

export type RockFamilyAddress = components['schemas']['Rock.Model.Location']

export type RockFamily = Omit<
  components['schemas']['Rock.Model.Group'],
  'GroupTypeId'
> & {
  ForeignKey: string
  Address: RockFamilyAddress
  PostalAddress?: RockFamilyAddress
}

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
    // family already exists
    const { error } = await PATCH('/api/Groups/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: {
        ...omit(value, ['Address', 'PostalAddress']),
        GroupTypeId
      } as unknown as Record<string, never>
    })
    if (error != null) throw new RockApiError(error)

    await loadAddress(
      value.Address,
      value.ForeignKey,
      data[0].Id,
      0,
      value.PostalAddress == null
    )

    if (value.PostalAddress != null)
      await loadAddress(
        value.PostalAddress,
        value.ForeignKey,
        data[0].Id,
        1,
        true
      )
    return { rockId: data[0].Id }
  } else {
    // family doesn't exist
    const { data, error } = await POST('/api/Groups', {
      body: {
        ...omit(value, ['Address', 'PostalAddress']),
        GroupTypeId
      }
    })
    if (error != null) throw new RockApiError(error)

    await loadAddress(
      value.Address,
      value.ForeignKey,
      data as unknown as number,
      0,
      value.PostalAddress == null
    )

    if (value.PostalAddress != null)
      await loadAddress(
        value.PostalAddress,
        value.ForeignKey,
        data as unknown as number,
        1,
        true
      )

    return { rockId: data as unknown as number }
  }
}
