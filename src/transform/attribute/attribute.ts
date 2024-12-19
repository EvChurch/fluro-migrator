import { omit } from 'lodash'

import type { FluroAttribute } from '../../extract/attribute'
import type { RockAttribute } from '../../load/attribute'
import type { Cache } from '../../load/types'

export function transform(_cache: Cache, value: FluroAttribute): RockAttribute {
  return { ...omit(value, '_id'), Key: value._id }
}
