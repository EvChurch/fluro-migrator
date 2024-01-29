import { extractFromFluro } from '../../lib'
import type { FluroDefinition } from '../types'

export interface FluroPosition {
  expanded?: boolean
  reporter?: boolean
  shareDetails?: boolean
  title: string
  visible?: boolean
}

export type FluroDefinitionTeam = FluroDefinition<{
  defaultPositions?: FluroPosition[]
}>

export const extract = extractFromFluro<FluroDefinitionTeam>({
  contentType: 'definition',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    searchInheritable: true,
    filter: {
      filters: [
        {
          comparator: '==',
          key: 'parentType',
          value: 'team'
        }
      ]
    }
  }
})
