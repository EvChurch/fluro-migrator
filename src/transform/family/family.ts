import type { FluroFamily } from '../../extract/family'
import type { RockFamily } from '../../load/family'
import type { Cache } from '../../load/types'

import { countries } from './countries/countries'

export function transform(cache: Cache, value: FluroFamily): RockFamily {
  const realmId = value.realms.find(
    (realm) => cache['campus'][realm._id] != null
  )?._id

  const CampusId = realmId != null ? cache['campus'][realmId].rockId : undefined

  return {
    IsSystem: false,
    IsSecurityRole: false,
    IsActive: true,
    ForeignKey: value._id,
    Name: value.title,
    Order: 0,
    IsPublic: false,
    CampusId,
    Address:
      value.address != null ? transformAddress(value.address) : undefined,
    PostalAddress: value.postalAddress
      ? transformAddress(value.postalAddress)
      : undefined
  }
}

function transformAddress(
  address: FluroFamily['address']
): RockFamily['Address'] | undefined {
  if (
    address.addressLine1 === '' &&
    address.addressLine2 === '' &&
    address.suburb === '' &&
    address.state === '' &&
    address.country === '' &&
    address.postalCode === ''
  )
    return undefined

  return {
    Street1: address.addressLine1,
    Street2: address.addressLine2 ?? address.suburb,
    City: address.state,
    PostalCode: address.postalCode ?? undefined,
    Country: transformCountry(address.country ?? 'New Zealand', address)
  }
}

function transformCountry(
  country: string,
  address: FluroFamily['address']
): string {
  if (countries[country] != null) return countries[country]
  switch (country) {
    case '':
      return 'NZ'
    case 'Hong Kong SAR China':
      return 'HK'
    default:
      throw new Error(`Couldn't find country code for "${country}"`, {
        cause: address
      })
  }
}
