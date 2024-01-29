import type { CacheObject } from '../load/types'

export interface CleanupFn {
  (cache: CacheObject): Promise<void>
}
