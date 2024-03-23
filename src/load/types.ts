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

export interface AttributeQualifierApiInput {
  IsSystem: boolean
  Key: string
  Value: string
  AttributeId: number
}

export interface CategoriesApiInput {
  Id: number
  Name: string
  IsSystem: boolean
  EntityTypeId: number
  Order: number
}
