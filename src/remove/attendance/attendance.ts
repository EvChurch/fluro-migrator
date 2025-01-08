import f from 'odata-filter-builder'

import { DELETE, GET, RockApiError } from '../../load/client'
import { removeData } from '../common'

export async function remove(): Promise<void> {
  const { data, error } = await GET('/api/Attendances', {
    params: {
      query: {
        $filter: f().ne('ForeignKey', null).toString(),
        $select: 'Id'
      }
    }
  })

  if (error != null) throw new RockApiError(error)

  await removeData(data, async (id) => {
    const { error } = await DELETE('/api/Attendances/{id}', {
      params: { path: { id } }
    })
    if (error != null) throw new RockApiError(error, { cause: { id } })
  })
}
