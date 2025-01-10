import type { MultiBar } from 'cli-progress'

export interface CacheObject {
  rockId: number
  data?: {
    [key: string]: unknown
  }
}
export interface Cache {
  [tupleName: string]: {
    [fluroId: string]: CacheObject
  }
}
export interface LoadFn<T> {
  (value: T, multibar: MultiBar): Promise<CacheObject>
}
