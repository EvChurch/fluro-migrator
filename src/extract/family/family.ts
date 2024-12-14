import { extractFromFluro } from '../lib'

import type { FluroFamily } from './types'

export const extract = extractFromFluro<FluroFamily>({
  contentType: 'family',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    search: '5c0d99eb44d30a36d8c55d3d' // nikora
  }
})
