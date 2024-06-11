import { cleanup as cleanupTeam } from '../../cleanup/team'
import type { FluroTeam } from '../../extract/team'
import { extract as extractTeam } from '../../extract/team'
import type { RockTeam } from '../../load/team'
import { load as loadTeam } from '../../load/team'
import { transform as transformTeam } from '../../transform/team'
import type { ETLTuple } from '../types'

export const teamEtl: ETLTuple<FluroTeam, RockTeam> = [
  'team',
  extractTeam,
  transformTeam,
  loadTeam,
  cleanupTeam
]
