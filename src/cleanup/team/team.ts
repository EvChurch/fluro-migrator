import { DELETE } from '../../load/client'
import type { CacheObject } from '../../load/types'

export async function cleanup(cache: CacheObject): Promise<void> {
  await DELETE('/api/Groups/{id}', {
    params: {
      path: {
        id: cache.rockId
      }
    }
  })
}
