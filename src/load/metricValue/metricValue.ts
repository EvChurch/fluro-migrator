import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { components } from '../client'
import { GET, PATCH, POST, RockApiError } from '../client'
import type { CacheObject } from '../types'

import { load as loadMetricValuePartition } from './metricValuePartition'

export type RockMetricValue = components['schemas']['Rock.Model.MetricValue']

async function loadMetricValue(value: RockMetricValue): Promise<CacheObject> {
  const { data, error } = await GET('/api/MetricValues', {
    params: {
      query: {
        $filter: f().eq('ForeignKey', value.ForeignKey).toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)

  if (data != null && data.length > 0 && data[0].Id != null) {
    // metricvalue exists
    const { error } = await PATCH('/api/MetricValues/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: value as unknown as Record<string, never>
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })
    return { rockId: data[0].Id }
  } else {
    // metricvalue does not exist
    const { data, error } = await POST('/api/MetricValues', {
      body: value
    })
    if (error != null) throw new RockApiError(error, { cause: { value } })

    return { rockId: data as unknown as number }
  }
}

export async function load(value: RockMetricValue): Promise<CacheObject> {
  const cacheObject = await loadMetricValue(
    omit(value, 'MetricValuePartitions')
  )

  for (const metricValuePartition of value.MetricValuePartitions ?? []) {
    await loadMetricValuePartition({
      ...metricValuePartition,
      MetricValueId: cacheObject.rockId
    })
  }

  return cacheObject
}
