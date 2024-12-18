import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

import { updatePersonProfilePhoto } from './avatar'
import { load as loadNumber } from './phoneNumber'
import { getRecordStatus } from './recordStatus'

export type RockContact = components['schemas']['Rock.Model.Person'] & {
  ForeignKey: string
  data: {
    GroupRoleId: number
    PhoneNumber: string[]
    FluroRecordStatus: string
    AttributeValues: {
      [key: string]: string | undefined
    }
  }
}

export async function load(value: RockContact): Promise<CacheObject> {
  const cacheObject = await loadContact(value)

  const params = {
    query: {
      loadAttributes: 'simple' as const
    },
    path: {
      id: cacheObject.rockId
    }
  }

  const { data, error } = await GET('/api/People/{id}', { params })
  if (error != null) throw new RockApiError(error, { cause: { params } })
  if (data == null) throw new Error('Person not found')

  await updatePersonProfilePhoto(data, value)

  if (value.data.PhoneNumber.length > 0)
    await loadNumber(
      value.data.PhoneNumber[0],
      cacheObject.rockId,
      value.ForeignKey
    )

  for (const attributeKey of Object.keys(value.data.AttributeValues)) {
    const attributeValue = value.data.AttributeValues[attributeKey]

    if (attributeValue == null) continue

    if (data.AttributeValues?.[attributeKey].Value != attributeValue) {
      const params = {
        path: {
          id: cacheObject.rockId
        },
        query: {
          attributeKey,
          attributeValue
        }
      }
      const { error } = await POST('/api/People/AttributeValue/{id}', {
        params
      })
      if (error != null) throw new RockApiError(error, { cause: { params } })
    }
  }

  return cacheObject
}

async function loadContact(value: RockContact): Promise<CacheObject> {
  const params = {
    query: {
      $filter: f().eq('ForeignKey', value.ForeignKey).toString(),
      $select: 'Id, PrimaryFamilyId, Guid'
    }
  }
  const { data, error } = await GET('/api/People', { params })
  if (error != null) throw new RockApiError(error, { cause: { params } })

  if (data != null && data.length > 0 && data[0].Id != null) {
    // person exists
    let log = 'person exists'

    // add existing person to family if primary family id exists
    if (
      value.PrimaryFamilyId != null &&
      value.PrimaryFamilyId !== data[0].PrimaryFamilyId
    ) {
      const params = {
        query: {
          personId: data[0].Id,
          familyId: value.PrimaryFamilyId,
          groupRoleId: value.data.GroupRoleId,
          removeFromOtherFamilies: true
        }
      }
      const { error } = await POST('/api/People/AddExistingPersonToFamily', {
        params
      })
      if (error != null) throw new RockApiError(error, { cause: { params } })
      log = `person exists, moving to new family ${value.PrimaryFamilyId} from ${data[0].PrimaryFamilyId}`
    }

    // finally - update the contact
    const params = {
      path: {
        id: data[0].Id
      }
    }
    const body: Omit<RockContact, 'Gender' | 'data' | 'ForeignKey'> & {
      Gender: number
    } = omit(
      {
        ...value,
        RecordStatusValueId: await getRecordStatus(
          value.data.FluroRecordStatus
        ),
        Gender: { Unknown: 0, Male: 1, Female: 2 }[value.Gender]
      },
      ['data', 'PrimaryFamilyId', 'ForeignKey', 'BirthDate']
    )

    const { error } = await PATCH('/api/People/{id}', {
      params,
      body: body as unknown as Record<string, never>
    })

    if (error != null) throw new RockApiError(error, { cause: { body } })

    return {
      rockId: data[0].Id,
      data: {
        log
      }
    }
  } else {
    // person does not exist

    // add new person to family if primary family id exists
    if (value.PrimaryFamilyId != null) {
      const params = {
        path: {
          familyId: value.PrimaryFamilyId
        },
        query: {
          groupRoleId: value.data.GroupRoleId
        }
      }
      const body = omit(
        {
          ...value,
          RecordStatusValueId: await getRecordStatus(
            value.data.FluroRecordStatus
          )
        },
        ['data']
      )
      const { data, error } = await POST(
        '/api/People/AddNewPersonToFamily/{familyId}',
        { params, body }
      )
      if (error != null)
        throw new RockApiError(error, { cause: { params, body } })

      return {
        rockId: data as unknown as number,
        data: {
          log: `person does not exist, add new person to family ${value.PrimaryFamilyId}`
        }
      }
    } else {
      // create new person if primary family id does not exist
      const body = omit(
        {
          ...value,
          RecordStatusValueId: await getRecordStatus(
            value.data.FluroRecordStatus
          )
        },
        ['data']
      )
      const { data, error } = await POST('/api/People', {
        body
      })
      if (error != null) throw new RockApiError(error, { cause: { body } })

      return {
        rockId: data as unknown as number,
        data: {
          log: 'person does not exist, create new person with new family'
        }
      }
    }
  }
}
