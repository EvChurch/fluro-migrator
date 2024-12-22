import z from 'zod'

import { extractFromFluro } from '../lib'

const schema = z.object({
  _id: z.string(),
  status: z.enum(['active']),
  title: z.string(),
  slug: z.string()
})

export type FluroTag = z.infer<typeof schema>

export const extract = extractFromFluro<FluroTag>({
  contentType: 'tag',
  filterBody: {
    allDefinitions: true,
    includeArchived: true
  },
  schema
})
