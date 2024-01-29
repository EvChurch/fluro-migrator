import { find } from 'lodash'

import type { FluroTeam } from '../../../extract/team'
import type { RockTeamMember } from '../../../load/team/member'
import type { Cache } from '../../../load/types'

export function transform(cache: Cache, value: FluroTeam): RockTeamMember[] {
  const GroupTypeId =
    value.definition == null || value.definition === ''
      ? undefined
      : find(
          cache['team'],
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

  const GroupId = cache['team'][value._id]?.rockId

  if (GroupId == null)
    throw new Error(`Couldn't find rock group id for team ${value._id}`)

  return value.provisionalMembers.map((member) => {
    const PersonId = cache['contact'][member._id]?.rockId
    if (PersonId == null)
      throw new Error(
        `Couldn't find person id for team ${value._id} member ${member._id}`
      )

    return {
      GroupId,
      GroupTypeId,
      PersonId,
      GroupRoleId,
      Order: 0,
      IsPublic: false,
      ForeignKey: member._id,
      IsSystem: false
    }
  })
}
