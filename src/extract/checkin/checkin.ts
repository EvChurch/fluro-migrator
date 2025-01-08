import z from 'zod'

import { extractFromFluro } from '../lib'

const schema = z.object({
  _id: z.string(),
  created: z.string().datetime(),
  event: z.object({
    _id: z.string()
  }),
  contact: z.object({
    _id: z.string()
  })
})

export type FluroCheckin = z.infer<typeof schema>

export const extract = extractFromFluro<FluroCheckin>({
  contentType: 'checkin',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    searchInheritable: false,
    filter: {
      filters: [
        {
          operator: 'and',
          filters: [
            {
              comparator: '==',
              key: '_event.definition',
              value: 'service'
            },
            {
              comparator: 'in',
              key: '_event.realms',
              values: [
                {
                  _id: '5c0d9d3e7ef61e100ae4514b',
                  title: 'Central'
                },
                {
                  _id: '602a45dca496aa1201f4ccc0',
                  title: 'North'
                },
                {
                  _id: '5c0d9d497ef61e100ae45153',
                  title: 'Unichurch'
                }
              ]
            },
            {
              comparator: '==',
              key: 'contact',
              value: '5c05059148890574c5395ccb'
            }
          ]
        }
      ]
    }
  },
  schema
})
