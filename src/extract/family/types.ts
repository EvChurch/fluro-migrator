import type { Realm } from '../types'

interface Address {
  addressLine1?: string
  addressLine2?: string
  suburb?: string
  state?: string
  longitude?: string
  latitude?: string
  postalCode: string | null
  country?: string
}

export interface FluroFamily {
  _id: string
  status: string
  realms: Realm[]
  address: Address
  postalAddress?: Address
  samePostal: boolean
  title: string
  _type: string
  created: string
  updated: string
  firstLine: string
}
