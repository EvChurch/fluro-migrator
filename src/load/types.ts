import type { components } from './client'

export interface CacheObject {
  rockId: number
  data?: {
    [key: string]: unknown
  }
}
export interface Cache {
  [tupleName: string]: {
    [fluroId: string]: CacheObject
  }
}
export interface LoadFn<T> {
  (value: T): Promise<CacheObject>
}

export type AttributeQualifierApiInput = Pick<
  components['schemas']['Rock.Model.AttributeQualifier'],
  'Key' | 'Value' | 'IsSystem' | 'AttributeId'
>

export type CategoriesApiInput = Pick<
  components['schemas']['Rock.Model.Category'],
  'Id' | 'Name' | 'IsSystem' | 'EntityTypeId' | 'Order'
>
