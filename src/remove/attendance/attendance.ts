import type { MultiBar } from 'cli-progress'
import f from 'odata-filter-builder'

import { DELETE, GET, RockApiError } from '../../load/client'
import { removeData } from '../common'

export async function remove(multibar: MultiBar): Promise<void> {
  const { data, error } = await GET('/api/Attendances', {
    params: {
      query: {
        $filter: f().ne('ForeignKey', null).toString(),
        $select: 'Id'
      }
    }
  })

  if (error != null) throw new RockApiError(error)

  await removeData(
    multibar.create(data.length, 0, { name: 'checkin' }),
    data,
    async (id) => {
      const { error } = await DELETE('/api/Attendances/{id}', {
        params: { path: { id } }
      })
      if (error != null) throw new RockApiError(error, { cause: { id } })
    }
  )
}
