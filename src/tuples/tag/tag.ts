import type { FluroTag } from '../../extract/tag'
import { extract as extractTag } from '../../extract/tag'
import type { RockTag } from '../../load/tag'
import { load as loadTag } from '../../load/tag'
import { transform as transformTag } from '../../transform/tag'
import type { ETLTuple } from '../types'

export const tagEtl: ETLTuple<FluroTag, RockTag> = [
  'tag',
  extractTag,
  transformTag,
  loadTag
]
