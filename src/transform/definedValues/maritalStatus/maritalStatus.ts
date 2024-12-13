import type { FluroMaritalStatus } from '../../../extract/definedValues/maritalStatus'
import type { RockMaritalStatus } from '../../../load/definedValues/maritalStatus/maritalStatus'
import type { Cache } from '../../../load/types'

/**
 * transforms a fluro api marital status object to a rock defined values object
 */
export function transform(
  _cache: Cache,
  value: FluroMaritalStatus
): RockMaritalStatus {
  return {
    IsSystem: false,
    IsActive: true,
    Value: value.value,
    ForeignKey: value._id,
    Order: value.order,
    Description: `Used when an individual is ${value.value.toLowerCase()}.`
  }
}
