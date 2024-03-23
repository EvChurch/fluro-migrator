import type { FluroTeamMember } from '../../../extract/team/member'
import { extract as extractTeamMember } from '../../../extract/team/member'
import { load as loadTeamMember } from '../../../load/team/member'
import type { RockTeamMember } from '../../../load/team/member'
import { transform as transformTeamMember } from '../../../transform/team/member'
import type { ETLTuple } from '../../types'

export const teamMemberEtl: ETLTuple<FluroTeamMember, RockTeamMember> = [
  'team/member',
  extractTeamMember,
  transformTeamMember,
  loadTeamMember
]
