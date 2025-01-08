import { extract as extractService } from '../../extract/service'
import type { FluroService } from '../../extract/service'
import { load as loadAttendanceOccurrence } from '../../load/attendanceOccurence'
import type { RockAttendanceOccurence } from '../../load/attendanceOccurence'
import { transform as transformService } from '../../transform/service'
import type { ETLTuple } from '../types'

export const serviceEtl: ETLTuple<FluroService, RockAttendanceOccurence> = [
  'service',
  extractService,
  transformService,
  loadAttendanceOccurrence
]
