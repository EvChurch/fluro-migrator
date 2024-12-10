import { extractFromFluro } from '../../lib'
import type { FluroDefinition } from '../types'

export type FluroDefinitionContact = FluroDefinition

export const extract = extractFromFluro<FluroDefinitionContact>({
  contentType: 'definition',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    searchInheritable: false,
    filter: {
      filters: [
        {
          comparator: '==',
          key: 'parentType',
          value: 'contact'
        },
        {
          comparator: 'notin',
          key: 'definitionName',
          values: ['leader', 'leaderOfLeaders']
        }
      ]
    }
  }
})
