import type { ExtractFn } from '../extract/types'
import type { LoadFn } from '../load/types'
import type { TransformFn } from '../transform/types'

export type ETLTuple<TInput, TOutput> = [
  name: string,
  extract: ExtractFn<TInput>,
  transform: TransformFn<TInput, TOutput | undefined>,
  load: LoadFn<TOutput>,
  remove?: () => Promise<void>
]
