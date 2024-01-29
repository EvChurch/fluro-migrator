import type { FluroDemographicDetails } from '../../../extract/detailSheets/demographicDetails'
import type { RockDemographicDetails } from '../../../load/detailSheets/demographicDetails'
import type { Cache } from '../../../load/types'

export function transform(
  _cache: Cache,
  value: FluroDemographicDetails
): RockDemographicDetails {
  return {
    IsSystem: false,
    Order: 0,
    Name: value.title,
    Description: value.firstLine,
    CreatedDateTime: value.created,
    ModifiedDateTime: value.updated,
    CreatedByPersonAliasId: 10,
    ModifiedByPersonAliasId: 10,
    ModifiedAuditValuesAlreadyUpdated: false,
    ForeignKey: value._id
  }
}
