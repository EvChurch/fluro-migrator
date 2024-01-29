import type { Realm } from '../types'

export interface FluroTeam {
  _id: string
  status: string
  keywords: string[]
  privacy: string
  provisionalMembers: ProvisionalMember[]
  provisionalRoles: ProvisionalRole[]
  realms: Realm[]
  visibleAssigned: boolean
  visibleMembers: boolean
  assignments: Assignment[]
  _type: string
  title: string
  definition: string
  updatedBy: string
  created: string
  updated: string
  slug: string
  _realm: string
  __v: number
  lastStatDate: string
  _sid: number
}

export interface ProvisionalMember {
  _id: string
  status: string
  realms: string[]
  _type: string
  firstName: string
  title: string
  lastName: string
  definition: string
  created: string
  updated: string
  timezone: string
}

export interface ProvisionalRole {
  _id: string
  status: string
  realms: string[]
  _type: string
  title: string
  created: string
  updated: string
  firstLine: string
}

export interface Assignment {
  contacts: Contact[]
  roles: Role[]
  _id: string
  title: string
  reporter?: boolean
  shareDetails?: boolean
  visible?: boolean
  exclude?: boolean
}

export interface Contact {
  _id: string
  status: string
  realms: string[]
  _type: string
  firstName: string
  title: string
  lastName: string
  definition: string
  created: string
  updated: string
  timezone: string
}

export interface Role {
  _id: string
  status: string
  realms: string[]
  title: string
  firstLine: string
  _type: string
  created: string
  updated: string
}
