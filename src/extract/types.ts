export interface ExtractFn<T> {
  (): Promise<AsyncIterator<ExtractIterator<T>>>
}

export interface Realm {
  _id: string
  title: string
  _type: string
  bgColor?: string
  color?: string
  slug?: string
  definition?: string
}

export interface ManagedOwner {
  _id: string
  _type: string
  firstName: string
  lastName: string
  title: string
}

export interface Owner {
  _id: string
  firstName: string
  lastName: string
  name: string
  _type: string
}

export interface Option {
  name: string
  value: string
  title: string
}

export interface ExtractIterator<T> {
  collection: T[]
  max: number
}

export const PAGE_SIZE = 50
