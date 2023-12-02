export interface ExtractObject {
  id: string
}

export type ExtractFn<T = ExtractObject[]> = () => Promise<AsyncIterator<T>>
