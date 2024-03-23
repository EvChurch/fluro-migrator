import {
  type FluroDemographicDetails,
  extract
} from '../../extract/detailSheets/demographicDetails'
import {
  type RockDemographicDetails,
  load
} from '../../load/detailSheets/demographicDetails'
import { transform } from '../../transform/detailSheets/demographicDetails'
import type { ETLTuple } from '../types'

export const demographicDetailsETL: ETLTuple<
  FluroDemographicDetails,
  RockDemographicDetails
> = ['definition/contact', extract, transform, load]
