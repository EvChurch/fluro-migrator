import z from 'zod'

import { extractFromFluro } from '../lib'

const schema = z
  .object({
    _id: z.string(),
    realms: z
      .preprocess(
        (val) => {
          if (Array.isArray(val)) {
            // eslint-disable-next-line
            return val.filter((realm) => realm.definition === 'locationRealm')
          }
          return []
        },
        z.array(
          z.object({
            _id: z.string(),
            title: z.union([
              z.literal('Central'),
              z.literal('North'),
              z.literal('Unichurch')
            ]),
            definition: z.literal('locationRealm')
          })
        )
      )
      .refine((realms) => realms.length === 1)
      .transform((realms) => realms[0]),
    startDate: z.string().datetime(),
    definition: z.literal('service'),
    track: z
      .object({
        _id: z.string(),
        title: z.string(),
        definition: z.literal('serviceTime')
      })
      .optional()
  })
  .transform(({ realms, ...rest }) => ({ realm: realms, ...rest }))

export type FluroService = z.infer<typeof schema>

export const extract = extractFromFluro<FluroService>({
  contentType: 'service',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    searchInheritable: false,
    filter: {
      filters: [
        {
          comparator: 'in',
          key: 'realms',
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
        }
      ]
    }
  },
  schema
})
