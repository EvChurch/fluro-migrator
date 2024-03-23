import { find } from 'lodash'

import type { FluroTeamMember } from '../../../extract/team/member'
import type { RockTeamMember } from '../../../load/team/member'
import type { Cache } from '../../../load/types'

export function transform(
  cache: Cache,
  value: FluroTeamMember
): RockTeamMember {
  const GroupTypeId =
    value.team.definition == null || value.team.definition === ''
      ? undefined
      : find(
          cache['team'],
          (val) => val.data?.definitionName === value.team.definition
        )?.rockId

  if (GroupTypeId == null)
    throw new Error(
      `Couldn't find group type id for team ${value.team._id} with definition "${value.team.definition}"`
    )

  const GroupId = cache['team'][value.team._id]?.rockId

  if (GroupId == null)
    throw new Error(`Couldn't find rock group id for team ${value.team._id}`)

  const PersonId = cache['contact'][value._id]?.rockId
  if (PersonId == null)
    throw new Error(
      `Couldn't find person id for team ${value.team._id} member ${value._id}`
    )

  return {
    GroupId,
    GroupTypeId,
    PersonId,
    GroupRoleId: 0,
    GroupMemberStatus: 'Active',
    ForeignKey: `${value._id}-${value.team._id}`,
    IsSystem: false
  }
}