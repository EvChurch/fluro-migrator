import type { FluroFamily } from '../../extract/family'
import type { RockFamily } from '../../load/family'
import type { Cache } from '../../load/types'

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
    Address: transformAddress(value.address),
    PostalAddress: value.postalAddress
      ? transformAddress(value.postalAddress)
      : undefined
  }
}

function transformAddress(
  address: FluroFamily['address']
): RockFamily['Address'] {
  return {
    Street1: address.addressLine1,
    Street2: address.addressLine2 ?? address.suburb,
    City: address.state,
    PostalCode: address.postalCode ?? undefined,
    Country: transformCountry(address.country ?? 'New Zealand')
  }
}

function transformCountry(country: string): string {
  switch (country) {
    case 'Australia':
      return 'AU'
    case 'New Zealand':
      return 'NZ'
    default:
      throw new Error("Couldn't find country code for " + country)
  }
}
