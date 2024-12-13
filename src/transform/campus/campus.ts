import type { FluroCampus } from '../../extract/campus'
import type { RockCampus } from '../../load/campus'
import type { Cache } from '../../load/types'

/**
 * transforms a fluro api realm object to a rock campus object
 */
export function transform(_cache: Cache, value: FluroCampus): RockCampus {
  return {
    IsSystem: false,
    IsActive: true,
    Name: value.title,
    ForeignKey: value._id
  }
}
