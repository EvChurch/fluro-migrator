import { extractFromFluro } from '../lib'

import type { FluroContact } from './types'

export const extract = extractFromFluro<FluroContact>({
  contentType: 'contact',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    // search: '5fefe87196930a095efc8e88' // tatai
    search: '5fefe87196930a095efc8e88' // jeanny
  }
})
