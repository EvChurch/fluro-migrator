import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

import { load as loadAttribute } from './attribute'
import { load as loadAvatar } from './avatar'
import { load as loadPersonPreviousName } from './personPreviousName'
import { load as loadNumber } from './phoneNumber'
import { getRecordStatus } from './recordStatus'
import { load as loadStep } from './step'
import { load as loadTag } from './tag'

export type Step =
  | {
      StepStatusId: number
      CompletedDateTime: string | undefined
      StartDateTime: string | undefined
      EndDateTime: string | undefined
      AttributeValues: {
        [key: string]: string | null | undefined
      }
    }
  | undefined

export type RockContact = components['schemas']['Rock.Model.Person'] & {
  ForeignKey: string
  data: {
    GroupRoleId: number
    PhoneNumber: string[]
    FluroRecordStatus: string
    PersonPreviousName: string | undefined
    steps: {
      step: Step
      StepTypeId: number
    }[]
    AttributeValues: {
      [key: string]: string | null | undefined
    }
    TagIds: number[]
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

  await loadAvatar(data, value)
  await loadNumber(data, value)
  await loadAttribute(data, value)
  await loadPersonPreviousName(data, value)
  for (const { step, StepTypeId } of value.data.steps) {
    await loadStep(data, step, StepTypeId)
  }
  await loadTag(data, value)

  return {
    ...cacheObject,
    data: {
      ...cacheObject.data,
      PrimaryAliasId: data.PrimaryAliasId,
      PrimaryCampusId: data.PrimaryCampusId
    }
  }
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
