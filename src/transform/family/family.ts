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
    CampusId
  }
}
