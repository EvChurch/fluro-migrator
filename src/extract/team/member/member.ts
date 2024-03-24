import type { FluroTeam } from '..'
import { extractFromFluro } from '../../lib'

import type { FluroTeamMember } from '.'

export const extract = extractFromFluro<FluroTeamMember, FluroTeam>({
  contentType: 'team',
  filterBody: {
    allDefinitions: true,
    includeArchived: true
  },
  multipleBody: {
    appendAssignments: true,
    appendContactDetail: true
  },
  postProcessor(data) {
    return data.flatMap((team) => {
      return team.provisionalMembers.map((member) => ({
        ...member,
        team
      }))
    })
  }
})
