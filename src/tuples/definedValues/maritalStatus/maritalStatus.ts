import type { FluroMaritalStatus } from '../../../extract/definedValues/maritalStatus'
import { extract as extractMaritalStatus } from '../../../extract/definedValues/maritalStatus'
import { load as loadMaritalStatus } from '../../../load/definedValues/maritalStatus'
import type { RockMaritalStatus } from '../../../load/definedValues/maritalStatus'
import { transform as transformMaritalStatus } from '../../../transform/definedValues/maritalStatus'
import type { ETLTuple } from '../../types'

export const maritalStatusEtl: ETLTuple<FluroMaritalStatus, RockMaritalStatus> =
  [
    'definedValues/maritalStatus',
    extractMaritalStatus,
    transformMaritalStatus,
    loadMaritalStatus
  ]
