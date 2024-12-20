import f from 'odata-filter-builder'

import type { components } from '../../client'
import { GET, POST, RockApiError } from '../../client'
import type { RockContact } from '../contact'

let NumberTypeValueId: number

export async function load(
  data: components['schemas']['Rock.Model.Person'],
  value: RockContact
): Promise<void> {
  if (data.Id == null) return

  const phoneNumber = value.data.PhoneNumber[0]
  const fluroId = value.ForeignKey
  const personId = data.Id

  if (phoneNumber == null) return

  // get number type value id - add number in as "mobile" by default
  if (NumberTypeValueId === undefined) {
    const { data, error } = await GET('/api/DefinedValues', {
      params: {
        query: {
          $filter: f().eq('Description', 'Mobile/Cell phone number').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data?.[0].Id == null)
      throw new Error("Couldn't find Number Type Id in Defined Values")

    NumberTypeValueId = data?.[0].Id
  }
  // check if current number already exists
  const { data: phoneNumberData, error } = await GET('/api/PhoneNumbers', {
    params: {
      query: {
        $filter: f().eq('Number', `${phoneNumber}`).toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  //if it doesnt exist then add the number
  if (phoneNumberData == null || phoneNumberData?.length === 0) {
    const value = {
      PersonId: personId,
      CountryCode: '+64',
      Number: phoneNumber.substring(0, 19),
      NumberTypeValueId,
      ForeignKey: fluroId,
      FullNumber: `64${phoneNumber}`.substring(0, 22),
      IsSystem: false,
      IsMessagingEnabled: false
    }
    const { error } = await POST('/api/PhoneNumbers', {
      body: value
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })
  }
}
