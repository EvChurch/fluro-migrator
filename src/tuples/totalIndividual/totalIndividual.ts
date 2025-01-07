import { extract as extractTotalIndividual } from '../../extract/totalIndividual'
import type { FluroTotalIndividual } from '../../extract/totalIndividual'
import type { RockMetricValue } from '../../load/metricValue'
import { load as loadMetricValue } from '../../load/metricValue'
import { transform as transformTotalIndividual } from '../../transform/totalIndividual'
import type { ETLTuple } from '../types'

export const totalIndividualEtl: ETLTuple<
  FluroTotalIndividual,
  RockMetricValue
> = [
  'totalIndividual',
  extractTotalIndividual,
  transformTotalIndividual,
  loadMetricValue
]
