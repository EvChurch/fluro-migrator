import type { components } from '../../client'
import { DELETE, POST, RockApiError } from '../../client'
import type { RockContact } from '../contact'

export async function load(
  data: components['schemas']['Rock.Model.Person'],
  value: RockContact
): Promise<void> {
  if (data.Id == null) return

  for (const attributeKey of Object.keys(value.data.AttributeValues)) {
    const attributeValue = value.data.AttributeValues[attributeKey]

    if (data.AttributeValues?.[attributeKey].Value != attributeValue) {
      if (attributeValue == null || attributeValue == '') {
        // delete attribute value
        const params = {
          path: {
            id: data.Id
          },
          query: {
            attributeKey
          }
        }
        const { error } = await DELETE('/api/People/AttributeValue/{id}', {
          params
        })
        if (error != null)
          throw new RockApiError(error, {
            cause: { path: params.path, query: params.query }
          })
      } else {
        // update attribute value
        const params = {
          path: {
            id: data.Id
          },
          query: {
            attributeKey,
            attributeValue: attributeValue
          }
        }
        const { error } = await POST('/api/People/AttributeValue/{id}', {
          params
        })
        if (error != null)
          throw new RockApiError(error, {
            cause: { path: params.path, query: params.query }
          })
      }
    }
  }
}
