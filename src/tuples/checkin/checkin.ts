import { extract as extractCheckin } from '../../extract/checkin'
import type { FluroCheckin } from '../../extract/checkin'
import { load as loadAttendance } from '../../load/attendance'
import type { RockAttendance } from '../../load/attendance'
import { remove as removeAttendance } from '../../remove/attendance'
import { transform as transformCheckin } from '../../transform/checkin'
import type { ETLTuple } from '../types'

export const checkinEtl: ETLTuple<FluroCheckin, RockAttendance> = [
  'checkin',
  extractCheckin,
  transformCheckin,
  loadAttendance,
  removeAttendance
]
