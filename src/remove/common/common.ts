import type { SingleBar } from 'cli-progress'
import { chunk, compact } from 'lodash'

export async function removeData(
  progress: SingleBar,
  data: { Id?: number }[],
  itemFn: (id: number) => Promise<void>
): Promise<void> {
  const chunks = chunk(compact(data.map(({ Id }) => Id)), 50)
  for (const ids of chunks) {
    await Promise.all(
      ids.map(async (id) => {
        await itemFn(id)
        progress.increment()
      })
    )
  }
  progress.stop()
}
