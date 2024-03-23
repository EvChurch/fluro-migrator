import { client } from '../client'
import type { ExtractIterator } from '../types'
import { PAGE_SIZE } from '../types'

interface ExtractFromFluroOptions<T, R> {
  contentType: string
  filterBody?: {
    allDefinitions?: boolean
    includeArchived?: boolean
    searchInheritable?: boolean
    filter?: {
      filters?: {
        comparator?: string
        key?: string
        value?: string
      }[]
    }
  }
  multipleBody?: {
    appendAssignments?: boolean
    appendContactDetail?: boolean
  }
  postProcessor?: (data: R[]) => T[]
}

export function extractFromFluro<T, Response = T>({
  contentType,
  filterBody = {},
  multipleBody = {},
  postProcessor = (data: Response[]): T[] => data as unknown as T[]
}: ExtractFromFluroOptions<T, Response>): () => Promise<
  AsyncIterator<ExtractIterator<T>>
> {
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
        const ids = allIds.splice(0, PAGE_SIZE)
        const req = await client.post<Response[]>(
          `/content/${contentType}/multiple`,
          {
            ...multipleBody,
            ids,
            limit: PAGE_SIZE
          }
        )
        if (req.data.length === 0) {
          return { value: { collection: [], max }, done: true }
        } else {
          return {
            value: { collection: postProcessor(req.data), max },
            done: false
          }
        }
      }
    }
  }
}
