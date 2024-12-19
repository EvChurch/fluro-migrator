import { client } from '../../client'
import type { ExtractIterator } from '../../types'

export interface FluroMaritalStatus {
  _id: string
  value: string
  order: number
}

export async function extract(): Promise<
  AsyncIterator<ExtractIterator<FluroMaritalStatus>>
> {
  const { data } = await client.get<{
    type: {
      fields: {
        title: string
        options: { value: string; name: string }[]
      }[]
    }
  }>('/defined/type/contact')

  const values =
    data.type.fields
      .find(({ title }) => title === 'Marital Status')
      ?.options.map(({ value, name }, index) => ({
        _id: value,
        value: name,
        order: index
      }))
      .filter(({ _id }) => _id != '') ?? []
  let repeat = 1

  return {
    next: async (): Promise<{
      value: { collection: FluroMaritalStatus[]; max: number }
      done: boolean
    }> => {
      if (repeat === 0) {
        return await Promise.resolve({
          value: { collection: [], max: values.length },
          done: true
        })
      } else {
        repeat -= 1
        return await Promise.resolve({
          value: { collection: values, max: values.length },
          done: false
        })
      }
    }
  }
}
