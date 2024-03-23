import type { FluroTeam } from '..'
import type { ProvisionalMember } from '../types'

export interface FluroTeamMember extends ProvisionalMember {
  team: FluroTeam
}
