import { get } from 'lodash'
import { type ZodSchema, z } from 'zod'

import { client } from '../client'
import type { ExtractIterator } from '../types'
import { PAGE_SIZE } from '../types'

interface Filter {
  comparator?: string
  dataType?: 'reference'
  key?: string
  value?: string
  values?: string[] | { _id: string; title: string }[]
}

interface Operator {
  operator?: 'and'
  filters?: (Operator | Filter)[]
}

interface ExtractFromFluroOptions {
  contentType: string
  filterBody?: {
    allDefinitions?: boolean
    includeArchived?: boolean
    searchInheritable?: boolean
    search?: string
    filter?: Operator
  }
  multipleBody?: {
    appendAssignments?: boolean
    select?: string[]
  }
  schema?: ZodSchema
  preprocess?: (values: unknown) => Promise<unknown[]>
  pageSize?: number
}

export function extractFromFluro<T>({
  contentType,
  filterBody = {},
  multipleBody = {},
  schema,
  pageSize = PAGE_SIZE,
  preprocess
}: ExtractFromFluroOptions): () => Promise<AsyncIterator<ExtractIterator<T>>> {
  return async function extract(): Promise<AsyncIterator<ExtractIterator<T>>> {
    const filterReq = await client.post<{ _id: string }[]>(
      `/content/${contentType}/filter`,
      {
        ...filterBody
      }
    )
    const allIds = filterReq.data.map(({ _id }: { _id: string }) => _id)
    const max = allIds.length

    return {
      next: async (): Promise<{
        value: { collection: T[]; max: number }
        done: boolean
      }> => {
        const ids = allIds.splice(0, pageSize)
        const req = await client.post<T[]>(`/content/${contentType}/multiple`, {
          ...multipleBody,
          ids,
          limit: pageSize
        })
        const data = preprocess != null ? await preprocess(req.data) : req.data
        if (data.length === 0) {
          return { value: { collection: [], max }, done: true }
        } else {
          if (schema != null) {
            try {
              return {
                value: {
                  collection: z.array(schema).parse(data) as T[],
                  max
                },
                done: false
              }
            } catch (e) {
              if (e instanceof z.ZodError) {
                e.errors.forEach((err) => {
                  console.error(get(data, err.path))
                })
              }
              throw e
            }
          }
          return { value: { collection: data as T[], max }, done: false }
        }
      }
    }
  }
}
