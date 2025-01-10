import type { FluroCheckin } from '../../extract/checkin'
import type { RockAttendance } from '../../load/attendance'
import type { Cache } from '../../load/types'

export function transform(
  cache: Cache,
  value: FluroCheckin,

  skipServiceValidation = false
): RockAttendance | undefined {
  const service = cache['service'][value.event._id]
  const contact = cache['contact'][value.contact._id]

  if ((service == null && skipServiceValidation == false) || contact == null)
    return

  const obj: RockAttendance = {
    ForeignKey: value._id,
    OccurrenceId: service?.rockId,
    PersonAliasId: contact.data?.PrimaryAliasId as number | undefined,
    CampusId:
      (contact.data?.PrimaryCampusId as number | null | undefined) ?? undefined,
    DidAttend: true,
    StartDateTime: new Date(value.created).toLocaleString('sv')
  }

  return obj
}
