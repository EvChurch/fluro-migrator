import type { ManagedOwner, Option, Owner, Realm } from '../types'

export interface Field {
  defaultValues: string[]
  options: Option[]
  allowedValues: unknown[]
  defaultReferences: unknown[]
  allowedReferences: unknown[]
  developerOnly: unknown[]
  minimum: number
  askCount: number
  maximum: number
  title: string
  type: string
  key: string
  directive: string
  fields: Field[]
  params: {
    restrictType: unknown
    ticketing: {
      enabled: boolean
      events: unknown[]
    }
    realms: unknown[]
    targetRealms: unknown[]
    targetCapabilities: unknown[]
    targetTeams: unknown[]
    targetProcesses: unknown[]
    targetTags: unknown[]
    targetTagsRemove: unknown[]
    targetReactions: unknown[]
    targetEvents: unknown[]
  }
  expressions?: {
    show: string
    value?: string
    hide?: string
  }
}

export interface DemographicsDetails {
  _id: string
  owners: Owner[]
  ownerGroups: unknown[]
  managedOwners: ManagedOwner[]
  status: string
  hashtags: unknown[]
  _references: unknown[]
  mentions: unknown[]
  keywords: string[]
  privacy: string
  realms: Realm[]
  tags: unknown[]
  restrictRealms: string[]
  postTypes: unknown[]
  defaultRealms: unknown[]
  reactions: unknown[]
  filters: unknown[]
  columns: unknown[]
  populateFields: unknown[]
  deepPopulate: unknown[]
  fields: Field[]
  _type: string
  plural: string
  definitionName: string
  title: string
  parentType: string
  firstLine: string
  account: {
    _id: string
    status: string
    timezone: string
    title: string
    countryCode: string
  }
  author: Owner
  managedAuthor: ManagedOwner
  updatedBy: string
  created: string
  updated: string
  triggerReactions: unknown[]
  keyDates: unknown[]
  slug: string
  _checkinProcess: boolean
  __v: number
  statDates: {
    view: string
  }
  stats: {
    view: number
  }
  data: {
    defaultSystemEvents: unknown[]
    slots: unknown[]
    defaultReminders: unknown[]
    defaultPositions: unknown[]
    rosterRealms: unknown[]
    rosterEventTracks: unknown[]
  }
  weight: number
}
