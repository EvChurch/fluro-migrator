import { compact } from 'lodash'

import { GroupIdMap, LocationIdMap, ScheduleIdMap } from '../../defaults'
import type { FluroService } from '../../extract/service'
import type { RockAttendanceOccurence } from '../../load/attendanceOccurence'
import type { Cache } from '../../load/types'
import { transform as transformCheckin } from '../checkin'

export function transform(
  cache: Cache,
  value: FluroService
): RockAttendanceOccurence {
  const LocationId = LocationIdMap[value.realm.title]
  const ScheduleId =
    ScheduleIdMap[
      value.realm.title === 'Unichurch' ? 'SundayNight' : 'SundayMorning'
    ]

  const Attendances = compact(
    value.checkins.map((checkin) => transformCheckin(cache, checkin, true))
  )

  const obj: RockAttendanceOccurence = {
    GroupId: GroupIdMap['WeekendService'],
    ForeignKey: value._id,
    LocationId,
    ScheduleId,
    OccurrenceDate: `${new Date(value.startDate).toLocaleDateString(
      'sv'
    )}T00:00:00`,
    data: {
      Attendances
    }
  }

  return obj
}
