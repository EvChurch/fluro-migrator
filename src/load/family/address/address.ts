import f from 'odata-filter-builder'

import { GET, PATCH, POST, RockApiError } from '../../client'
import type { RockFamilyAddress } from '../family'

let GroupLocationTypeValueId: number

export async function load(
  address: RockFamilyAddress,
  fluroFamilyId: string,
  rockFamilyId: number,
  Order: number,
  IsMailingLocation: boolean
): Promise<void> {
  if (rockFamilyId == null) throw new Error('Family Id is required')
  if (fluroFamilyId == null) throw new Error('Family ForeignKey is required')

  // get number type value id - add number in as "mobile" by default
  if (GroupLocationTypeValueId === undefined) {
    const { data, error } = await GET('/api/DefinedValues', {
      params: {
        query: {
          $filter: f()
            .eq('Description', 'Address where the family lives.')
            .toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data?.[0].Id == null)
      throw new Error("Couldn't find Number Type Id in Defined Values")

    GroupLocationTypeValueId = data?.[0].Id
  }

  // load location
  const locationId = await loadLocation(
    address,
    `${fluroFamilyId}_location_${Order}`
  )

  // load groupLocation
  return await loadGroupLocation(
    locationId,
    rockFamilyId,
    Order,
    IsMailingLocation
  )
}

async function loadGroupLocation(
  LocationId: number,
  GroupId: number,
  Order: number,
  IsMailingLocation: boolean
): Promise<void> {
  // check if current group location already exists
  const { data: groupLocations, error } = await GET('/api/GroupLocations', {
    params: {
      query: {
        $filter: f()
          .eq('GroupId', GroupId)
          .eq('LocationId', LocationId)
          .toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (groupLocations[0] == null || groupLocations[0]?.Id == null) {
    // group location doesn't exist
    const { error } = await POST('/api/GroupLocations', {
      body: {
        GroupId,
        LocationId,
        GroupLocationTypeValueId,
        Order,
        IsMailingLocation
      }
    })
    if (error != null) throw new RockApiError(error)
  } else {
    // group location exists
    const { error } = await PATCH('/api/GroupLocations/{id}', {
      params: { path: { id: groupLocations[0].Id } },
      body: {
        GroupId,
        LocationId,
        GroupLocationTypeValueId,
        Order,
        IsMailingLocation
      } as unknown as Record<string, never>
    })
    if (error != null) throw new RockApiError(error)
  }
}

async function loadLocation(
  address: RockFamilyAddress,
  ForeignKey: string
): Promise<number> {
  // check if current location already exists
  const { data: locations, error } = await GET('/api/Locations', {
    params: {
      query: {
        $filter: f().eq('ForeignKey', ForeignKey).toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (locations[0] != null && locations[0]?.Id != null) {
    // location exists
    const { error } = await PATCH('/api/Locations/{id}', {
      params: { path: { id: locations[0].Id } },
      body: {
        ...address,
        ForeignKey: ForeignKey
      } as unknown as Record<string, never>
    })
    if (error != null) throw new RockApiError(error)
    return locations[0].Id
  } else {
    // location doesn't exist
    const { error, data } = await POST('/api/Locations', {
      body: {
        ...address,
        ForeignKey: ForeignKey
      }
    })
    if (error != null) throw new RockApiError(error)
    return data as unknown as number
  }
}
