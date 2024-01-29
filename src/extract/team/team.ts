import { extractFromFluro } from '../lib'

import type { FluroTeam } from './types'

export const extract = extractFromFluro<FluroTeam>({
  contentType: 'team',
  filterBody: {
    allDefinitions: true,
    includeArchived: true
  },
  multipleBody: {
    appendAssignments: true,
    appendContactDetail: true
  }
})
