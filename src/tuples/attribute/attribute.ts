import type { FluroAttribute } from '../../extract/attribute'
import { extract as extractAttribute } from '../../extract/attribute'
import type { RockAttribute } from '../../load/attribute'
import { load as loadAttribute } from '../../load/attribute'
import { transform as transformAttribute } from '../../transform/attribute'
import type { ETLTuple } from '../types'

export const attributeEtl: ETLTuple<FluroAttribute, RockAttribute> = [
  'attribute',
  extractAttribute,
  transformAttribute,
  loadAttribute
]
