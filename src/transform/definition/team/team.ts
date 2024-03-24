import type { FluroDefinitionTeam } from '../../../extract/definition/team'
import type { RockDefinitionTeam } from '../../../load/definition/team'
import type { Cache } from '../../../load/types'

function transformTitle(title: string): string {
  switch (title) {
    case 'Service Team':
      return 'Serving Team'
    default:
      return title
  }
}
export function transform(
  _cache: Cache,
  value: FluroDefinitionTeam
): RockDefinitionTeam {
  const GroupTypeRoles: RockDefinitionTeam['GroupTypeRoles'] =
    value.data?.defaultPositions?.map((position) => ({
      IsSystem: false,
      Name: position.title,
      IsLeader: position.reporter
    })) ?? []

  if (GroupTypeRoles.find(({ Name }) => Name == 'Member') == null) {
    GroupTypeRoles.push({
      IsSystem: false,
      Name: 'Member',
      IsLeader: false
    })
  }

  return {
    IsSystem: false,
    ForeignKey: value._id,
    Name: transformTitle(value.title),
    Description: value.firstLine,
    CreatedDateTime: value.created,
    ModifiedDateTime: value.updated,
    GroupTerm: 'Group',
    GroupMemberTerm: 'Member',
    IsCapacityRequired: false,
    ShowAdministrator: true,
    Order: 0,
    cache: {
      definitionName: value.definitionName
    },
    GroupTypeRoles
  }
}
