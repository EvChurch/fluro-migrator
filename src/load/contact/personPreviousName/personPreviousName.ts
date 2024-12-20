import f from 'odata-filter-builder'

import { GET, POST, RockApiError, type components } from '../../client'
import type { RockContact } from '../contact'

export async function load(
  person: components['schemas']['Rock.Model.Person'],
  value: RockContact
): Promise<void> {
  if (person.PrimaryAliasId == null) return
  if (value.data.PersonPreviousName == null) return

  const params = {
    query: {
      $filter: f()
        .eq('PersonAliasId', person.PrimaryAliasId)
        .eq('LastName', value.data.PersonPreviousName)
        .toString(),
      $select: 'Id'
    }
  }

  const { data, error } = await GET('/api/PersonPreviousNames', {
    params
  })
  if (error != null)
    throw new RockApiError(error, { cause: { query: params.query } })

  if (data?.length === 0) {
    // create new person previous name
    const body = {
      PersonAliasId: person.PrimaryAliasId,
      LastName: value.data.PersonPreviousName
    }

    const { error } = await POST('/api/PersonPreviousNames', {
      body
    })

    if (error != null) throw new RockApiError(error, { cause: { body } })
  }
}
