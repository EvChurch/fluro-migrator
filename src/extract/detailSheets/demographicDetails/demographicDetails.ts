import { extractFromFluro } from '../../lib'
import type { DemographicsDetails } from '../types'

export type FluroDemographicDetails = DemographicsDetails

export const extract = extractFromFluro<FluroDemographicDetails>({
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
          value: 'contactdetail'
        },
        {
          comparator: '==',
          key: 'definitionName',
          value: 'demographicsDetails'
        }
      ]
    }
  }
})
