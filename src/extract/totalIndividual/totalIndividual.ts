import z from 'zod'

import { extractFromFluro } from '../lib'

const schema = z.object({
  _id: z.string(),
  count: z.number(),
  realms: z.array(
    z.object({
      _id: z.string(),
      title: z.string()
    })
  ),
  event: z.object({
    startDate: z.string().datetime()
  })
})

export type FluroTotalIndividual = z.infer<typeof schema>

export const extract = extractFromFluro<FluroTotalIndividual>({
  contentType: 'totalIndividuals',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    searchInheritable: false,
    filter: {
      filters: []
    }
  },
  schema
})
