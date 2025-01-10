interface DefinedValueMap {
  [fluroId: string]: number
  _default: number
}

export const GroupRoleId: DefinedValueMap = {
  child: 4,
  _default: 3 // Adult
}
export const LocationIdMap = {
  Central: 2,
  North: 2401,
  Unichurch: 2402
}

export const ScheduleIdMap = {
  SundayMorning: 4,
  SundayNight: 5
}

export const GroupIdMap = {
  WeekendService: 28384
}

export const TagIdMap = {
  UnsubscribedFromSMS: 61,
  UnsubscribedFromEmail: 84
}
