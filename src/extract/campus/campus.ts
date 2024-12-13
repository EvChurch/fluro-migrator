import { extractFromFluro } from '../lib'
import type { Realm } from '../types'

export type FluroCampus = Realm

export const extract = extractFromFluro<FluroCampus>({
  contentType: 'locationRealm',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    searchInheritable: false,
    filter: {
      filters: [
        {
          comparator: '!=',
          key: 'title',
          value: 'Auckland Ev',
          values: ['Auckland Ev']
        }
      ]
    }
  }
})
