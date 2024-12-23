import { omit } from 'lodash'
import f from 'odata-filter-builder'

import { GET, PATCH, POST, RockApiError, type components } from '../../client'
import type { CacheObject } from '../../types'
import type { Step } from '../contact'

import { load as loadAttribute } from './attribute'

export async function load(
  person: components['schemas']['Rock.Model.Person'],
  value: Step | undefined,
  StepTypeId: number
): Promise<void> {
  const cacheObject = await loadStep(person, value, StepTypeId)

  if (cacheObject == null) return

  const params = {
    path: {
      id: cacheObject.rockId
    },
    query: {
      loadAttributes: 'simple' as const
    }
  }

  const { data, error } = await GET('/api/Steps/{id}', {
    params
  })

  if (error != null) throw new RockApiError(error, { cause: { ...params } })

  await loadAttribute(value?.AttributeValues ?? {}, data)
}

async function loadStep(
  person: components['schemas']['Rock.Model.Person'],
  value: Step | undefined,
  StepTypeId: number
): Promise<CacheObject | undefined> {
  if (person.PrimaryAliasId == null || value == null) return

  const params = {
    query: {
      $filter: f()
        .eq('PersonAliasId', person.PrimaryAliasId)
        .eq('StepTypeId', StepTypeId)
        .toString()
    }
  }

  const { data, error } = await GET('/api/Steps', {
    params
  })

  if (error != null)
    throw new RockApiError(error, { cause: { query: params.query } })

  if (data?.length === 0) {
    // create new step
    const body = {
      PersonAliasId: person.PrimaryAliasId,
      StepTypeId,
      CampusId: person.PrimaryCampusId,
      ...omit(value, 'AttributeValues')
    }

    const { data, error } = await POST('/api/Steps', {
      body
    })

    if (error != null)
      throw new RockApiError(error, { cause: { body, id: person.Id } })

    return {
      rockId: data as unknown as number
    }
  } else {
    // update existing step
    const Id = data[0].Id as number

    const body = {
      PersonAliasId: person.PrimaryAliasId,
      StepTypeId,
      CampusId: person.PrimaryCampusId,
      ...omit(value, 'AttributeValues')
    }

    const { error } = await PATCH('/api/Steps/{id}', {
      params: { path: { id: Id } },
      body: body as unknown as Record<string, never>
    })

    if (error != null)
      throw new RockApiError(error, { cause: { body, id: person.Id } })

    return {
      rockId: Id
    }
  }
}
