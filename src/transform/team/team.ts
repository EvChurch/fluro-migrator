import { find } from 'lodash'

import type { FluroTeam } from '../../extract/team'
import type { RockTeam } from '../../load/team'
import type { Cache } from '../../load/types'

export function transform(cache: Cache, value: FluroTeam): RockTeam {
  const GroupTypeId =
    value.definition == null || value.definition === ''
      ? undefined
      : find(
          cache['definition/team'],
          (val) => val.data?.definitionName === value.definition
        )?.rockId

  if (
    GroupTypeId == null &&
    value.definition != null &&
    value.definition !== ''
  )
    throw new Error(
      `Couldn't find group type id for team ${value._id} with definition ${value.definition}`
    )
  return {
    GroupTypeId,
    Name: value.title,
    IsSecurityRole: false,
    IsActive: ['active', 'draft'].includes(value.status),
    Order: 0,
    IsPublic: false,
    ForeignKey: value._id,
    IsSystem: false,
    CreatedDateTime: value.created,
    ModifiedDateTime: value.updated
  }
}
