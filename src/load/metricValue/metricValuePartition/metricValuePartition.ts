import f from 'odata-filter-builder'

import { GET, PATCH, POST, RockApiError, type components } from '../../client'

type RockMetricValuePartition =
  components['schemas']['Rock.Model.MetricValuePartition']

export async function load(
  value: Required<Pick<RockMetricValuePartition, 'MetricValueId'>> &
    RockMetricValuePartition
): Promise<void> {
  const params = {
    query: {
      $filter: f()
        .eq('MetricPartitionId', value.MetricPartitionId)
        .eq('MetricValueId', value.MetricValueId)
        .toString(),
      $select: 'Id',
      $top: 1
    }
  }

  const { data, error } = await GET('/api/MetricValuePartitions', {
    params
  })
  if (error != null)
    throw new RockApiError(error, { cause: { query: params.query } })

  const id = data?.[0]?.Id

  if (id == null) {
    // create new metric value partition
    const { error } = await POST('/api/MetricValuePartitions', {
      body: value
    })

    if (error != null) throw new RockApiError(error, { cause: { body: value } })
  } else {
    // update existing metric value partition
    const { error } = await PATCH(`/api/MetricValuePartitions/{id}`, {
      params: { path: { id } },
      body: value as unknown as Record<string, never>
    })
    if (error != null)
      throw new RockApiError(error, { cause: { id, body: value } })
  }
}
