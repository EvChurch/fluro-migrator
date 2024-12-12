import type { FluroFamily } from '../../extract/family'
import type { RockFamily } from '../../load/family'
import type { Cache } from '../../load/types'

export function transform(_cache: Cache, value: FluroFamily): RockFamily {
  return {
    IsSystem: false,
    IsSecurityRole: false,
    IsActive: true,
    ForeignKey: value._id,
    Name: value.title,
    Order: 0,
    IsPublic: false
  }
}
