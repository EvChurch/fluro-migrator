import f from 'odata-filter-builder'

import { GET, RockApiError } from '../../client'

let DefinedTypeId: number

function transformStatus(
  fluroRecordStatus: string
): 'Active' | 'Pending' | 'Inactive' {
  switch (fluroRecordStatus) {
    case 'active':
      return 'Active'
    case 'draft':
      return 'Pending'
    default:
    case 'inactive':
      return 'Inactive'
  }
}

export async function getRecordStatus(
  fluroRecordStatus: string
): Promise<number | undefined> {
  // get defiend value type id of a Record Status
  if (DefinedTypeId === undefined) {
    const { data, error } = await GET('/api/DefinedTypes', {
      params: {
        query: {
          $filter: f().eq('Name', 'Record Status').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data?.[0].Id == null)
      throw new Error("Couldn't find Defined Type Id in Record Status")

    DefinedTypeId = data?.[0].Id
  }
  // get the defined value Id and return it so it can be used by contact.ts post
  const { data: definedValue, error } = await GET('/api/DefinedValues', {
    params: {
      query: {
        $filter: f()
          .eq('DefinedTypeId', DefinedTypeId)
          .and(f().eq('Value', transformStatus(fluroRecordStatus)))
          .toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)
  return definedValue[0].Id
}
