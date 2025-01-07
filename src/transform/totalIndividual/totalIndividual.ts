import type { FluroTotalIndividual } from '../../extract/totalIndividual'
import type { RockMetricValue } from '../../load/metricValue'
import type { Cache } from '../../load/types'

/**
 * transforms a fluro api totalIndividual object to a rock metric object
 */
export function transform(
  _cache: Cache,
  value: FluroTotalIndividual
): RockMetricValue {
  const obj: RockMetricValue = {
    ForeignKey: value._id,
    YValue: value.count,
    MetricId: 2, // Total Attendance,
    MetricValueDateTime: `${new Date(value.event.startDate).toLocaleDateString(
      'sv'
    )}T00:00:00`,
    MetricValuePartitions: {
      North: [
        {
          MetricPartitionId: 2, // Campus (67)
          EntityId: 2 // North
        },
        {
          MetricPartitionId: 4, // Service (54)
          EntityId: 4 // 10:15am
        }
      ],
      Central: [
        {
          MetricPartitionId: 2, // Campus (67)
          EntityId: 3 // Central
        },
        {
          MetricPartitionId: 4, // Service (54)
          EntityId: 4 // 10:15am
        }
      ],
      Unichurch: [
        {
          MetricPartitionId: 2, // Campus (67)
          EntityId: 4 // Unichurch
        },
        {
          MetricPartitionId: 4, // Service (54)
          EntityId: 5 // 5:15pm
        }
      ]
    }[value.realms[0].title]
  }

  return obj
}
