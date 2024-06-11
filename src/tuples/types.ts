import type { CleanupFn } from '../cleanup/types'
import type { ExtractFn } from '../extract/types'
import type { LoadFn } from '../load/types'
import type { TransformFn } from '../transform/types'

export type ETLTuple<TInput, TOutput> = [
  name: string,
  extract: ExtractFn<TInput>,
  transform: TransformFn<TInput, TOutput>,
  load: LoadFn<TOutput>,
  cleanup?: CleanupFn
]
