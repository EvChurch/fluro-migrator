import type { FluroCampus } from '../../extract/campus'
import { extract as extractCampus } from '../../extract/campus'
import type { RockCampus } from '../../load/campus'
import { load as loadCampus } from '../../load/campus'
import { transform as transformCampus } from '../../transform/campus'
import type { ETLTuple } from '../types'

export const campusEtl: ETLTuple<FluroCampus, RockCampus> = [
  'campus',
  extractCampus,
  transformCampus,
  loadCampus
]
