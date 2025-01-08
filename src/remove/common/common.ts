import colors from 'ansi-colors'
import { SingleBar } from 'cli-progress'
import { chunk, compact } from 'lodash'

export async function removeData(
  data: { Id?: number }[],
  itemFn: (id: number) => Promise<void>
): Promise<void> {
  const progress = new SingleBar({
    format: `${colors.cyan(
      '{bar}'
    )} checkin | {percentage}% | {value}/{total} | duration: {duration_formatted}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  })

  progress.start(data.length, 0)
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
