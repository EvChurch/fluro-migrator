import type { FluroTeam } from '../../../extract/team'
import { extract as extractTeam } from '../../../extract/team'
import { load as loadTeamMember } from '../../../load/team/member'
import type { RockTeamMember } from '../../../load/team/member'
import { transform as transformTeamMember } from '../../../transform/team/member'
import type { ETLTuple } from '../../types'

export const teamMemberEtl: ETLTuple<FluroTeam, RockTeamMember> = [
  'team/member',
  extractTeam,
  transformTeamMember,
  loadTeamMember
]
