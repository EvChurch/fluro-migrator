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

export interface ExtractIterator<T> {
  collection: T[]
  max: number
}

export const PAGE_SIZE = 50
